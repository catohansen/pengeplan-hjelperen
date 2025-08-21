# 🤖 ChatGPT-5 Agent Deployment Prompt

## **MISSION: Deploy Pengeplan to Production**

Du er en senior DevOps-ingeniør som skal deploye Pengeplan - en digital økonomisk hjelper for økonomisk utsatte grupper - til produksjon. Dette er en komplett web-applikasjon som er klar for lansering.

## **📋 OPPGAVE**

Deploy Pengeplan til live produksjon ved å:
1. Opprette GitHub repository
2. Pushe kode til GitHub
3. Deploye til Vercel
4. Sette opp Supabase database
5. Konfigurere environment variables
6. Teste live funksjonalitet

## **🏗️ PROSJEKTINFORMASJON**

**Prosjekt:** Pengeplan - Digital økonomisk hjelper
**Teknisk Stack:** HTML5, CSS3, Vanilla JavaScript, Supabase, Vercel
**Status:** MVP Complete (v1.2.0) - Production Ready
**Målgruppe:** NAV-brukere, lavinntektsgrupper, personer med gjeld

## **📁 FILSTRUKTUR**

```
pengeplan-hjelperen/
├── index.html              # Login-side
├── dashboard.html          # Hoveddashboard
├── profile.html            # Brukerprofil
├── admin.html              # Admin-panel
├── support-programs.html   # Støtteordninger
├── test-admin.html         # Test Suite
├── styles.css              # Login-styling
├── dashboard.css           # Dashboard-styling
├── responsive.css          # Responsiv design
├── script.js               # Login-logikk
├── dashboard.js            # Dashboard-funksjonalitet
├── js/                     # Modular JavaScript
│   ├── db.js               # Database-adapter
│   ├── profile.js          # Profil-håndtering
│   ├── admin.js            # Admin-panel logikk
│   ├── ai-advisor.js       # AI-rådgiver backend
│   ├── support-programs.js # Støtteordningsdatabase
│   ├── support-programs-ui.js # Støtteordninger UI
│   └── supabaseClient.js   # Supabase-klient
├── api/public/
│   └── auth-config.js      # Supabase-konfigurasjon
├── supabase/
│   └── schema.sql          # Database-skjema
├── vercel.json             # Vercel-konfigurasjon
├── README.md               # Prosjektbeskrivelse
├── README-file-guide.md    # Teknisk guide
├── DEPLOYMENT_GUIDE.md     # Deployment-instruksjoner
└── backup-system.sh        # Backup-script
```

## **🚀 DETALJERTE STEG**

### **STEG 1: GitHub Repository Setup**

```bash
# 1. Opprett GitHub repository
gh repo create pengeplan-hjelperen \
  --public \
  --description "Digital økonomisk hjelper for økonomisk utsatte grupper" \
  --source=. \
  --remote=origin \
  --push

# 2. Verifiser repository er opprettet
gh repo view pengeplan-hjelperen
```

### **STEG 2: Vercel Deployment**

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Logg inn på Vercel
vercel login

# 3. Deploy prosjektet
vercel --prod

# 4. Følg instruksjonene:
# - Project name: pengeplan-hjelperen
# - Directory: ./
# - Override settings: No
```

### **STEG 3: Supabase Setup**

1. **Gå til [supabase.com](https://supabase.com)**
2. **Logg inn og opprett nytt prosjekt:**
   - Project name: `pengeplan-hjelperen`
   - Database password: (velg sikker passord)
   - Region: West Europe (Norge)
3. **Kjør database schema:**
   - Gå til SQL Editor
   - Kopier innholdet fra `supabase/schema.sql`
   - Kjør SQL-koden
4. **Kopier credentials:**
   - Project URL
   - Anon public key

### **STEG 4: Environment Variables**

```bash
# Sett environment variables i Vercel
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY

# Eller via Vercel Dashboard:
# 1. Gå til Project Settings → Environment Variables
# 2. Legg til:
#    SUPABASE_URL=your_supabase_url
#    SUPABASE_ANON_KEY=your_supabase_anon_key
# 3. Redeploy prosjektet
```

### **STEG 5: Testing og Validering**

```bash
# 1. Test live URL
curl -I https://pengeplan-hjelperen.vercel.app

