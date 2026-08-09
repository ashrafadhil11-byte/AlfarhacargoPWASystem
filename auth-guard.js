(function () {
  const THREE_HOURS_MS = 3 * 60 * 60 * 1000; // 3 Hours (Sign-out threshold)
  const REOPEN_THRESHOLD_MS = 60 * 1000;    // 1 Minute (Background resume threshold)

  // Get current filename
  const pathParts = window.location.pathname.split('/');
  const currentPage = pathParts[pathParts.length - 1] || 'mobiledashboard.html';
  const isLoginPage = currentPage === 'login.html';

  function validateSession() {
    const sessionUser = localStorage.getItem('afc_user');
    const lastActive = localStorage.getItem('afc_last_active');
    const now = Date.now();

    // 1. If not logged in, redirect to login
    if (!sessionUser) {
      if (!isLoginPage) {
        window.location.href = '/login.html';
      }
      return;
    }

    if (lastActive) {
      const elapsed = now - parseInt(lastActive, 10);

      // 2. Inactive for more than 3 hours -> Auto Sign-Out
      if (elapsed > THREE_HOURS_MS) {
        localStorage.removeItem('afc_user');
        localStorage.removeItem('afc_last_active');
        if (!isLoginPage) {
          window.location.href = '/login.html';
        }
        return;
      }

      // 3. Re-opened within 3 hours (e.g. after 1 hour) -> Redirect to Dashboard
      if (elapsed > REOPEN_THRESHOLD_MS && currentPage !== 'mobiledashboard.html' && !isLoginPage) {
        localStorage.setItem('afc_last_active', now.toString());
        window.location.href = '/mobiledashboard.html';
        return;
      }
    }

    // Update active timestamp during continuous use
    localStorage.setItem('afc_last_active', now.toString());
  }

  // Initial execution on page load
  validateSession();

  // Listen for PWA/Mobile Browser tab resume
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      validateSession();
    }
  });

  // Handle iOS/Android back-forward cache restores
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      validateSession();
    }
  });
})();
