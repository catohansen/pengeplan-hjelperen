// Public endpoint to expose Supabase URL and anon key to the client
// Safe to expose anon key – it enforces Row Level Security on Supabase

export default function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({
      ok: false,
      message: 'Supabase environment variables not configured',
      error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY'
    });
  }

  return res.status(200).json({
    ok: true,
    url: supabaseUrl,
    anon: supabaseAnonKey
  });
}