# 2. Test alle sider:
# - https://pengeplan-hjelperen.vercel.app/ (login)
# - https://pengeplan-hjelperen.vercel.app/dashboard.html
# - https://pengeplan-hjelperen.vercel.app/profile.html
# - https://pengeplan-hjelperen.vercel.app/admin.html
# - https://pengeplan-hjelperen.vercel.app/support-programs.html
# - https://pengeplan-hjelperen.vercel.app/test-admin.html

# 3. Test Supabase tilkobling
# Åpne browser console på live site og kjør:
# import { db } from './js/db.js'; db.testConnection().then(console.log);
```

## **🔧 KONFIGURASJONSDETALJER**

### **Vercel Configuration (vercel.json)**
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "redirects": [
    { "source": "/admin", "destination": "/admin.html" },
    { "source": "/profile", "destination": "/profile.html" },
    { "source": "/dashboard", "destination": "/dashboard.html" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

### **Supabase Schema (supabase/schema.sql)**
```sql
-- Brukerprofiler
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  address JSONB,
  household JSONB,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'partner', 'admin')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'partner')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  notifications JSONB,
  consents JSONB,
  avatar JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Støtteordninger
CREATE TABLE support_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  eligibility JSONB,
  amount TEXT,
  application TEXT,
  url TEXT,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_programs ENABLE ROW LEVEL SECURITY;

-- Demo policy for development
CREATE POLICY demo_all_access ON profiles FOR ALL USING (true);
CREATE POLICY demo_all_access ON support_programs FOR ALL USING (true);
```

## **✅ SUCCESS KRITERIER**

1. **GitHub Repository:** ✅ Opprettet og kode pushet
2. **Vercel Deployment:** ✅ Live URL fungerer
3. **Supabase Database:** ✅ Schema kjørt og tilkobling fungerer
4. **Environment Variables:** ✅ Satt i Vercel
5. **All Pages Working:** ✅ Alle HTML-sider laster
6. **Admin Panel:** ✅ Kan logge inn og administrere brukere
7. **AI Advisor:** ✅ Chat-funksjonalitet fungerer
8. **Support Programs:** ✅ Database og søk fungerer
9. **Responsive Design:** ✅ Fungerer på mobil og desktop
10. **Test Suite:** ✅ Alle tester passerer

## **🔍 TROUBLESHOOTING**

### **Hvis Vercel deployment feiler:**
- Sjekk at alle filer er i root-mappen
- Verifiser at `vercel.json` er korrekt
- Sjekk at ingen filer har ugyldige tegn i navnene

### **Hvis Supabase ikke kobler:**
- Verifiser environment variables er satt
- Sjekk at schema.sql er kjørt
- Test tilkobling i browser console

### **Hvis sider ikke laster:**
- Sjekk at alle HTML-filer er i root
- Verifiser at CSS/JS mapper er korrekte
- Sjekk browser console for feil

## **📞 SUPPORT**

**Kontaktinformasjon:**
- **Utvikler:** Cato Hansen
- **E-post:** cato@catohansen.no
- **GitHub:** [Repository](https://github.com/catohansen/pengeplan-hjelperen)

## **🎯 FORVENTET RESULTAT**

Etter fullført deployment skal du ha:
- **Live URL:** `https://pengeplan-hjelperen.vercel.app`
- **GitHub:** `https://github.com/catohansen/pengeplan-hjelperen`
- **Supabase:** Database med brukere og støtteordninger
- **Funksjonell app:** Alle sider og funksjoner virker

**Status:** Production Ready 🚀

---

**INSTRUKSJONER TIL AGENT:**
1. Følg alle steg i rekkefølge
2. Dokumenter hvert steg med screenshots/links
3. Test alt grundig før du rapporterer suksess
4. Gi brukeren live URL og tilgangsinformasjon
5. Opprett en deployment-rapport med alle detaljer
