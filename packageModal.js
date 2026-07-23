// packageModal.js

// --- HELPER: Country to Flag Emoji ---
function getFlagEmoji(countryName) {
  if (!countryName) return '📍';
  const name = countryName.toString().trim().toUpperCase();
  
  const flags = {
    'OMAN': '🇴🇲',
    'UNITED ARAB EMIRATES': '🇦🇪',
    'UAE': '🇦🇪',
    'INDIA': '🇮🇳',
    'SAUDI ARABIA': '🇸🇦',
    'KSA': '🇸🇦',
    'QATAR': '🇶🇦',
    'BAHRAIN': '🇧🇭',
    'KUWAIT': '🇰🇼',
    'PAKISTAN': '🇵🇰',
    'BANGLADESH': '🇧🇩',
    'NEPAL': '🇳🇵',
    'SRI LANKA': '🇱🇰',
    'PHILIPPINES': '🇵🇭'
  };
  
  return flags[name] || '📍';
}

// 1. Inject the Modal HTML
function injectPackageModal() {
  const modalHTML = `
  <div class="bottom-sheet-overlay" id="pkgDetailsModal" onclick="closePkgModal(event)">
    <div class="bottom-sheet" style="max-height: 85vh;">
      <div class="bs-header">
        <h3 class="bs-title">Package Details</h3>
        <button class="bs-close" onclick="closePkgModal('force')"><i class="bi bi-x"></i></button>
      </div>
      <div class="bs-content" id="pkgModalContent" style="background: var(--bg-color);">
        <!-- Content will be injected here dynamically -->
      </div>
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

document.addEventListener('DOMContentLoaded', injectPackageModal);

// 2. Close Modal Function
function closePkgModal(e) {
  if (e === 'force' || e.target.id === 'pkgDetailsModal') {
    document.getElementById('pkgDetailsModal').classList.remove('active');
  }
}

// 3. Trigger Modal & Fetch Data
async function openPackageModal(awb) {
  const modal = document.getElementById('pkgDetailsModal');
  const content = document.getElementById('pkgModalContent');
  
  modal.classList.add('active');
  content.innerHTML = '<div style="text-align:center; padding: 40px; color: #94a3b8;"><span class="spinner-border spinner-border-sm"></span> Fetching details...</div>';

  try {
    const response = await fetch(GOOGLE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      body: JSON.stringify({
        action: "fetchCompleteTracking",
        searchQuery: awb
      })
    });

    const res = await response.json();
    
    if (res.success) {
      const pkg = res.details;
      
      const originFlag = getFlagEmoji(pkg.originCountry);
      const destFlag = getFlagEmoji(pkg.destCountry);
      
      content.innerHTML = `
        <div style="background: var(--card-bg); border-radius: 16px; padding: 20px; border: 1px solid var(--border-color); margin-bottom: 20px;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="margin: 0; color: var(--brand-accent); font-family: 'Lexend', sans-serif;">${pkg.id}</h3>
            <span style="background: #eff6ff; color: #3b82f6; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600;">${pkg.status}</span>
          </div>
          
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Sender</div>
              <div style="font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 0.95rem; color: var(--text-main); margin-top: 4px;">${pkg.shipper || 'N/A'}</div>
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">
                <span style="font-size: 1.1rem; margin-right: 4px;">${originFlag}</span>${pkg.origin || 'N/A'}
              </div>
            </div>
            <div>
              <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Consignee</div>
              <div style="font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 0.95rem; color: var(--text-main); margin-top: 4px;">${pkg.consignee || 'N/A'}</div>
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 4px;">
                <span style="font-size: 1.1rem; margin-right: 4px;">${destFlag}</span>${pkg.dest || 'N/A'}
              </div>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem;">
            <span style="color: var(--text-muted);">Package Type:</span>
            <span style="font-weight: 600; color: var(--text-main);">${pkg.pkgType || 'N/A'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem;">
            <span style="color: var(--text-muted);">Weight:</span>
            <span style="font-weight: 600; color: var(--text-main);">${pkg.weight ? pkg.weight + ' kg' : 'N/A'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
            <span style="color: var(--text-muted);">No. of Pieces:</span>
            <span style="font-weight: 600; color: var(--text-main);">${pkg.pcs || 'N/A'}</span>
          </div>
        </div>
        
        <div style="display: flex; gap: 10px;">
          <button onclick="closePkgModal('force')" style="flex: 1; padding: 14px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-muted); font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 0.95rem; cursor: pointer;">Close</button>
          <button onclick="triggerDirectTracking('${pkg.id}')" style="flex: 2; padding: 14px; border-radius: 12px; border: none; background: var(--brand-accent); color: white; font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 0.95rem; cursor: pointer;"><i class="bi bi-radar" style="margin-right: 6px;"></i> Track Package</button>
        </div>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Error: ${res.message}</div>`;
    }
  } catch (error) {
    content.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Network Error: Please check your connection.</div>`;
  }
}

// 4. Programmatic Tracking Integration 
async function triggerDirectTracking(awb) {
  closePkgModal('force'); 
  
  // Check if we are on a page with the search bar (like the dashboard)
  const searchInput = document.getElementById('mobSearchInput');
  const searchBtn = document.getElementById('mobSearchBtn');
  
  if (searchInput && searchBtn && typeof executeMobSearch === 'function') {
    searchInput.value = awb;
    executeMobSearch();
  } else {
    // Standalone programmatic fallback if no search bar exists
    const trackingModal = document.getElementById('trackingSheetModal');
    const trackingContent = document.getElementById('trackingModalContent');
    
    if (!trackingModal || !trackingContent) return alert('Tracking module is not loaded on this page.');
    
    trackingModal.classList.add('active');
    trackingContent.innerHTML = '<div style="text-align:center; padding: 40px; color: #94a3b8;"><i class="bi bi-arrow-repeat" style="animation: spin 1s linear infinite; font-size: 2rem;"></i><br><br>Locating Package...</div>';
    
    try {
      const response = await fetch(GOOGLE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: "fetchCompleteTracking", searchQuery: awb })
      });
      const res = await response.json();
      
      if (res.success && typeof renderBeautifulTracking === 'function') {
        renderBeautifulTracking(res.details, res.history);
      } else {
        trackingContent.innerHTML = `<div style="text-align:center; color:#ef4444; padding:30px;"><i class="bi bi-exclamation-circle" style="font-size: 2rem;"></i><br><br>${res.message || 'Tracking failed'}</div>`;
      }
    } catch (e) {
      trackingContent.innerHTML = `<div style="text-align:center; color:#ef4444; padding:30px;"><i class="bi bi-wifi-off" style="font-size: 2rem;"></i><br><br>Connection Error</div>`;
    }
  }
}