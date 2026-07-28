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
    const apiKey = 'R681hJQUTSXBqf6QHxLasBln2x0';
    
    // We are firing the API key at the server from every possible angle
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'security-token': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        order_no: order_no,
        token: apiKey,
        security_token: apiKey
      })
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
