# 🚀 Pengeplan - Supabase Integration Complete

## ✅ Pre-deploy (gjør dette først)

### 1. Supabase Setup
- [ ] Gå til [supabase.com](https://supabase.com) og opprett nytt prosjekt
- [ ] Kjør `supabase/schema.sql` i Supabase SQL-editor
- [ ] Verifiser at `profiles` og `plans` tabeller er opprettet
- [ ] Sjekk at demo RLS-policy er aktiv (tillater all tilgang)

### 2. Vercel Environment Variables
- [ ] Gå til Vercel Dashboard → Project Settings → Environment Variables
- [ ] Legg til `SUPABASE_URL` (fra Supabase Project Settings → API)
- [ ] Legg til `SUPABASE_ANON_KEY` (fra Supabase Project Settings → API)
- [ ] Redeploy prosjektet for å aktivere variablene

### 3. Code Changes
- [x] `USE_SUPABASE = true` i `js/db.js` ✅
- [x] Admin panel oppdatert til å bruke Supabase ✅
- [x] Profile system integrert med database ✅
- [ ] Commit og push endringene til GitHub

## 🧪 Post-deploy Testing

### 1. Connection Test
```javascript
// Åpne DevTools Console på hvilken som helst side
import { db } from './js/db.js';
db.testConnection().then(console.log);
// Forventet: { ok: true, message: 'Supabase-tilkobling OK' }
```

### 2. Admin Panel Test
- [ ] Gå til `/admin.html`
- [ ] Test "Ny bruker" med full informasjon
- [ ] Verifiser at brukere vises i listen med statistikk
- [ ] Test redigering og sletting av brukere
- [ ] Test søk og eksport-funksjonalitet
- [ ] Sjekk Supabase Dashboard → Table Editor → profiles

### 3. Profile Test
- [ ] Gå til `/profile.html`
- [ ] Fyll ut og lagre profil
- [ ] Sjekk at data lagres i Supabase
- [ ] Test avatar-opplasting og eksport

## 🔧 Troubleshooting

### Hvis testConnection() feiler:
1. Sjekk at env-variablene er satt i Vercel
2. Verifiser at schema er kjørt i Supabase
3. Sjekk at `/api/public/auth-config` returnerer `{ ok: true, url: "...", anon: "..." }`

### Hvis admin panel ikke fungerer:
1. Sjekk browser console for JavaScript-feil
2. Verifiser at alle async-funksjoner fungerer
3. Test med hard refresh (Cmd+Shift+R)

### Hvis profil ikke lagres:
1. Sjekk browser console for feil
2. Verifiser at RLS-policies tillater insert/update
3. Sjekk at `profiles` tabellen har riktig struktur

## 📊 Database Schema

### Profiles Table
- `id`: UUID primary key
- `full_name`: Brukerens fulle navn
- `email`: Unik e-postadresse
- `phone`: Telefonnummer
- `address`: JSON med gate, postnummer, by, kommune
- `household`: JSON med størrelse og noter
- `role`: user/partner/admin
- `plan`: free/pro/partner
- `status`: active/inactive/suspended
- `notifications`: JSON med varselinnstillinger
- `consents`: JSON med samtykker
- `beta`: Boolean for beta-tilgang
- `avatar`: JSON med profilbilde-data
- `created_at` / `updated_at`: Timestamps

## 🎯 Neste Steg

1. **Implementer Supabase Auth** for ekte brukerautentisering
2. **Aktiver RLS policies** for produksjon (fjern demo-policy)
3. **Legg til flere admin-funksjoner** (logging, analytics)
4. **Implementer betalingsintegrasjon** for planer
5. **Legg til backup og recovery** prosedyrer

## 📝 Notes
- Appen faller tilbake til localStorage hvis Supabase ikke er tilgjengelig
- Admin-panelet bruker nå Supabase for all brukerhåndtering
- Demo RLS-policy tillater all tilgang (endres for produksjon)
- Alle CRUD-operasjoner er implementert med feilhåndtering
