let cached = { client: null, ok: false, url: '', anon: '' };

export async function getSupabaseClient() {
  if (cached.client) return cached.client;
  try {
    const res = await fetch('/api/public/auth-config');
    const data = await res.json();
    if (!data?.ok || !data?.url || !data?.anon) {
      cached.ok = false;
      return null;
    }
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    cached.client = createClient(data.url, data.anon, { auth: { persistSession: true } });
    cached.ok = true; cached.url = data.url; cached.anon = data.anon;
    return cached.client;
  } catch {
    cached.ok = false; return null;
  }
}

export function isSupabaseReady() { return !!cached.client && cached.ok; }


