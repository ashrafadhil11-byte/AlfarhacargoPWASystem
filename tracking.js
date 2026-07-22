// tracking.js - Modular Live Tracking System for Al-Farha Cargo

// 1. Inject Styles and Modal HTML when the script loads
function injectTrackingSystem() {
  const trackingStyles = `
    <style>
      /* Smooth Fade-in for Timeline */
      @keyframes fadeUpIn {
        from { opacity: 0; transform: translateY(15px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* Live Pulse Animation */
      @keyframes livePulse {
        0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
        100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
      }
      @keyframes livePulseSuccess {
        0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
        100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
      }

      /* Enhanced Tracking Top Card */
      .trk-hero-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 20px; padding: 24px; border: 1px solid var(--border-color);
        margin-bottom: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        position: relative; overflow: hidden;
      }
      .trk-hero-card::before {
        content: ''; position: absolute; top: 0; right: 0; width: 150px; height: 150px;
        background: radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%);
        border-radius: 50%; transform: translate(30%, -30%);
      }

      .trk-awb { font-family: 'Lexend', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--brand-accent); margin-bottom: 16px; letter-spacing: -0.02em; }
      
      .trk-route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
      .trk-point { display: flex; flex-direction: column; width: 42%; }
      .trk-city { font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 1rem; color: var(--text-main); }
      .trk-country { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;}
      .trk-divider { color: #cbd5e0; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; }

      /* Animated Stepper */
      .trk-stepper { display: flex; justify-content: space-between; position: relative; margin-bottom: 8px; }
      .trk-stepper-track { position: absolute; top: 10px; left: 15px; right: 15px; height: 4px; background: #e2e8f0; z-index: 1; border-radius: 2px; }
      .trk-stepper-progress { height: 100%; width: 0%; background: var(--brand-accent); transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 2px; }
      
      .trk-step { position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; }
      .trk-dot { width: 24px; height: 24px; border-radius: 50%; background: #ffffff; border: 4px solid #cbd5e0; transition: all 0.4s ease; }
      .trk-lbl { font-family: 'Lexend', sans-serif; font-size: 0.7rem; font-weight: 600; color: #94a3b8; margin-top: 8px; text-transform: uppercase; transition: color 0.4s ease;}
      
      /* Stepper States */
      .trk-stepper.s-book .trk-step:nth-child(1) .trk-dot { border-color: var(--brand-accent); background: var(--brand-accent); animation: livePulse 2s infinite; }
      .trk-stepper.s-book .trk-step:nth-child(1) .trk-lbl { color: var(--brand-accent); }
      
      .trk-stepper.s-transit .trk-stepper-progress { width: 50%; }
      .trk-stepper.s-transit .trk-step:nth-child(1) .trk-dot { border-color: var(--brand-accent); background: var(--brand-accent); }
      .trk-stepper.s-transit .trk-step:nth-child(2) .trk-dot { border-color: var(--brand-accent); background: #ffffff; border-width: 6px; animation: livePulse 2s infinite; }
      .trk-stepper.s-transit .trk-step:nth-child(2) .trk-lbl { color: var(--brand-accent); }
      
      .trk-stepper.s-delivered .trk-stepper-progress { background: #10b981; width: 100%; }
      .trk-stepper.s-delivered .trk-step .trk-dot { border-color: #10b981; background: #10b981; }
      .trk-stepper.s-delivered .trk-step:nth-child(3) .trk-dot { background: #ffffff; border-width: 6px; animation: livePulseSuccess 2s infinite; }
      .trk-stepper.s-delivered .trk-lbl { color: #10b981; }

      .trk-stepper.s-exception .trk-stepper-progress { background: #ef4444; width: 50%; }
      .trk-stepper.s-exception .trk-step .trk-dot { border-color: #ef4444; background: #ef4444; }

      /* Timeline Elements */
      .trk-timeline { display: flex; flex-direction: column; gap: 0; position: relative; padding-left: 12px; margin-top: 16px; }
      .trk-timeline::before { content: ''; position: absolute; left: 21px; top: 16px; bottom: 30px; width: 2px; background: #e2e8f0; }
      
      .trk-item { position: relative; display: flex; gap: 20px; padding-bottom: 24px; opacity: 0; animation: fadeUpIn 0.6s ease forwards; }
      .trk-item-dot { width: 16px; height: 16px; border-radius: 50%; background: #ffffff; border: 4px solid #cbd5e0; position: absolute; left: 2px; top: 2px; z-index: 2; box-shadow: 0 0 0 6px var(--bg-color); transition: all 0.3s; }
      
      .trk-item.active .trk-item-dot { background: var(--brand-accent); border-color: var(--brand-accent); box-shadow: 0 0 0 6px var(--bg-color), 0 0 0 10px rgba(79,70,229,0.1); animation: livePulse 2s infinite; }
      .trk-item.active.success .trk-item-dot { background: #10b981; border-color: #10b981; animation: livePulseSuccess 2s infinite; box-shadow: 0 0 0 6px var(--bg-color), 0 0 0 10px rgba(16,185,129,0.1); }
      
      .trk-content { flex: 1; padding-top: 0; }
      .trk-status { font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 1rem; color: var(--text-main); margin-bottom: 4px; }
      .trk-date { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; margin-bottom: 8px; display: flex; gap: 8px; align-items: center; }
      .trk-meta { background: var(--card-bg); border: 1px solid var(--border-color); padding: 12px; border-radius: 12px; font-size: 0.85rem; color: #475569; display: flex; flex-direction: column; gap: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.01); }
      .trk-remark { color: var(--brand-accent); font-weight: 500; padding-top: 6px; border-top: 1px dashed var(--border-color); margin-top: 2px; }
    </style>
  `;

  const trackingModalHTML = `
    <div class="bottom-sheet-overlay" id="trackingSheetModal" onclick="closeTrackingModal(event)">
      <div class="bottom-sheet" style="height: 92vh;">
        <div class="bs-header" style="position: sticky; top: 0; z-index: 10;">
          <h3 class="bs-title"><i class="bi bi-radar" style="color: var(--brand-accent); margin-right: 8px;"></i>Live Tracking</h3>
          <button class="bs-close" onclick="closeTrackingModal('force')"><i class="bi bi-x"></i></button>
        </div>
        <div class="bs-content" id="trackingModalContent" style="background: var(--bg-color);">
          <!-- Dynamic Content -->
        </div>
      </div>
    </div>
  `;

  document.head.insertAdjacentHTML('beforeend', trackingStyles);
  document.body.insertAdjacentHTML('beforeend', trackingModalHTML);
}

