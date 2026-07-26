/**
 * Al-Farha PWA Modular Navigation Script (nav.js)
 */

function initNavigation(activeViewName) {
  const navContainer = document.getElementById('navigation-container');
  if (!navContainer) return;

  // Define navigation links with their corresponding filenames/routes on Vercel
  const navItems = [
    { name: 'Dashboard', label: 'Dash', icon: 'bi-grid', url: 'index.html' },
    { name: 'BookingForm', label: 'New', icon: 'bi-plus-circle', url: 'booking.html' },
    { name: 'Transfers', label: 'Inventory', icon: 'bi-arrow-left-right', url: 'transfers.html' },
    { name: 'StatusUpdate', label: 'Update', icon: 'bi-geo-alt-fill', url: 'statusupdate.html' },
    { name: 'Consolidation', label: 'Consol', icon: 'bi-layers', url: 'consolidation.html' }
  ];

  let sessionUser = JSON.parse(localStorage.getItem('afc_user') || '{"name":"Staff","branch":"Salalah"}');

  // Build Sidebar & Bottom Nav HTML Structure dynamically
  navContainer.innerHTML = `
    <aside class="sidebar" id="sidebar" style="width: 260px; background-color: #ffffff; border-right: 1px solid #eaeaea; position: fixed; height: 100vh; padding: 32px 20px; display: flex; flex-direction: column; z-index: 100; transition: all 0.3s ease;">
      <div class="sidebar-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; padding: 0 5px;">
        <div class="sidebar-brand" style="font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 1.25rem; display: flex; align-items: center; gap: 12px;">
          <i class="bi bi-box-seam-fill" style="color: #6f42c1; font-size: 1.5rem;"></i> Al-Farha
        </div>
      </div>
      <nav class="nav-menu" style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
        ${navItems.map(item => `
          <a href="${item.url}" class="nav-item ${item.name === activeViewName ? 'active' : ''}" style="font-family: 'Lexend', sans-serif; font-size: 0.95rem; font-weight: 500; padding: 14px 16px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; text-decoration: none; color: ${item.name === activeViewName ? '#6f42c1' : '#6b7280'}; background-color: ${item.name === activeViewName ? '#f3e8ff' : 'transparent'}; transition: all 0.2s ease;">
            <i class="bi ${item.icon}" style="font-size: 1.2rem; min-width: 30px;"></i> 
            <span class="nav-text">${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer" style="display: flex; align-items: center; justify-content: space-between; padding-top: 20px; border-top: 1px solid #eaeaea;">
        <div class="user-details" style="display: flex; flex-direction: column;">
          <span class="user-name" style="font-weight: 600; font-size: 0.9font-size: 0.9rem;">${sessionUser.name}</span>
          <span class="user-branch" style="font-size: 0.75rem; color: #6b7280;">${sessionUser.branch}</span>
        </div>
      </div>
    </aside>
  `;

  // Inject Mobile Responsive Styles for the injected navigation
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    @media (max-width: 768px) {
      .sidebar { width: 100% !important; height: auto !important; position: fixed !important; bottom: 0 !important; left: 0 !important; flex-direction: row !important; padding: 12px 8px !important; border-right: none !important; border-top: 1px solid #eaeaea !important; z-index: 1000 !important; box-shadow: 0 -4px 12px rgba(0,0,0,0.05) !important; background: #ffffff !important; }
      .sidebar-header, .sidebar-footer { display: none !important; }
      .nav-menu { flex-direction: row !important; justify-content: space-around !important; width: 100% !important; gap: 0 !important; }
      .nav-item { flex-direction: column !important; padding: 8px !important; border-radius: 8px !important; font-size: 0.7rem !important; gap: 4px !important; background: transparent !important; }
      .nav-item i { min-width: auto !important; font-size: 1.4rem !important; }
      .nav-text { display: block !important; text-align: center !important; }
    }
  `;
  document.head.appendChild(styleTag);
}