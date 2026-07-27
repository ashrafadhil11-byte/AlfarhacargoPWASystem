export default async function handler(req, res) {
  // Only allow GET requests for this proxy
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { order_no } = req.query;

  if (!order_no) {
    return res.status(400).json({ error: 'Missing order_no parameter' });
  }

  try {
    // Ping the Al-Farha server securely from Vercel's backend
    const targetUrl = `https://alfarhaonline.com/api/order-details?order_no=${encodeURIComponent(order_no)}`;
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': 'R681hJQUTSXBqf6QHxLasBln2x0',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    // Attach the exact CORS headers your mobile browser is begging for
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error connecting to API' });
  }
}
