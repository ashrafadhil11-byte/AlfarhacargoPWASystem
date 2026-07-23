// notifications.js - Persistent Notification Manager for Al-Farha PWA

const DISMISSED_KEY = 'afc_dismissed_notifications';
let activeDeliveryPkg = null;
let currentDeliveries = []; // Caches the current API fetch

// Retrieve permanently dismissed notifications from local storage
function getDismissedIDs() {
  return JSON.parse(localStorage.getItem(DISMISSED_KEY) || '[]');
}

// Filters the API data and builds the UI
function processNotifications(recentDelivered) {
  if (!recentDelivered) return;
  currentDeliveries = recentDelivered;
  
  const dismissedIDs = getDismissedIDs();
  
  // Filter out any ID that has already been dismissed forever
  const unread = recentDelivered.filter(item => !dismissedIDs.includes(item.id));
  
  const badge = document.getElementById('mobBellBadge');
  const notifList = document.getElementById('mobNotifList');
  
  if (!badge || !notifList) return;

  if (unread.length > 0) {
    badge.innerText = unread.length;
    badge.classList.add('show');
    notifList.innerHTML = '';
    
    unread.forEach(item => {
      const div = document.createElement('div');
      div.className = 'notif-item';
      div.onclick = function() { 
        triggerDeliveryPopup(item); 
        // Close the bottom sheet if the function exists in the main DOM
        if(typeof closeBottomSheet === 'function') closeBottomSheet('force', 'notifSheet'); 
      };
      div.innerHTML = `
        <div class="notif-icon"><i class="bi bi-box-seam"></i></div>
        <div class="notif-details">
          <span class="notif-awb">${item.id} Delivered</span>
          <span class="notif-msg">${item.dest}</span>
        </div>`;
      notifList.appendChild(div);
    });
  } else {
    // Hide the red badge and show the empty state
    badge.classList.remove('show');
    notifList.innerHTML = '<div style="text-align: center; color: #94a3b8; padding: 40px 20px;"><i class="bi bi-bell-slash" style="font-size: 2rem; margin-bottom:10px; display:block;"></i> All caught up!</div>';
  }
}

// Opens the specific delivery alert modal
function triggerDeliveryPopup(pkg) {
  activeDeliveryPkg = pkg;
  document.querySelector('#mobDeliveryAlert .alert-title').innerText = pkg.id + ' Delivered!';
  document.getElementById('alertDescText').innerText = `Destination: ${pkg.dest}`;
  document.getElementById('mobDeliveryAlert').classList.add('active');
}

// Dismisses the notification forever
function markDeliveryRead() {
  if (activeDeliveryPkg && activeDeliveryPkg.id) {
    const dismissed = getDismissedIDs();
    // Add to dismissed list if not already there
    if (!dismissed.includes(activeDeliveryPkg.id)) {
      dismissed.push(activeDeliveryPkg.id);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
    }
  }
  
  // Close Modal
  document.getElementById('mobDeliveryAlert').classList.remove('active');
  activeDeliveryPkg = null;
  
  // Refresh the notification UI instantly without needing an API call
  processNotifications(currentDeliveries);
}

// Sends the WhatsApp message, then automatically dismisses the notification
function notifyPartyAction() {
  if (!activeDeliveryPkg) return;
  let cleanPhone = (activeDeliveryPkg.shipperPhone || "").replace(/[^0-9]/g, ""); 
  if (!cleanPhone || cleanPhone.length < 8) {
    alert("No valid phone number saved.");
    return;
  }

  let msg = `Hello *${activeDeliveryPkg.shipperName || "Customer"}*! 📦✨\n\nYour shipment with *Al-Farha Cargo* has been DELIVERED.\n\n📌 *ID:* ${activeDeliveryPkg.id}\n📍 *Destination:* ${activeDeliveryPkg.dest}\n\nThank you! 🚚💨`;
  window.open("https://wa.me/" + cleanPhone + "?text=" + encodeURIComponent(msg), '_blank');
  
  markDeliveryRead();
}