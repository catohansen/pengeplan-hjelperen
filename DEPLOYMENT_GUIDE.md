# 🚀 Pengeplan Deployment Guide

## **📋 Forutsetninger**

### **GitHub Setup**
1. Opprett nytt repository på GitHub: `pengeplan-hjelperen`
2. Kopier repository URL
3. Kjør følgende kommandoer:

```bash
git remote add origin https://github.com/[ditt-username]/pengeplan-hjelperen.git
git branch -M main
git push -u origin main
```

### **Vercel Setup**
1. Gå til [vercel.com](https://vercel.com)
2. Logg inn med GitHub
3. Klikk "New Project"
4. Velg `pengeplan-hjelperen` repository
5. Deploy settings:
   - Framework Preset: `Other`
   - Build Command: `(leave empty)`
   - Output Directory: `.`
   - Install Command: `(leave empty)`

### **Supabase Setup**
1. Gå til [supabase.com](https://supabase.com)
2. Opprett nytt prosjekt
3. Kjør SQL schema fra `supabase/schema.sql`
4. Kopier URL og Anon Key

### **Environment Variables (Vercel)**
Legg til i Vercel Project Settings → Environment Variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## **🎯 Deployment Steps**

### **1. GitHub Repository**
```bash
# Opprett repository på GitHub først
git remote add origin https://github.com/[username]/pengeplan-hjelperen.git
git branch -M main
git push -u origin main
```

### **2. Vercel Deployment**
- Connect GitHub repository
- Deploy automatisk
- Sjekk at alle sider fungerer

### **3. Supabase Database**
- Kjør schema.sql i Supabase SQL Editor
- Test database connection
- Verifiser RLS policies

### **4. Testing**
- Test alle sider: index.html, dashboard.html, profile.html, admin.html
- Test admin panel funksjoner
- Test responsive design
- Test database operasjoner

## **✅ Success Checklist**

- [ ] GitHub repository opprettet og pushet
- [ ] Vercel deployment fungerer
- [ ] Supabase database koblet
- [ ] Alle sider laster korrekt
- [ ] Admin panel fungerer
- [ ] Test suite fungerer
- [ ] Responsive design OK
- [ ] Database operasjoner fungerer

## **🔧 Troubleshooting**

### **Hvis Vercel ikke finner filer:**
- Sjekk at `vercel.json` er i root
- Sjekk at alle HTML-filer er i root
- Sjekk at CSS/JS mapper er korrekte

### **Hvis Supabase ikke kobler:**
- Sjekk environment variables
- Sjekk at schema.sql er kjørt
- Sjekk CORS settings

### **Hvis admin panel ikke fungerer:**
- Sjekk at js/admin.js laster
- Sjekk browser console for feil
- Test localStorage fallback

## **📊 Post-Deployment**

### **Testing Checklist**
1. **Login Page** - index.html
2. **Dashboard** - dashboard.html
3. **Profile** - profile.html
4. **Admin Panel** - admin.html
5. **Test Suite** - test-admin.html

### **Performance Check**
- Page load times < 3 sekunder
- Mobile responsiveness
- Cross-browser compatibility

### **Security Check**
- HTTPS enabled
- Environment variables secure
- No sensitive data in client code

## **🎉 Success!**

Når alt fungerer, har du en live Pengeplan app på:
`https://pengeplan-hjelperen.vercel.app`

---

**Neste steg:** AI-rådgiver implementering og støtteordningsdatabase! 🚀
