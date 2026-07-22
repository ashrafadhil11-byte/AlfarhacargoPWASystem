// packageModal.js

// 1. Inject the Modal HTML into the DOM when the script loads
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

// 2. Function to close the modal
function closePkgModal(e) {
  if (e === 'force' || e.target.id === 'pkgDetailsModal') {
    document.getElementById('pkgDetailsModal').classList.remove('active');
  }
}

// 3. Function triggered when a Live Activity card is clicked
async function openPackageModal(awb) {
  const modal = document.getElementById('pkgDetailsModal');
  const content = document.getElementById('pkgModalContent');
  
  // Show modal and loading state
  modal.classList.add('active');
  content.innerHTML = '<div style="text-align:center; padding: 40px; color: #94a3b8;"><span class="spinner-border spinner-border-sm"></span> Fetching details...</div>';

  try {
    // Fetch data using the global API URL defined in mobiledashboard.html
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
      
      // Render the complete details
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
              <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 2px;"><i class="bi bi-geo-alt"></i> ${pkg.origin || 'N/A'}</div>
            </div>
            <div>
              <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Consignee</div>
              <div style="font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 0.95rem; color: var(--text-main); margin-top: 4px;">${pkg.consignee || 'N/A'}</div>
              <div style="color: var(--text-muted); font-size: 0.8rem; margin-top: 2px;"><i class="bi bi-geo-alt"></i> ${pkg.dest || 'N/A'}</div>
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
        
        <button onclick="closePkgModal('force')" style="width: 100%; padding: 14px; border-radius: 12px; border: none; background: #f1f5f9; color: #475569; font-family: 'Lexend', sans-serif; font-weight: 600; font-size: 1rem; cursor: pointer;">Close Details</button>
      `;
    } else {
      content.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Error: ${res.message}</div>`;
    }
  } catch (error) {
    content.innerHTML = `<div style="text-align:center; color:#ef4444; padding:20px;">Network Error: Please check your connection.</div>`;
  }
}