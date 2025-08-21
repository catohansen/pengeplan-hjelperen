// ChatGPT 5 Integration Class
class ChatGPT5Integration {
    constructor() {
        this.apiKey = ''; // Add your OpenAI API key here: sk-...
        this.apiUrl = 'https://api.openai.com/v1/chat/completions';
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        this.suggestionButtons = document.querySelectorAll('.suggestion-btn');
        
        this.initializeChat();
    }
    
    initializeChat() {
        if (!this.chatMessages || !this.chatInput || !this.sendButton) {
            console.warn('Chat elements not found. Make sure you have updated the HTML.');
            return;
        }
        
        // Send message event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Suggestion buttons
        this.suggestionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const suggestion = e.target.dataset.suggestion;
                if (suggestion) {
                    this.chatInput.value = suggestion;
                    this.sendMessage();
                }
            });
        });
        
        // Auto-focus input
        this.chatInput.focus();
        
        // Add status indicator
        this.addStatusIndicator();
    }
    
    addStatusIndicator() {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'chat-status';
        statusDiv.innerHTML = `
            <div class="status-dot"></div>
            <span>ChatGPT 5 er klar til å hjelpe</span>
        `;
        
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.appendChild(statusDiv);
        }
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Disable input and button
        this.chatInput.disabled = true;
        this.sendButton.disabled = true;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            let response;
            if (this.apiKey && this.apiKey.startsWith('sk-')) {
                response = await this.callChatGPT5(message);
            } else {
                response = await this.callChatGPT5Demo(message);
            }
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Beklager, jeg kunne ikke behandle forespørselen din akkurat nå. Prøv igjen senere. 🤖', 'bot');
            console.error('ChatGPT API Error:', error);
        }
        
        // Re-enable input and button
        this.chatInput.disabled = false;
        this.sendButton.disabled = false;
        this.chatInput.focus();
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (sender === 'bot') {
            messageContent.innerHTML = `<strong>AI Assistent:</strong> ${this.formatMessage(content)}`;
        } else {
            messageContent.textContent = content;
        }
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom smoothly
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    formatMessage(message) {
        // Convert markdown-like formatting to HTML
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>')
            .replace(/```(.*?)```/gs, '<code style="background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">$1</code>')
            .replace(/`(.*?)`/g, '<code style="background: #f1f5f9; padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace;">$1</code>');
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typingIndicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'typing-indicator';
        typingContent.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        typingDiv.appendChild(typingContent);
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    async callChatGPT5(userMessage) {
        // Note: GPT-5 is not yet publicly available. This uses GPT-4 as placeholder
        const systemPrompt = `Du er en ekspert norsk finansrådgiver som hjelper med personlig økonomi. 
        Du skal gi praktiske, spesifikke råd tilpasset norske forhold, inkludert norske banker, 
        skatteregler, og finansielle produkter. Svar alltid på norsk og vær vennlig og hjelpsom.
        
        Fokuser på:
        - Budsjettplanlegging og økonomisk oversikt
        - Sparestrategier og bankprodukter (BSU, høyrentekonto, etc.)
        - Investeringsråd (aksjer, fond, eiendom) tilpasset norske forhold
        - Gjeldshåndtering og refinansiering
        - Pensjonssparing (tjenestepensjon, IPS, etc.)
        - Norske skatteregler, fradrag og skatteoptimalisering
        - Boliglån og boligkjøp i Norge
        
        Hold svarene konsise men informative. Bruk emojis sparsomt og relevant.
        Gi konkrete eksempler og tall når det er relevant.`;
        
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4', // Will be updated to 'gpt-5' when available
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 600,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    // Demo mode for testing without API key
    async callChatGPT5Demo(userMessage) {
        // Simulate realistic API delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 1000));
        
        // Enhanced demo responses with more detailed Norwegian financial advice
        const demoResponses = {
            'budsjett': `For å lage et solid budsjett i Norge, følg disse trinnene:

**1. Kartlegg inntektene dine:**
- Lønn etter skatt
- Barnetrygd, bostøtte eller andre stønader
- Eventuelle biinntekter

**2. List opp faste utgifter:**
- Husleie/boliglån (bør ikke overstige 25-30% av inntekt)
- Strøm og kommunale avgifter
- Forsikringer (innbo, bil, reise)
- Telefon og internett
- Barnehage/SFO

**3. Variable utgifter:**
- Mat og dagligvarer (ca. 3000-5000 kr/mnd for en person)
- Transport
- Klær og personlige utgifter

**Tommelfingerregel:** 50% nødvendigheter, 30% ønsker, 20% sparing. 

Bruk apper som DNB, Sparebank 1 eller Sbanken sine budsjettverktøy for automatisk kategorisering! 📊`,

            'sparing': `Her er en smart sparestrategi for nordmenn:

**1. Nødfond først (prioritet #1):**
- 3-6 måneder med utgifter
- Plasser på høyrentekonto (for tiden 4-5% rente)
- Forslag: Komplett Bank, Santander, Bank Norwegian

**2. BSU - hvis du er under 34 år:**
- Inntil 25 000 kr/år
- 20% skattefradrag (= 5000 kr tilbake på skatten!)
- Rente på 2,5-4% i tillegg

**3. Langsiktig sparing:**
- Aksjefond for 10+ års perspektiv
- Indeksfond med lave kostnader (under 0,5% årlig)
- Månedlig sparing gir "cost averaging"

**4. Pensjon:**
- Maksimer innskudd til tjenestepensjon
- Vurder IPS for ekstra skattefradrag

Start med det du har råd til - selv 500 kr/mnd gjør stor forskjell over tid! 💰`,

            'investering': `Investeringsråd for nybegynnere i Norge:

**Start enkelt:**
- **Globale indeksfond:** MSCI World eller All World
- **Norske fond:** For hjemmemarkedseksponering
- **Månedlig sparing:** 1000-5000 kr automatisk

**Anbefalte fond (lave kostnader):**
- DNB Global Indeks
- Storebrand Global Multifaktor
- KLP AksjeGlobal Indeks

**Viktige prinsipper:**
- Diversifiser (ikke alle egg i samme kurv)
- Tenk langsiktig (minimum 5-10 år)
- Ikke prøv å "time" markedet
- Reinvester utbytte automatisk

**Skattetips:**
- Bruk aksjesparekonto (ASK) for første 500 000 kr
- 22% flat skatt på gevinst i ASK vs 31,68% marginalskatt

**Risiko:** Start konservativt med 60% aksjer, 40% obligasjoner, øk aksjeandelen over tid. 📈`,

            'lån': `Lånestrategi for nordmenn:

**Prioritering av nedbetaling:**
1. **Kredittkortgjeld** (15-25% rente) - betal ned ASAP!
2. **Forbrukslån** (5-15% rente)
3. **Billån** (3-8% rente)
4. **Boliglån** (4-6% rente) - lavest prioritet

**Refinansiering av boliglån:**
- Forhandl med din bank årlig
- Sammenlign renter hos andre banker
- Vurder å bytte ved 0,5%+ forskjell
- Beste renter: Santander, Komplett, Bank Norwegian

**Smart strategi:**
- Betal ekstra på lån med høyest rente
- Vurder å samle lån for bedre oversikt
- Behold boliglån hvis renten er under 5% og du kan investere forskjellen

**Forhandlingstips med banken:**
- Vis til konkurrentenes tilbud
- Vær kunde med flere produkter
- Spør om rabatter (ung kunde, fagforening, etc.) 🏦`,

            'pensjon': `Pensjonssparing i Norge - viktig å starte tidlig!

**1. Folketrygd (grunnpensjon):**
- Alle får dette, men blir stadig mindre
- Krever 40 års opptjening for full pensjon

**2. Tjenestepensjon (fra jobb):**
- Arbeidsgiver betaler minimum 2% av lønn
- Du kan ofte øke til 5-7% med skattefradrag
- **Gjør dette!** - det er "gratis penger"

**3. Individuell pensjonssparing (IPS):**
- Inntil 40 000 kr/år med skattefradrag
- Effektiv rente: din marginalskatt + fondets avkastning
- Pengene låses til 62 år

**Eksempel:** 
- 30-åring som sparer 3000 kr/mnd
- 7% årlig avkastning
- Vil ha ca. 7,4 millioner ved 67 år!

**Tommelfingerregel:** Spar 10-15% av bruttoinntekt til pensjon.

Start i dag - renters rente er kraftig! ⏰`,

            'skatt': `Viktige skattefradrag for 2024:

**Automatiske fradrag:**
- **Minstefradrag:** 106 200 kr (de fleste)
- **Personfradrag:** 68 600 kr

**Fradrag du må huske:**
- **Reisefradrag:** Over 24 500 kr/år til/fra jobb
- **Fagforeningskontingent:** Fullt fradragsgill
- **Gaver:** Inntil 25 000 kr til frivillige organisasjoner
- **Renteutgifter:** På lån til bolig/hytte

**Sparefradrag:**
- **BSU:** 20% av innskudd (maks 5000 kr tilbake)
- **IPS:** Skattefradrag på pensjonssparing
- **Gave til barn:** Kan spare skatt ved å gi til barns BSU

**Viktige datoer:**
- Skattemelding: Frist 30. april
- Forskuddsskatt: Juster før november for å unngå restskatt

**Tips:** Bruk Skatteetatens kalkulator og spar kvitteringer digitalt! 📊`,

            'boliglån': `Boliglån i Norge - det du må vite:

**Lånegrenser (fra 2024):**
- Maks 5x bruttoinntekt i Oslo/Bergen/Trondheim/Stavanger
- Maks 5,5x bruttoinntekt andre steder
- Minimum 15% egenkapital (10% for førstegangskjøpere)

**Beste renter akkurat nå:**
- Santander: Fra 4,95%
- Komplett Bank: Fra 5,05%
- Bank Norwegian: Fra 5,15%

**Lånetype:**
- **Fast rente:** Sikkerhet, men ofte dyrere
- **Flytende rente:** Billigere, men risiko for økning
- Mange velger kombinasjon (50/50)

**Kostnader ved kjøp:**
- Dokumentavgift: 2,5% av kjøpesum
- Tinglysing: ca. 600 kr
- Takst: 5000-15 000 kr
- Megler: 2-3% + mva

**Tips:** Få forhåndsgodkjent lån og forhandl alltid! 🏠`,

            'default': `Hei! Jeg er din AI-finansrådgiver drevet av ChatGPT 5, spesialisert på norske økonomiske forhold. 

Jeg kan hjelpe deg med:
- 💰 **Budsjettplanlegging** og økonomisk oversikt
- 🏦 **Sparestrategier** (BSU, høyrentekonto, fond)
- 📈 **Investeringsråd** tilpasset norske forhold
- 🏠 **Boliglån** og refinansiering
- 📊 **Skatteoptimalisering** og fradrag
- 💳 **Gjeldshåndtering** og lånestrategier
- ⏰ **Pensjonssparing** (IPS, tjenestepensjon)

Spør meg gjerne om noe spesifikt, eller bruk forslagene under for å komme i gang! 

Hva ønsker du å vite mer om? 🤖`
        };
        
        // Enhanced keyword matching with multiple keywords per topic
        const keywords = {
            'budsjett': ['budsjett', 'utgift', 'inntekt', 'økonomi', 'oversikt', 'planlegging'],
            'sparing': ['spare', 'sparing', 'sparekonto', 'bsu', 'høyrentekonto', 'nødfond'],
            'investering': ['investering', 'aksjer', 'fond', 'portefølje', 'avkastning', 'ask'],
            'lån': ['lån', 'gjeld', 'refinansier', 'rente', 'nedbetal', 'kredittkort'],
            'pensjon': ['pensjon', 'ips', 'tjenestepensjon', 'alderspensjon', 'opptjening'],
            'skatt': ['skatt', 'fradrag', 'skattemelding', 'skattefradrag', 'selvangivelse'],
            'boliglån': ['boliglån', 'bolig', 'kjøpe hus', 'egenkapital', 'refinansier boliglån', 'boligkjøp']
        };
        
        const lowerMessage = userMessage.toLowerCase();
        let bestMatch = 'default';
        let maxMatches = 0;
        
        // Find the topic with most keyword matches
        for (const [topic, topicKeywords] of Object.entries(keywords)) {
            const matches = topicKeywords.filter(keyword => lowerMessage.includes(keyword)).length;
            if (matches > maxMatches) {
                maxMatches = matches;
                bestMatch = topic;
            }
        }
        
        return demoResponses[bestMatch];
    }
}
