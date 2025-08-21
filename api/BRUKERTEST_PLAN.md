# 🧪 BRUKERTEST PLAN - PENGEPLAN
## Komplett testing for beste brukeropplevelse

---

## 🎯 **TESTING OBJEKTIVER**

### **Hovedmål:**
- ✅ **Mobile-first** brukeropplevelse
- ✅ **Intuitiv navigasjon** for alle aldersgrupper
- ✅ **Sikker og rask** innlogging/registrering
- ✅ **Responsivt design** på alle enheter
- ✅ **Tilgjengelighet** for brukere med funksjonshemminger

---

## 📱 **MOBILE TESTING (Prioritet 1)**

### **iPhone Testing Checklist:**
- [ ] **Scrolling**: Kan scrolle helt ned på alle sider
- [ ] **Touch-targets**: Alle knapper er 44px+ (finger-vennlige)
- [ ] **Menu-funksjonalitet**: Sidebar åpner/lukker korrekt
- [ ] **Form-input**: Tastatur fungerer på alle felter
- [ ] **Zoom**: Kan zoome uten horisontal scrolling
- [ ] **Orientation**: Fungerer i både portrait og landscape

### **iPad Testing Checklist:**
- [ ] **Responsivt design**: Layout tilpasser seg skjermstørrelse
- [ ] **Touch-interaksjoner**: Større touch-targets fungerer
- [ ] **Split-view**: Fungerer i iPad split-view
- [ ] **Pencil support**: Kan bruke Apple Pencil (hvis relevant)

### **Android Testing Checklist:**
- [ ] **Chrome**: Fungerer på Android Chrome
- [ ] **Safari**: Fungerer på Android Safari
- [ ] **Back-button**: Android back-button fungerer
- [ ] **Notifications**: Push-notifications (fremtidig)

---

## 🧑‍💻 **BRUKERFLYTTESTING**

### **Registreringstest:**
1. **Start**: Gå til register.html
2. **Fyll ut skjema**: Alle påkrevde felter
3. **Validering**: Test feilmeldinger og rettelser
4. **Passordstyrke**: Test passord-indikator
5. **Submit**: Test innsending og redirect
6. **Verifisering**: Sjekk at bruker er opprettet

### **Innloggingstest:**
1. **E-post/passord**: Test med registrerte brukere
2. **Demo-brukere**: Test admin-funksjonalitet
3. **Feilhåndtering**: Test ugyldige credentials
4. **Session**: Test at innlogging varer
5. **Logout**: Test utlogging og redirect

### **Dashboard-test:**
1. **Navigasjon**: Test alle sidebar-lenker
2. **Responsivitet**: Test på mobil/tablet/desktop
3. **Funksjonalitet**: Test alle knapper og forms
4. **Data-persistens**: Test at data lagres
5. **Performance**: Test lastehastighet

---

## 🎯 **MÅLGRUPPE TESTING**

### **NAV-klienter (Økonomisk utsatte):**
- [ ] **Enkel navigasjon**: Kan finne hva de leter etter
- [ ] **Tydelig språk**: Ingen teknisk jargon
- [ ] **Støtteordninger**: Kan finne relevante støtteordninger
- [ ] **Hjelp-funksjoner**: Kan få hjelp når de trenger det
- [ ] **Sikkerhet**: Føler seg trygge med dataene sine

### **Privatpersoner (Uten økonomisk ekspertise):**
- [ ] **Intuitivt design**: Kan bruke uten opplæring
- [ ] **Forklaringer**: Forstår økonomiske begreper
- [ ] **Budsjett-hjelp**: Kan lage og følge budsjett
- [ ] **Rapporter**: Kan forstå økonomiske rapporter
- [ ] **AI-rådgivning**: Får nyttige råd fra AI

### **Eldre brukere (50+ år):**
- [ ] **Større tekst**: Kan lese all tekst enkelt
- [ ] **Kontrast**: God kontrast mellom farger
- [ ] **Enkel navigasjon**: Ikke for mange valg
- [ ] **Hjelp-tekster**: Tydelige forklaringer
- [ ] **Feil-toleranse**: Kan gjøre feil uten problemer

### **Unge brukere (18-30 år):**
- [ ] **Mobile-first**: Fungerer perfekt på mobil
- [ ] **Rask opplevelse**: Ingen ventetid
- [ ] **Moderne design**: Ser profesjonelt ut
- [ ] **Social features**: Kan dele (fremtidig)
- [ ] **Gamification**: Engasjerende elementer

---

## 🌐 **TEKNISK TESTING**

### **Cross-browser Testing:**
- [ ] **Chrome**: Fungerer på alle versjoner
- [ ] **Safari**: Fungerer på macOS og iOS
- [ ] **Firefox**: Fungerer på alle versjoner
- [ ] **Edge**: Fungerer på Windows
- [ ] **Mobile browsers**: Chrome/Safari på mobil

