export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { order_no } = req.query;

  if (!order_no) {
    return res.status(400).json({ error: 'Missing order_no parameter' });
  }

  try {
    const targetUrl = `https://alfarhaonline.com/api/order-details?order_no=${encodeURIComponent(order_no)}`;
    const apiKey = 'R681hJQUTSXBqf6QHxLasB1n2x0'; 
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
      body: new URLSearchParams({ order_no: order_no.trim() }) 
    });

    // 1. Read the raw text FIRST (Prevents the crash if Cloudflare sends an HTML page)
    const rawText = await response.text();

    let data;
    try {
      // 2. Attempt to parse the raw text as JSON
      data = JSON.parse(rawText);
    } catch (parseError) {
      // 3. If parsing fails, log it and return a safe error to the frontend
      console.error('Failed to parse JSON. Raw HTML/Text received:', rawText.substring(0, 200));
      
      // Set CORS headers even on error so the mobile app can read the error message
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(502).json({ 
        error: 'External API blocked the request (Likely Cloudflare) or returned an invalid format.',
        details: rawText.substring(0, 100) 
      });
    }

    // If parsing succeeds, return the data normally
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.status(200).json(data);

  } catch (error) {
    console.error('Network/Proxy Error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