document.addEventListener('DOMContentLoaded', injectTrackingSystem);

function closeTrackingModal(e) {
  if (e === 'force' || e.target.id === 'trackingSheetModal') {
    document.getElementById('trackingSheetModal').classList.remove('active');
  }
}

// 2. Main Search Execution (Triggered by dashboard input)
async function executeMobSearch() {
  const searchInput = document.getElementById('mobSearchInput');
  const btn = document.getElementById('mobSearchBtn');
  const alertBox = document.getElementById('mobSearchAlert');
  const searchVal = searchInput.value.trim();
  
  if (!searchVal) return;
  
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm" style="width: 1.2rem; height: 1.2rem;"></span>';
  alertBox.style.display = 'none';
  
  try {
    const response = await fetch(GOOGLE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      body: JSON.stringify({
        action: "fetchCompleteTracking",
        searchQuery: searchVal
      })
    });

    const res = await response.json();
    
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-arrow-right-short"></i>';
    
    if (res.success) {
      searchInput.value = ''; 
      searchInput.blur();
      renderBeautifulTracking(res.details, res.history);
    } else {
      alertBox.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${res.message}`;
      alertBox.style.display = 'block';
      setTimeout(() => alertBox.style.display = 'none', 4000);
    }
  } catch (error) {
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-arrow-right-short"></i>';
    alertBox.innerHTML = `<i class="bi bi-wifi-off"></i> Connection Error.`;
    alertBox.style.display = 'block';
    setTimeout(() => alertBox.style.display = 'none', 4000);
  }
}

// 3. Render the UI
function renderBeautifulTracking(pkg, history) {
  const modal = document.getElementById('trackingSheetModal');
  const content = document.getElementById('trackingModalContent');
  
  // Determine Master Status
  const s = String(pkg.status || '').toLowerCase();
  let stepClass = 's-transit';
  if (s.includes('delivered')) stepClass = 's-delivered';
  else if (s.includes('return') || s.includes('cancel') || s.includes('exception')) stepClass = 's-exception';
  else if (s === 'pending' || s === 'booked' || s.includes('picked')) stepClass = 's-book';

  // Build History HTML with staggered animation
  let historyHTML = '';
  if (!history || history.length === 0) {
    historyHTML = '<div style="color: #94a3b8; text-align: center; padding: 20px;">No timeline available yet.</div>';
  } else {
    history.forEach((ev, idx) => {
      const d = ev.date ? new Date(ev.date) : new Date();
      const dateStr = d.toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'});
      const timeStr = d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      
      const isNewest = idx === 0;
      const isDelivered = isNewest && s.includes('delivered');
      let activeClass = isNewest ? (isDelivered ? 'active success' : 'active') : '';
      
      // Delay animation for a cascading effect
      const animDelay = `animation-delay: ${idx * 0.15}s;`;
      
      let rmkStr = (ev.remark || "").trim();
      let rmkHtml = (rmkStr && !rmkStr.includes("Auto-fetched")) 
        ? `<div class="trk-remark"><i class="bi bi-chat-left-text-fill"></i> ${rmkStr}</div>` : '';

      historyHTML += `
        <div class="trk-item ${activeClass}" style="${animDelay}">
          <div class="trk-item-dot"></div>
          <div class="trk-content">
            <div class="trk-status">${ev.status}</div>
            <div class="trk-date"><i class="bi bi-calendar3"></i> ${dateStr} <i class="bi bi-clock" style="margin-left: 4px;"></i> ${timeStr}</div>
            <div class="trk-meta">
              <div><i class="bi bi-geo-alt-fill" style="color: var(--text-muted);"></i> ${ev.location || 'Scan Hub'}</div>
              ${rmkHtml}
            </div>
          </div>
        </div>
      `;
    });
  }

  // Inject full HTML
  content.innerHTML = `
    <div class="trk-hero-card">
      <div class="trk-awb"><i class="bi bi-box-seam-fill" style="margin-right: 8px; color: var(--text-main);"></i>${pkg.id}</div>
      
      <div class="trk-route">
        <div class="trk-point">
          <span class="trk-city">${(pkg.origin || 'Origin').split(',')[0]}</span>
          <span class="trk-country">${pkg.originCountry || ''}</span>
        </div>
        <div class="trk-divider"><i class="bi bi-airplane-fill" style="color: #94a3b8; transform: rotate(45deg);"></i></div>
        <div class="trk-point" style="text-align: right;">
          <span class="trk-city">${(pkg.dest || 'Destination').split(',')[0]}</span>
          <span class="trk-country">${pkg.destCountry || ''}</span>
        </div>
      </div>
      
      <div class="trk-stepper ${stepClass}">
        <div class="trk-stepper-track"><div class="trk-stepper-progress"></div></div>
        <div class="trk-step"><div class="trk-dot"></div><div class="trk-lbl">Origin</div></div>
        <div class="trk-step"><div class="trk-dot"></div><div class="trk-lbl">Transit</div></div>
        <div class="trk-step"><div class="trk-dot"></div><div class="trk-lbl">Dest</div></div>
      </div>
    </div>

    <div style="font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 1.1rem; margin-bottom: 8px; color: var(--text-main);">Activity Timeline</div>
    <div class="trk-timeline">
      ${historyHTML}
    </div>
  `;
  
  modal.classList.add('active');
}