### **Performance Testing:**
- [ ] **Lastehastighet**: Under 3 sekunder
- [ ] **Responsivitet**: Under 100ms for interaksjoner
- [ ] **Memory usage**: Ikke memory leaks
- [ ] **Network usage**: Optimalisert data-overføring
- [ ] **Caching**: Fungerer offline (PWA)

### **Accessibility Testing (WCAG 2.1 AA):**
- [ ] **Keyboard navigation**: Kan navigere med tastatur
- [ ] **Screen readers**: Fungerer med VoiceOver/NVDA
- [ ] **Color contrast**: Minst 4.5:1 kontrast
- [ ] **Focus indicators**: Tydelige focus-ringer
- [ ] **Alt-text**: Alle bilder har alt-text

### **Security Testing:**
- [ ] **Input validation**: XSS-beskyttelse
- [ ] **CSRF protection**: Cross-site request forgery
- [ ] **SQL injection**: Database-beskyttelse
- [ ] **HTTPS**: Kryptert kommunikasjon
- [ ] **Session management**: Sikre sessions

---

## 🎨 **A/B TESTING**

### **Design-elementer:**
- [ ] **Innloggingsside**: Bred vs smal layout
- [ ] **Feature-oversikt**: 3 vs 6 features
- [ ] **Fargepalett**: Grønn/orange vs andre
- [ ] **Call-to-action**: "Registrer deg" vs "Kom i gang"
- [ ] **Button-styles**: Filled vs outlined

### **Content Testing:**
- [ ] **Tekst-lengde**: Kort vs lang beskrivelse
- [ ] **Bildebruk**: Med vs uten illustrasjoner
- [ ] **Tone**: Formell vs uformell
- [ ] **Språk**: Bokmål vs nynorsk
- [ ] **Fokus**: Sikkerhet vs enkelhet

---

## 📊 **TESTING METODOLOGI**

### **Usability Testing:**
1. **Think-aloud**: Bruker snakker mens de bruker systemet
2. **Task completion**: Gitt oppgaver å fullføre
3. **Time tracking**: Måler hvor lang tid oppgaver tar
4. **Error tracking**: Registrerer feil og problemer
5. **Satisfaction survey**: Net Promoter Score (NPS)

### **Testing Tools:**
- **Hotjar**: Heatmaps og session recordings
- **Google Analytics**: Brukeratferd og konvertering
- **Lighthouse**: Performance og accessibility
- **Browser DevTools**: Teknisk debugging
- **Real devices**: Fysisk testing på enheter

---

## 🚀 **TESTING TIMELINE**

### **Uke 1: Mobile Testing**
- [ ] iPhone testing (iOS 15+)
- [ ] iPad testing (iPadOS 15+)
- [ ] Android testing (Android 10+)
- [ ] Responsivt design validering

### **Uke 2: Brukerflyt Testing**
- [ ] Registreringstest
- [ ] Innloggingstest
- [ ] Dashboard-funksjonalitet
- [ ] Navigasjon og routing

### **Uke 3: Målgruppe Testing**
- [ ] NAV-klienter (5-10 brukere)
- [ ] Privatpersoner (10-15 brukere)
- [ ] Eldre brukere (5-10 brukere)
- [ ] Unge brukere (10-15 brukere)

### **Uke 4: Teknisk Testing**
- [ ] Cross-browser testing
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] Security testing

### **Uke 5: A/B Testing**
- [ ] Design-elementer
- [ ] Content testing
- [ ] Optimering basert på resultater
- [ ] Final testing og validering

---

## 📈 **SUCCESS METRICS**

### **Kvantitative mål:**
- **Task completion rate**: >90%
- **Time to complete**: <2 minutter for registrering
- **Error rate**: <5%
- **Satisfaction score**: >8/10
- **Mobile performance**: >90 Lighthouse score

### **Kvalitative mål:**
- **Intuitivt design**: Brukere forstår uten opplæring
- **Engasjerende opplevelse**: Brukere vil komme tilbake
- **Tillit**: Brukere føler seg trygge
- **Verdi**: Brukere ser nytte av systemet
- **Anbefaling**: Brukere vil anbefale til andre

---

## 🎯 **NESTE STEG**

1. **Start mobile testing** umiddelbart
2. **Identifiser kritiske problemer** først
3. **Fiks høy-prioritet issues** raskt
4. **Iterativ testing** og forbedring
5. **Kontinuerlig feedback** fra brukere

---

*Test plan utarbeidet: 21. august 2025*  
*Status: Klar for implementering*  
*Prioritet: Mobile testing først*
