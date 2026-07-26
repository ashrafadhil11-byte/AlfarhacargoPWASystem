/**
 * Al-Farha Cargo - Modular Navigation Component
 * Automatically injects the sidebar/bottom-nav into any page containing <div id="navigation-container"></div>
 */

document.addEventListener("DOMContentLoaded", function() {
  // Auto-initialize if the container exists. 
  // We can auto-detect the active view from the URL filename.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  
  const pageToViewMap = {
    "index.html": "Dashboard",
    "booking.html": "BookingForm",
    "transfers.html": "Transfers",
    "statusupdate.html": "StatusUpdate",
    "consolidation.html": "Consolidation"
  };

  const detectedView = pageToViewMap[currentPage.toLowerCase()] || "Dashboard";
  
  // Only auto-init if not already called manually by the HTML page
  if (!window.navInitialized) {
    initNavigation(detectedView);
  }
});

function initNavigation(activeViewName) {
  window.navInitialized = true;
  const navContainer = document.getElementById('navigation-container');
  if (!navContainer) {
    console.warn("nav.js: <div id='navigation-container'></div> not found on this page.");
    return;
  }

  // Define navigation links and routes for Vercel
  const navItems = [
    { name: 'Dashboard', label: 'Dash', icon: 'bi-grid', url: 'index.html' },
    { name: 'BookingForm', label: 'New', icon: 'bi-plus-circle', url: 'booking.html' },
    { name: 'Transfers', label: 'Inventory', icon: 'bi-arrow-left-right', url: 'transfers.html' },
    { name: 'StatusUpdate', label: 'Update', icon: 'bi-geo-alt-fill', url: 'statusupdate.html' },
    { name: 'Consolidation', label: 'Consol', icon: 'bi-layers', url: 'consolidation.html' }
  ];

  // Retrieve user session or fallback to default
  const defaultUser = JSON.stringify({ name: "Muhammad Adil", branch: "Salalah" });
  const sessionUser = JSON.parse(localStorage.getItem('afc_user') || defaultUser);

  // 1. Build Navigation HTML Structure
  navContainer.innerHTML = `
    <aside class="sidebar" id="sidebar" style="width: 260px; background-color: #ffffff; border-right: 1px solid #eaeaea; position: fixed; height: 100vh; padding: 32px 20px; display: flex; flex-direction: column; z-index: 100; transition: all 0.3s ease;">
      <div class="sidebar-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; padding: 0 5px;">
        <div class="sidebar-brand" style="font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 1.25rem; display: flex; align-items: center; gap: 12px;">
          <i class="bi bi-box-seam-fill" style="color: #6f42c1; font-size: 1.5rem;"></i> Al-Farha
        </div>
      </div>
      
      <nav class="nav-menu" style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
        ${navItems.map(item => {
          const isActive = item.name === activeViewName;
          const activeColor = isActive ? '#6f42c1' : '#6b7280';
          const activeBg = isActive ? '#f3e8ff' : 'transparent';
          
          return `
            <a href="${item.url}" class="nav-item ${isActive ? 'active' : ''}" style="font-family: 'Lexend', sans-serif; font-size: 0.95rem; font-weight: 500; padding: 14px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; text-decoration: none; color: ${activeColor}; background-color: ${activeBg}; transition: all 0.2s ease;">
              <i class="bi ${item.icon}" style="font-size: 1.2rem; min-width: 30px;"></i> 
              <span class="nav-text">${item.label}</span>
            </a>
          `;
        }).join('')}
      </nav>
      
      <div class="sidebar-footer" style="display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid #eaeaea;">
        <div class="user-details" style="display: flex; flex-direction: column;">
          <span class="user-name" style="font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 0.9rem; color: #111827;">${sessionUser.name}</span>
          <span class="user-branch" style="font-family: 'Lexend', sans-serif; font-size: 0.75rem; color: #6b7280;">${sessionUser.branch}</span>
        </div>
      </div>
    </aside>
  `;

  // 2. Inject Mobile Responsive PWA Styles safely
  if (!document.getElementById('nav-mobile-styles')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'nav-mobile-styles';
    styleTag.innerHTML = `
      /* Desktop hover states */
      .nav-item:hover { color: #6f42c1 !important; background-color: #faf5ff !important; }
      .nav-item.active:hover { background-color: #f3e8ff !important; }

      /* Mobile overrides */
      @media (max-width: 768px) {
        .sidebar { 
          width: 100% !important; 
          height: auto !important; 
          position: fixed !important; 
          bottom: 0 !important; 
          left: 0 !important; 
          flex-direction: row !important; 
          padding: 12px 8px 24px 8px !important; /* Extra padding for iOS bottom bar */
          border-right: none !important; 
          border-top: 1px solid #eaeaea !important; 
          z-index: 1000 !important; 
          box-shadow: 0 -4px 12px rgba(0,0,0,0.05) !important; 
          background: #ffffff !important; 
        }
        .sidebar-header, .sidebar-footer { display: none !important; }
        .nav-menu { flex-direction: row !important; justify-content: space-around !important; width: 100% !important; gap: 0 !important; }
        .nav-item { flex-direction: column !important; padding: 8px !important; border-radius: 8px !important; font-size: 0.7rem !important; gap: 4px !important; background: transparent !important; }
        .nav-item.active { background: transparent !important; } /* Remove background block on mobile */
        .nav-item i { min-width: auto !important; font-size: 1.4rem !important; }
        .nav-text { display: block !important; text-align: center !important; }
      }
    `;
    document.head.appendChild(styleTag);
  }
}