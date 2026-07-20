// nav.js - Common Bottom Navigation for Al-Farha PWA

function injectBottomNav() {
  // Get the current page filename
  const path = window.location.pathname.toLowerCase();
  
  // Define navigation items
  const navItems = [
    { name: 'Home', icon: 'bi-grid-fill', link: '/mobiledashboard.html', activeKeywords: ['dashboard', 'index', ''] },
    { name: 'Book', icon: 'bi-plus-circle-fill', link: '/mobilebooking.html', activeKeywords: ['booking'] },
    { name: 'Inv', icon: 'bi-box-seam', link: '/transfers.html', activeKeywords: ['transfers', 'inv'] },
    { name: 'Scan', icon: 'bi-upc-scan', link: '/scan.html', activeKeywords: ['scan'] }
  ];

  // Create the nav container
  const navElement = document.createElement('nav');
  navElement.className = 'bottom-nav';
  
  // Add styling for the nav
  const style = document.createElement('style');
  style.innerHTML = `
    .bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; height: 65px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); border-top: 1px solid #e2e8f0; display: flex; justify-content: space-around; align-items: center; z-index: 1000; padding-bottom: env(safe-area-inset-bottom); box-shadow: 0 -4px 20px rgba(0,0,0,0.04); }
    .nav-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; color: #64748b; text-decoration: none; width: 60px; height: 100%; cursor: pointer; transition: color 0.2s; }
    .nav-btn i { font-size: 1.4rem; margin-bottom: 2px; }
    .nav-btn span { font-family: 'Lexend', sans-serif; font-size: 0.65rem; font-weight: 500; }
    .nav-btn.active { color: #4f46e5; }
    .nav-btn.active i { font-weight: 900; }
  `;
  document.head.appendChild(style);

  // Build the buttons
  navItems.forEach(item => {
    // Check if this button should be active
    const isActive = item.activeKeywords.some(keyword => path.includes(keyword));
    
    const a = document.createElement('a');
    a.href = item.link;
    a.className = `nav-btn ${isActive ? 'active' : ''}`;
    a.innerHTML = `<i class="bi ${item.icon}"></i><span>${item.name}</span>`;
    
    navElement.appendChild(a);
  });

  // Append to the body
  document.body.appendChild(navElement);
}

// Run the function when the script loads
document.addEventListener('DOMContentLoaded', injectBottomNav);