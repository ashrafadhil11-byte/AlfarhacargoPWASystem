// nav.js - Common Bottom Navigation for Al-Farha PWA

// Global logout function to handle the new session management
window.handleLogout = function() {
  if(confirm('Are you sure you want to sign out?')) {
    // Clear both the user identity and the activity timestamp
    localStorage.removeItem('afc_user');
    localStorage.removeItem('afc_last_active');
    window.location.href = '/login.html';
  }
};

function injectBottomNav() {
  // Get the current page filename
  const path = window.location.pathname.toLowerCase();
  
  // Define navigation items and the keywords that trigger their "active" state
  // Added isAction property to handle script triggers vs page links
  const navItems = [
    { name: 'Home', icon: 'bi-grid-fill', link: '/mobiledashboard.html', activeKeywords: ['dashboard', 'index'], isAction: false },
    { name: 'Book', icon: 'bi-plus-circle-fill', link: '/mobilebooking.html', activeKeywords: ['booking'], isAction: false },
    { name: 'Inv', icon: 'bi-box-seam', link: '/transfers.html', activeKeywords: ['transfers', 'inv'], isAction: false },
    { name: 'Scan', icon: 'bi-upc-scan', link: '/mstatusupdate.html', activeKeywords: ['scan', 'status'], isAction: false },
    { name: 'Logout', icon: 'bi-box-arrow-right', action: 'handleLogout()', isAction: true } // New Logout Button
  ];

  // Create the nav container
  const navElement = document.createElement('nav');
  navElement.className = 'bottom-nav';
  
  // Add styling for the nav
  const style = document.createElement('style');
  style.innerHTML = `
    .bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; height: 65px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-top: 1px solid #e2e8f0; display: flex; justify-content: space-around; align-items: center; z-index: 1000; padding-bottom: env(safe-area-inset-bottom); box-shadow: 0 -4px 20px rgba(0,0,0,0.04); }
    .nav-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; text-decoration: none; width: 60px; height: 100%; cursor: pointer; transition: color 0.2s; background: none; border: none; padding: 0; }
    .nav-btn i { font-size: 1.4rem; margin-bottom: 2px; }
    .nav-btn span { font-family: 'Lexend', sans-serif; font-size: 0.65rem; font-weight: 500; }
    .nav-btn.active { color: #4f46e5; }
    .nav-btn.active i { font-weight: 900; }
    .nav-btn.logout-btn i, .nav-btn.logout-btn span { color: #ef4444; } /* Red color for logout */
  `;
  document.head.appendChild(style);

  // Build the buttons
  navItems.forEach(item => {
    let isActive = false;
    
    // Only calculate active state for actual links
    if (!item.isAction) {
      if ((path === '/' || path === '') && item.name === 'Home') {
        isActive = true;
      } else {
        isActive = item.activeKeywords.some(keyword => path.includes(keyword));
      }
    }
    
    // Create an anchor tag for links, and a button tag for actions (like logout)
    const btn = document.createElement(item.isAction ? 'button' : 'a');
    btn.className = `nav-btn ${isActive ? 'active' : ''} ${item.name === 'Logout' ? 'logout-btn' : ''}`;
    
    if (item.isAction) {
      btn.setAttribute('onclick', item.action);
    } else {
      btn.href = item.link;
    }
    
    btn.innerHTML = `<i class="bi ${item.icon}"></i><span>${item.name}</span>`;
    
    navElement.appendChild(btn);
  });

  // Append to the body
  document.body.appendChild(navElement);
}

// Run the function when the script loads
document.addEventListener('DOMContentLoaded', injectBottomNav);
