// externalApi.js - Proxy-Assisted Frontend API Connection

async function fetchDirectFromAlfarha(scannedId) {
  const orderNo = encodeURIComponent(scannedId.trim());
  const targetUrl = "https://alfarhaonline.com/api/order-details?order_no=" + orderNo;
  
  // Wrap the target URL in a CORS proxy to bypass browser restrictions
  const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(targetUrl);
  
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': 'R681hJQUTSXBqf6QHxLasBln2x0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, apiData: data };

  } catch (error) {
    return { success: false, message: "Proxy blocked by Cloudflare or Network failure." };
  }
}
