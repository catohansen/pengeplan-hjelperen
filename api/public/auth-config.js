// Supabase configuration endpoint for Pengeplan
// This file provides Supabase URL and Anon Key to the frontend

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    // Check if environment variables are set
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not set, using fallback');
      res.status(200).json({
        supabaseUrl: null,
        supabaseAnonKey: null,
        message: 'Supabase not configured - using localStorage fallback'
      });
      return;
    }

    // Return Supabase configuration
    res.status(200).json({
      supabaseUrl,
      supabaseAnonKey,
      message: 'Supabase configuration loaded successfully'
    });
  } catch (error) {
    console.error('Error in auth-config:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
