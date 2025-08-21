# 🎯 MASTER RAPPORT - PENGEPLAN v1.2.0
## Komplett regnskaps- og økonomisystem for privatpersoner

---

## 📋 **EXECUTIVE SUMMARY**

Pengeplan er et revolusjonerende økonomisystem designet spesielt for norske privatpersoner og økonomisk utsatte brukere. Systemet integrerer norsk regelverk, BankID-autentisering, NAV-støtteordninger og AI-rådgivning i en brukervennlig plattform.

### 🎯 **Hovedmål**
- **Lovmessig riktig** etter norsk regelverk (Lovdata.no, Skatteetaten.no, NAV)
- **Privat og sikker** (GDPR, kryptering, tilgangskontroll)
- **Brukervennlig** for privatpersoner uten økonomisk ekspertise
- **Full admin-kontroll** med overvåking og funksjonsstyring

---

## 🔍 **RESEARCH & KRAVSPESIFIKASJON**

### **Markedsanalyse - Eksisterende løsninger**

#### **Norske løsninger:**
- **Tripletex**: Kompleks, rettet mot bedrifter
- **Fiken**: Enkel, men mangler NAV-integrasjon
- **Visma**: Enterprise-fokus, kostbar
- **Conta**: Middels kompleksitet, begrenset funksjonalitet

#### **Internasjonale løsninger:**
- **Mint (Intuit)**: Ikke tilgjengelig i Norge
- **YNAB**: Kompleks, engelsk-språklig
- **Quicken**: Desktop-basert, ikke web

#### **Gap-analyse:**
✅ **Mangler**: Norsk-språklig, NAV-integrasjon, BankID, GDPR-kompatibel
✅ **Behov**: Enkel brukergrensesnitt, automatisk støtteordning-søk
✅ **Mulighet**: Først til markedet med komplett norsk løsning

### **Juridiske krav - Norsk regelverk**

#### **Bokføringsloven:**
- Privatpersoner ikke pålagt bokføring
- Frivillig system må følge regnskapsprinsipper
- Beviskrav for skattefradrag

#### **Personopplysningsloven (GDPR):**
- Samtykke for databehandling
- Retten til sletting og eksport
- Dataminimering og formålsbegrensning
- Sikker lagring og overføring

#### **Skatteloven:**
- Dokumentasjon av inntekter og utgifter
- Beviskrav for fradrag
- Årlig skattemelding (RF-1030)

#### **NAV-støtteordninger:**
- Automatisk søk basert på brukerdata
- Integrasjon med Altinn for søknader
- Sikker håndtering av sensitive opplysninger

---

## 🚀 **FUNKSJONSLISTE - BRUKER**

### **MVP (Minimum Viable Product)**

#### **📊 Grunnleggende økonomioverblikk**
- **Inntekter**: Lønn, trygd, andre inntekter
- **Utgifter**: Fast, variabel, engangs
- **Budsjett**: Månedlig oversikt med varsler
- **Gjeld**: Oversikt over lån og renter
- **Nettoformue**: Beregning av total økonomisk status

#### **🔐 Sikker innlogging**
- **E-post/passord**: Standard autentisering
- **BankID**: Sikker norsk eID-løsning
- **To-faktor autentisering**: SMS eller app-basert

#### **📱 Responsivt design**
- **Mobile-first**: Optimalisert for iPhone/Android
- **Tablet-støtte**: iPad og andre tablets
- **Desktop**: Full funksjonalitet på PC/Mac

### **PLUS (Utvidet funksjonalitet)**

#### **🏦 Bank-integrasjon**
- **Open Banking API**: Sikker tilgang til bankdata
- **Automatisk import**: Transaksjoner og saldo
- **Kategorisering**: AI-drevet kategorisering av utgifter

#### **📋 NAV-støtteordninger**
- **Automatisk søk**: Basert på brukerdata
- **Søknadshjelp**: Steg-for-steg veiledning
- **Status-oppdateringer**: Integrasjon med NAV
- **Dokumentopplasting**: Kvitteringer og bevis

#### **🤖 AI-økonomirådgiver**
- **Personlig rådgivning**: Basert på økonomisk situasjon
- **Budsjettforslag**: Automatiske anbefalinger
- **Gjeldshåndtering**: Snowball/avalanche-metoder
- **Skatteoptimalisering**: Fradrag og støtteordninger

