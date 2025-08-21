// Lightweight admin configuration API
// GET /api/admin/config      -> fetch public config
// POST /api/admin/config     -> update config (requires ADMIN_TOKEN)

const DEFAULT_CONFIG = {
  appName: "Pengeplan",
  locale: "nb-NO",
  features: {
    aiAdvisor: true,
    supportSchemes: true,
    tasks: true,
    debts: true,
    bills: true,
    budget: true
  },
  legal: {
    privacyUrl: "https://example.com/personvern",
    termsUrl: "https://example.com/vilkar"
  }
};

let configCache = { ...DEFAULT_CONFIG };

export default async function handler(req, res) {
  const method = req.method || 'GET';

  if (method === 'GET') {
    res.status(200).json({ ok: true, config: configCache });
    return;
  }

  if (method === 'POST') {
    const adminToken = process.env.ADMIN_TOKEN || '';
    const provided = req.headers['authorization'] || '';

    if (!adminToken || provided !== `Bearer ${adminToken}`) {
      res.status(401).json({ ok: false, error: 'Unauthorized' });
      return;
    }

    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      configCache = { ...configCache, ...body };
      res.status(200).json({ ok: true, config: configCache });
    } catch (err) {
      res.status(400).json({ ok: false, error: 'Invalid JSON' });
    }
    return;
  }

  res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}


