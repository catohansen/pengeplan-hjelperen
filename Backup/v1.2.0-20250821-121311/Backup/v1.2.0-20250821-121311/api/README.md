# Pengeplan - Digital økonomisk hjelper

Pengeplan er en digital app og nettsystem som skal hjelpe NAV-brukere, lavinntektsgrupper og personer med gjeld eller betalingsutfordringer i Norge. Løsningen kombinerer budsjettverktøy, gjeldsoversikt, støtteordningsinformasjon og AI-drevet veiledning i en brukervennlig pakke.

## 🎯 Formål

Pengeplan har som formål å gi økonomisk sårbare brukere bedre kontroll og mestring over egen økonomi. Visjonen er å demokratisere økonomisk rådgivning – alle, uavhengig av bakgrunn, skal få tilgang til verktøy og kunnskap som normalt er forbeholdt dem med høyere økonomisk kompetanse.

## ✨ Hovedfunksjoner

- **Budsjett og utgiftsstyring** - Enkel registrering og kategorisering av inntekter og utgifter
- **Gjeldsoversikt og -håndtering** - Hold styr på alle gjeldsposter og få hjelp til nedbetaling
- **Regningshåndtering og kalender** - Varsler om kommende regninger og forfallsdatoer
- **Støtteordninger og rettighetsguide** - Informasjon om offentlige støtteordninger
- **AI-basert økonomirådgivning** - Personlig chatbot for økonomisk veiledning
- **Dokument- og kvitteringsarkiv** - Sikker lagring av viktige dokumenter
- **Adminpanel for veiledere** - Verktøy for rådgivere og NAV-ansatte

## 🚀 Kom i gang

### Forutsetninger

- Node.js 18.0.0 eller nyere
- npm eller yarn
- Supabase konto
- OpenAI API-nøkkel

### Installasjon

1. **Klon repositoriet**
   ```bash
   git clone https://github.com/ditt-username/pengeplan.git
   cd pengeplan
   ```

2. **Installer avhengigheter**
   ```bash
   npm install
   # eller
   yarn install
   ```

3. **Konfigurer miljøvariabler**
   
   Opprett en `.env.local` fil i rotmappen:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=din-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=din-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=din-service-role-key

   # OpenAI
   OPENAI_API_KEY=din-openai-api-nøkkel

   # Admin
   ADMIN_TOKEN=ditt-admin-token
   ```

4. **Sett opp database**

   Opprett følgende tabeller i Supabase:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     phone TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     preferences JSONB DEFAULT '{}'
   );

   -- Budgets table
   CREATE TABLE budgets (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     spent DECIMAL(10,2) DEFAULT 0,
     category TEXT NOT NULL,
     period TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Transactions table
   CREATE TABLE transactions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     amount DECIMAL(10,2) NOT NULL,
     description TEXT NOT NULL,
     category TEXT NOT NULL,
     type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
     date DATE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Debts table
   CREATE TABLE debts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     interest_rate DECIMAL(5,2) NOT NULL,
     minimum_payment DECIMAL(10,2) NOT NULL,
     due_date DATE NOT NULL,
     status TEXT CHECK (status IN ('active', 'paid', 'defaulted')) DEFAULT 'active',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Bills table
   CREATE TABLE bills (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     due_date DATE NOT NULL,
     status TEXT CHECK (status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending',
     category TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Support schemes table
   CREATE TABLE support_schemes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT NOT NULL,
     eligibility_criteria TEXT NOT NULL,
     application_url TEXT NOT NULL,
     category TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Start utviklingsserveren**
   ```bash
   npm run dev
   # eller
   yarn dev
   ```

6. **Åpne nettleseren**
   
   Gå til [http://localhost:3000](http://localhost:3000) for å se applikasjonen.

## 🏗️ Teknisk arkitektur

### Frontend
- **Next.js 14** - React-rammeverk med App Router
- **TypeScript** - Type-sikker utvikling
- **Tailwind CSS** - Utility-first CSS-rammeverk
- **Lucide React** - Ikonbibliotek
- **Framer Motion** - Animasjoner
- **React Hook Form** - Skjemahåndtering

### Backend
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **OpenAI GPT-4** - AI-rådgivning
- **Next.js API Routes** - Serverless API-endepunkter

### Database
- **PostgreSQL** - Relasjonsdatabase
- **Row Level Security (RLS)** - Sikkerhet på radnivå
- **Real-time subscriptions** - Sanntidsoppdateringer

## 📱 Brukergrensesnitt

Pengeplan er designet med fokus på:
- **Enkelhet** - Intuitivt grensesnitt for alle brukere
- **Tilgjengelighet** - Universell utforming (UU)
- **Mobil-først** - Responsivt design for alle enheter
- **Klarspråk** - Enkelt og forståelig norsk

## 🔒 Sikkerhet og personvern

- **GDPR-kompatibel** - Følger norsk personvernlovgivning
- **Kryptert lagring** - Alle sensitive data er kryptert
- **Autentisering** - Sikker innlogging med Supabase Auth
- **Row Level Security** - Brukerdata er isolert
- **Ingen reklame** - 100% reklamefri og uten datasalgsmodell

## 🚀 Deployment

### Vercel (Anbefalt)

1. **Koble til GitHub**
   - Push koden til GitHub
   - Koble Vercel til GitHub-repositoriet

2. **Konfigurer miljøvariabler**
   - Legg til alle miljøvariabler i Vercel-dashboardet

3. **Deploy**
   - Vercel vil automatisk deploye ved hver push til main

### Andre plattformer

Applikasjonen kan også deployes på:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Bidrag

Vi setter pris på bidrag! Her er hvordan du kan bidra:

1. **Fork** repositoriet
2. **Opprett** en feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** endringene (`git commit -m 'Add amazing feature'`)
4. **Push** til branchen (`git push origin feature/amazing-feature`)
5. **Opprett** en Pull Request

### Utviklingsretningslinjer

- Følg TypeScript-best practices
- Bruk Tailwind CSS for styling
- Skriv tester for nye funksjoner
- Dokumenter API-endepunkter
- Følg norske konvensjoner for navngiving

## 📋 TODO

### MVP (Fase 1)
- [x] Grunnleggende prosjektstruktur
- [x] Landing page
- [x] Onboarding-flyt
- [x] Dashboard
- [x] AI-rådgiver (grunnleggende)
- [ ] Brukerautentisering
- [ ] Budsjettside
- [ ] Transaksjonshåndtering

### Fase 2
- [ ] Gjeldsmodul
- [ ] Regningshåndtering
- [ ] Støtteordninger
- [ ] Dokumentarkiv
- [ ] Adminpanel

### Fase 3
- [ ] Bankintegrasjon (PSD2)
- [ ] OCR for regninger
- [ ] Avanserte rapporter
- [ ] Mobilapp

## 📞 Kontakt

- **E-post**: kontakt@pengeplan.no
- **GitHub**: [github.com/pengeplan](https://github.com/pengeplan)
- **Nettside**: [pengeplan.no](https://pengeplan.no)

## 📄 Lisens

Dette prosjektet er lisensiert under MIT-lisensen - se [LICENSE](LICENSE) filen for detaljer.

## 🙏 Takk

Takk til alle som bidrar til å gjøre økonomisk hjelp tilgjengelig for alle i Norge!

---

**Pengeplan** - Demokratiserer økonomisk rådgivning for alle 🇳🇴