#### **📄 Dokumenthåndtering**
- **OCR-scanning**: Automatisk tekstgjenkjenning
- **Kvitteringsarkiv**: Sikker lagring av bevis
- **PDF-eksport**: Rapporter og dokumentasjon
- **Backup**: Automatisk sikkerhetskopi

### **PREMIUM (Avansert funksjonalitet)**

#### **📊 Avanserte rapporter**
- **Årlig oversikt**: Komplett økonomisk rapport
- **Skattemelding**: Automatisk RF-1030
- **Gjeldanalyse**: Detaljert gjeldsoversikt
- **Investeringsanalyse**: Portefølje og avkastning

#### **🔗 API-integrasjoner**
- **Altinn**: Automatisk skattemelding
- **Banker**: Direkte tilgang til kontoer
- **NAV**: Status og søknader
- **Skatteetaten**: Automatisk fradrag

---

## ⚙️ **FUNKSJONSLISTE - ADMIN**

### **👥 Brukeradministrasjon**
- **Brukeroversikt**: Alle registrerte brukere
- **Rollehåndtering**: Gratis, Premium, Admin
- **Statuskontroll**: Aktiv, inaktiv, suspendert
- **Brukerstatistikk**: Aktivitet og bruk

### **🔧 Systemkontroll**
- **Modulstyring**: Slå av/på funksjoner
- **API-integrasjoner**: Konfigurere eksterne tjenester
- **Sikkerhetsinnstillinger**: RLS-policy og kryptering
- **Backup og gjenoppretting**: Automatisk og manuell

### **📊 Overvåking og rapportering**
- **Systemlogg**: Alle brukerhandlinger
- **Feilrapportering**: Automatisk feilhåndtering
- **Ytelsesovervåking**: Server og database
- **Brukerstatistikk**: Aggregerte data (ikke persondata)

### **🔒 Sikkerhet og compliance**
- **GDPR-overvåking**: Samtykke og databehandling
- **Sikkerhetslogg**: Innbruddsforsøk og mistenkelig aktivitet
- **Backup-verifisering**: Test av gjenoppretting
- **Compliance-rapporter**: Lovmessig overholdelse

---

## 🗄️ **DATABASE & BACKEND (SUPABASE)**

### **📋 Tabellstruktur**

```sql
-- Brukere og profiler
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    bankid_id VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    birth_date DATE,
    address JSONB,
    employment_status VARCHAR(50),
    household_type VARCHAR(50),
    annual_income DECIMAL(12,2),
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Økonomiske data
CREATE TABLE incomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR(20) DEFAULT 'monthly',
    source VARCHAR(100),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    recurring BOOLEAN DEFAULT FALSE,
    receipt_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,4),
    monthly_payment DECIMAL(10,2),
    institution VARCHAR(100),
    debt_type VARCHAR(50),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    period VARCHAR(20) DEFAULT 'monthly',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- NAV og støtteordninger
CREATE TABLE support_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    eligibility_criteria JSONB,
    application_url VARCHAR(500),
    max_amount DECIMAL(12,2),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_support_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES support_programs(id),
    status VARCHAR(50) DEFAULT 'pending',
    applied_date DATE,
    approved_date DATE,
    amount DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dokumenter og kvitteringer
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    ocr_text TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System og admin
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **🔒 Row Level Security (RLS)**

```sql
-- Aktiver RLS på alle tabeller
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_support_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Bruker kan kun se egne data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own profiles" ON profiles
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own incomes" ON incomes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own expenses" ON expenses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own debts" ON debts
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own budgets" ON budgets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own applications" ON user_support_applications
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own documents" ON documents
    FOR ALL USING (auth.uid() = user_id);

-- Admin kan se alt
CREATE POLICY "Admins can view all data" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Støtteordninger er offentlige
CREATE POLICY "Support programs are public" ON support_programs
    FOR SELECT USING (TRUE);
