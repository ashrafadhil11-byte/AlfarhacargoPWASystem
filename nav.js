/**
 * Al-Farha PWA Navigation Controller (nav.js)
 */

// Global View Loader
function loadView(viewName, initCallback) {
  const appContainer = document.getElementById('app') || document.getElementById('mainContent');
  
  if (appContainer) {
    // Show smooth loading spinner while fetching the view
    appContainer.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; color: #6b7280; font-family: 'Lexend', sans-serif;">
        <div class="spinner-border text-primary" role="status" style="width: 2.5rem; height: 2.5rem; border-width: 0.25em;"></div>
        <p style="margin-top: 16px; font-size: 0.95rem; font-weight: 500;">Loading ${viewName}...</p>
      </div>
    `;
  }

  // Request HTML content from Google Apps Script backend
  google.script.run
    .withSuccessHandler(function(html) {
      renderView(html);
      updateActiveNavState(viewName);
      if (typeof initCallback === 'function') {
        initCallback();
      }
    })
    .withFailureHandler(function(err) {
      if (appContainer) {
        appContainer.innerHTML = `
          <div style="padding: 40px; text-align: center; color: #dc2626; font-family: 'Lexend', sans-serif;">
            <i class="bi bi-exclamation-triangle" style="font-size: 2.5rem;"></i>
            <h3 style="margin-top: 12px; font-weight: 600;">Failed to load view</h3>
            <p style="color: #6b7280; font-size: 0.9rem; max-width: 400px; margin: 8px auto;">${err.message}</p>
            <button onclick="returnToDashboard()" class="btn-primary-custom" style="width: auto; padding: 12px 24px; margin: 16px auto 0 auto; display: inline-flex;">
              <i class="bi bi-house me-2"></i> Return to Dashboard
            </button>
          </div>
        `;
      }
    })
    .include(viewName);
}

// Render HTML content into DOM
function renderView(html) {
  const appContainer = document.getElementById('app') || document.body;
  appContainer.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Highlight the active navigation item across desktop & mobile PWA
function updateActiveNavState(viewName) {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));

  // Map view names to corresponding nav items
  const viewMap = {
    'Dashboard': 0,
    'BookingForm': 1,
    'Transfers': 2,
    'StatusUpdate': 3,
    'Consolidation': 4,
    'AdminPanel': 5
  };

  const activeIndex = viewMap[viewName];
  if (activeIndex !== undefined && navItems[activeIndex]) {
    navItems[activeIndex].classList.add('active');
  }
}

// Explicit Navigation Routes
function returnToDashboard() {
  loadView('Dashboard', function() {
    if (typeof initializeDashboard === 'function') initializeDashboard();
  });
}

function loadBookingForm() {
  loadView('BookingForm');
}

function loadTransfers() {
  loadView('Transfers');
}

function loadStatusUpdate() {
  loadView('StatusUpdate');
}

function loadConsolidation() {
  loadView('Consolidation');
}

function loadAdminPanel() {
  loadView('AdminPanel');
}