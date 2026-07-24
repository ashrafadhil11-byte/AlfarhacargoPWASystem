// externalApi.js - Direct Frontend API Connection

async function fetchDirectFromAlfarha(scannedId) {
  // Clean the barcode and format the URL
  const orderNo = encodeURIComponent(scannedId.trim());
  const url = "https://alfarhaonline.com/api/order-details?order_no=" + orderNo;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-KEY': 'R681hJQUTSXBqf6QHxLasBln2x0',
        'Accept': 'application/json'
      }
    });

    // Check if the server responds properly
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, apiData: data };

  } catch (error) {
    // If this fails, it is almost certainly a CORS block
    return { success: false, message: "Browser blocked the request (CORS Error) or Network failure." };
  }
}