```

---

## 🛠️ **TEKNISK SPESIFIKASJON**

### **Frontend (HTML/CSS/JS)**
- **Vanilla JavaScript**: Ingen rammeverk for maksimal ytelse
- **ES6 Modules**: Modulær arkitektur
- **Responsive Design**: Mobile-first tilnærming
- **Accessibility**: WCAG 2.1 AA-kompatibel
- **PWA**: Progressive Web App funksjonalitet

### **Backend (Supabase)**
- **PostgreSQL**: Robust database
- **Real-time**: Live oppdateringer
- **Edge Functions**: Serverless API
- **Storage**: Sikker filopplasting
- **Auth**: Integrert autentisering

### **Hosting (Vercel)**
- **Edge Network**: Global CDN
- **Serverless**: Skalerbar arkitektur
- **Git Integration**: Automatisk deployment
- **Analytics**: Brukerstatistikk

### **Sikkerhet**
- **HTTPS**: Kryptert kommunikasjon
- **CSP**: Content Security Policy
- **CORS**: Cross-Origin Resource Sharing
- **Rate Limiting**: Beskyttelse mot angrep
- **Input Validation**: XSS og SQL injection beskyttelse

---

## 📅 **FREMDIFTSPLAN**

### **MVP (Måned 1-2)**
- ✅ Grunnleggende brukerregistrering og innlogging
- ✅ Enkel økonomioverblikk (inntekter/utgifter)
- ✅ Responsivt design for mobil/tablet
- ✅ BankID-integrasjon
- 🔄 Grunnleggende NAV-støtteordning-søk

### **v1.0 (Måned 3-4)**
- 🔄 Komplett økonomioverblikk med budsjett
- 🔄 AI-økonomirådgiver (grunnleggende)
- 🔄 Dokumentopplasting og OCR
- 🔄 Rapporter og eksport
- 🔄 Admin-panel med brukeradministrasjon

### **v2.0 (Måned 5-6)**
- 🔄 Bank-integrasjon via Open Banking
- 🔄 Avanserte NAV-integrasjoner
- 🔄 Automatisk skattemelding
- 🔄 Avanserte rapporter og analyser
- 🔄 API for eksterne integrasjoner

### **v3.0 (Måned 7-8)**
- 🔄 Machine Learning for prediktiv analyse
- 🔄 Avanserte sikkerhetsfunksjoner
- 🔄 Multi-tenant arkitektur
- 🔄 Enterprise-funksjoner
- 🔄 Internasjonal ekspansjon

---

## ⚠️ **RISIKOVURDERING**

### **Tekniske risikoer**
- **Datasikkerhet**: GDPR-compliance og kryptering
- **Skalerbarhet**: Håndtering av økende brukermengde
- **API-avhengighet**: Banker og offentlige tjenester
- **Ytelse**: Optimalisering for store datamengder

### **Juridiske risikoer**
- **GDPR**: Personvern og databehandling
- **Finansregulering**: PSD2 og Open Banking
- **Skatteetaten**: Automatisk skattemelding
- **NAV**: Sensitive personopplysninger

### **Forretningsrisikoer**
- **Markedskonkurranse**: Etablerte aktører
- **Brukeradopsjon**: Aksept av ny plattform
- **Teknisk kompetanse**: Utvikling og vedlikehold
- **Regulatoriske endringer**: Lovendringer

### **Mitigering**
- **Sikkerhetsaudit**: Regelmessig penetrasjonstesting
- **Juridisk rådgivning**: Kontinuerlig compliance
- **Brukerfeedback**: Iterativ utvikling
- **Backup-strategi**: Redundant infrastruktur

---

## 🎯 **KONKLUSJON**

Pengeplan representerer en unik mulighet til å revolusjonere økonomistyring for norske privatpersoner. Ved å kombinere norsk regelverk, moderne teknologi og brukervennlig design, kan systemet bli den ledende løsningen for økonomisk inkludering og selvstendighet.

### **Nøkkelfaktorer for suksess:**
1. **Lovmessig compliance** fra dag én
2. **Brukervennlig design** for alle aldersgrupper
3. **Sikker og privat** databehandling
4. **Skalerbar arkitektur** for fremtidig vekst
5. **Kontinuerlig forbedring** basert på brukerfeedback

### **Neste steg:**
1. **Utvikling av MVP** med grunnleggende funksjonalitet
2. **Sikkerhetsaudit** og GDPR-compliance
3. **Bruker-testing** med målgrupper
4. **Pilot-program** med NAV og andre partnere
5. **Markedsføring** og brukeradopsjon

---

*Rapport utarbeidet: 21. august 2025*  
*Versjon: 1.2.0*  
*Status: Klar for implementering*
