# 💰 Pengeplan - Din økonomiske hjelper

En moderne web-applikasjon for budsjett, gjeld og støtteordninger - bygget med HTML, CSS, JavaScript og Supabase.

## 🚀 Live Demo

- **Produksjon**: [pengeplan.vercel.app](https://pengeplan.vercel.app)
- **Admin Panel**: [pengeplan.vercel.app/admin](https://pengeplan.vercel.app/admin)

## ✨ Funksjoner

### 🏠 Bruker-app
- **Dashboard** med oversikt over økonomi
- **AI-rådgiver** for økonomiske spørsmål
- **Profil-håndtering** med avatar og innstillinger
- **Responsivt design** for alle enheter

### 👥 Admin Panel
- **Brukeradministrasjon** med CRUD-operasjoner
- **Statistikk og rapporter** i sanntid
- **Søk og filtrering** av brukere
- **CSV-eksport** av brukerdata
- **Innstillinger og API-konfigurasjon**

### 🔐 Sikkerhet
- **Supabase database** med Row Level Security
- **Automatisk fallback** til localStorage
- **Miljøvariabler** for konfigurasjon
- **CORS-håndtering** for API-endepunkter

## 🛠️ Teknisk Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Vercel
- **Styling**: Custom CSS med responsive design
- **Icons**: Emoji og Unicode-symboler

## 📁 Prosjektstruktur

```
pengeplan-hjelperen/
├── index.html              # Login-side
├── dashboard.html          # Hoveddashboard
├── profile.html            # Brukerprofil
├── admin.html              # Admin-panel
├── styles.css              # Hovedstyling
├── dashboard.css           # Dashboard-styling
├── responsive.css          # Responsiv design
├── script.js               # Login-logikk
├── dashboard.js            # Dashboard-funksjonalitet
├── js/
│   ├── db.js               # Database-adapter (Supabase/localStorage)
│   ├── profile.js          # Profil-håndtering
│   ├── admin.js            # Admin-panel logikk
│   └── supabaseClient.js   # Supabase-klient
├── api/
│   └── public/
│       └── auth-config.js  # Supabase-konfigurasjon API
├── supabase/
│   └── schema.sql          # Database-skjema
├── vercel.json             # Vercel-konfigurasjon
└── README.md               # Denne filen
```

## 🚀 Rask Start

### 1. Klone prosjektet
```bash
git clone https://github.com/ditt-brukernavn/pengeplan-hjelperen.git
cd pengeplan-hjelperen
```

### 2. Lokal utvikling
```bash
# Start lokal server
python3 -m http.server 8000
# eller
npx serve . -p 8000
# eller åpne direkte i nettleser
open index.html
```

Åpne [http://localhost:8000](http://localhost:8000) i nettleseren eller åpne `index.html` direkte.

## 🔧 Supabase Setup

### 1. Opprett Supabase-prosjekt
1. Gå til [supabase.com](https://supabase.com)
2. Logg inn og opprett nytt prosjekt
3. Velg region (f.eks. West Europe)
4. Noter ned Project URL og anon public key

### 2. Kjør Database Schema
1. Gå til SQL Editor i Supabase Dashboard
2. Kopier innholdet fra `supabase/schema.sql`
3. Kjør SQL-koden for å opprette tabeller og policies

### 3. Sett Environment Variables i Vercel
1. Gå til Vercel Dashboard → Project Settings → Environment Variables
2. Legg til:
   - `SUPABASE_URL`: Din Supabase Project URL
   - `SUPABASE_ANON_KEY`: Din Supabase anon public key
3. Redeploy prosjektet

### 4. Test Database Connection
```javascript
// Åpne DevTools Console på hvilken som helst side
import { db } from './js/db.js';
db.testConnection().then(console.log);
// Forventet: { ok: true, message: 'Supabase-tilkobling OK' }
```

## 📊 Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id uuid,
  full_name text,
  email text UNIQUE,
  phone text,
  address jsonb DEFAULT '{}'::jsonb,
  household jsonb DEFAULT '{}'::jsonb,
  role text DEFAULT 'user' CHECK (role IN ('user','partner','admin')),
  plan text DEFAULT 'free' CHECK (plan IN ('free','pro','partner')),
  status text DEFAULT 'active' CHECK (status IN ('active','inactive','suspended')),
  notifications jsonb DEFAULT '{}'::jsonb,
  consents jsonb DEFAULT '{}'::jsonb,
  beta boolean DEFAULT false,
  avatar jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Plans Table
```sql
CREATE TABLE plans (
  code text PRIMARY KEY,
  name text NOT NULL,
  limits jsonb DEFAULT '{}'::jsonb
);
```

## 🧪 Testing

### Admin Panel Test
1. Gå til `/admin.html`
2. Test "Ny bruker" med full informasjon
3. Verifiser at brukere vises i listen med statistikk
4. Test redigering og sletting av brukere
5. Test søk og eksport-funksjonalitet

### Profile Test
1. Gå til `/profile.html`
2. Fyll ut og lagre profil
3. Sjekk at data lagres i Supabase
4. Test avatar-opplasting og eksport

## 🔍 Troubleshooting

### Database Connection Issues
- Sjekk at environment variables er riktig satt
- Verifiser at schema.sql er kjørt
- Sjekk Supabase Dashboard for feilmeldinger

### Admin Panel Issues
- Sjekk browser console for JavaScript-feil
- Verifiser at alle async-funksjoner fungerer
- Test med hard refresh (Cmd+Shift+R)

## 🎯 Neste Steg

1. **Implementer Supabase Auth** for ekte brukerautentisering
2. **Aktiver RLS policies** for produksjon (fjern demo-policy)
3. **Legg til flere admin-funksjoner** (logging, analytics)
4. **Implementer betalingsintegrasjon** for planer
5. **Legg til backup og recovery** prosedyrer

## 📝 Lisens

Dette prosjektet er lisensiert under MIT License.

## 🤝 Bidrag

Bidrag er velkomne! Vennligst:
1. Fork prosjektet
2. Opprett en feature branch
3. Commit endringene
4. Push til branchen
5. Opprett en Pull Request

## 📞 Kontakt

- **GitHub**: [@ditt-brukernavn](https://github.com/ditt-brukernavn)
- **E-post**: din-epost@example.com

---

**Pengeplan** - Din økonomiske hjelper på vei mot bedre økonomisk velvære! 💰✨
