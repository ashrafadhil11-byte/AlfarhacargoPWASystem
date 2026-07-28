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
    
    // The CORRECTED API Key!
    const apiKey = 'R681hJQUTSXBqf6QHxLasB1n2x0'; 
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.status(200).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Internal Server Error connecting to API' });
  }
}
