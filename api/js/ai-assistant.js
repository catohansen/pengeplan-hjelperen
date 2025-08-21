/**
 * AI Assistant Module - Long Press Activation
 * Modern design inspired by ANN AI Personal Assistant template
 * Provides AI chat assistance via long press (5 seconds) on any element
 */

class AIAssistant {
    constructor() {
        this.isActive = false;
        this.longPressTimer = null;
        this.longPressDuration = 5000; // 5 seconds
        this.currentElement = null;
        this.chatHistory = [];
        this.isTyping = false;
        this.suggestedTopics = [
            'Hvordan bruker jeg budsjettfunksjonen?',
            'Hvilke støtteordninger kan jeg kvalifisere for?',
            'Hvordan betaler jeg ned gjeld raskest?',
            'Kan du hjelpe meg med økonomisk planlegging?',
            'Hvordan fungerer AI-rådgivningen?'
        ];
        
        this.init();
    }
    
    init() {
        this.createPopup();
        this.setupEventListeners();
        this.loadChatHistory();
    }
    
    createPopup() {
        // Create popup container
        const popup = document.createElement('div');
        popup.id = 'ai-assistant-popup';
        popup.className = 'ai-popup';
        popup.innerHTML = `
            <div class="ai-popup-overlay"></div>
            <div class="ai-popup-container">
                <div class="ai-popup-header">
                    <div class="ai-popup-title">
                        <div class="ai-avatar">
                            <span class="ai-avatar-icon">🤖</span>
                        </div>
                        <div class="ai-title-content">
                            <h3>AI Personlig Assistent</h3>
                            <p>Din økonomiske hjelper</p>
                        </div>
                    </div>
                    <button class="ai-popup-close" onclick="aiAssistant.close()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div class="ai-popup-content">
                    <div class="ai-chat-container" id="aiChatContainer">
                        <div class="ai-welcome-message">
                            <div class="ai-welcome-icon">👋</div>
                            <h4>Hei! Jeg er din AI-assistent</h4>
                            <p>Hvordan kan jeg hjelpe deg i dag?</p>
                        </div>
                        
                        <div class="ai-suggested-topics">
                            <h5>Foreslåtte emner</h5>
                            <div class="ai-topics-grid">
                                ${this.suggestedTopics.map(topic => `
                                    <button class="ai-topic-btn" onclick="aiAssistant.askTopic('${topic}')">
                                        ${topic}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="ai-input-section">
                        <div class="ai-input-container">
                            <div class="ai-input-wrapper">
                                <input type="text" id="aiChatInput" placeholder="Skriv ditt spørsmål..." class="ai-chat-input">
                                <button onclick="aiAssistant.sendMessage()" class="ai-send-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Add styles
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                animation: aiPopupFadeIn 0.3s ease-out;
            }
            
            @keyframes aiPopupFadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            .ai-popup-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
            }
            
            .ai-popup-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 600px;
                height: 80vh;
                background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                border-radius: 24px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid rgba(22, 141, 96, 0.1);
                animation: aiContainerSlideIn 0.4s ease-out;
            }
            
            @keyframes aiContainerSlideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            .ai-popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 32px;
                background: linear-gradient(135deg, #168d60 0%, #22c55e 100%);
                color: white;
                position: relative;
            }
            
            .ai-popup-header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
            }
            
            .ai-popup-title {
                display: flex;
                align-items: center;
                gap: 16px;
            }
            
            .ai-avatar {
                width: 48px;
                height: 48px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .ai-avatar-icon {
                font-size: 24px;
            }
            
            .ai-title-content h3 {
                margin: 0;
                font-size: 20px;
                font-weight: 700;
                line-height: 1.2;
            }
            
            .ai-title-content p {
                margin: 4px 0 0 0;
                font-size: 14px;
                opacity: 0.9;
                font-weight: 400;
            }
            
            .ai-popup-close {
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
            }
            
            .ai-popup-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .ai-popup-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .ai-chat-container {
                flex: 1;
                padding: 24px 32px;
                overflow-y: auto;
                scrollbar-width: thin;
                scrollbar-color: rgba(22, 141, 96, 0.3) transparent;
            }
            
            .ai-chat-container::-webkit-scrollbar {
                width: 6px;
            }
            
            .ai-chat-container::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .ai-chat-container::-webkit-scrollbar-thumb {
                background: rgba(22, 141, 96, 0.3);
                border-radius: 3px;
            }
            
            .ai-welcome-message {
                text-align: center;
                padding: 32px 0;
                margin-bottom: 24px;
            }
            
            .ai-welcome-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            
            .ai-welcome-message h4 {
                margin: 0 0 8px 0;
                font-size: 24px;
                font-weight: 700;
                color: #1a202c;
            }
            
            .ai-welcome-message p {
                margin: 0;
                font-size: 16px;
                color: #64748b;
                line-height: 1.5;
            }
            
            .ai-suggested-topics {
                margin-bottom: 24px;
            }
            
            .ai-suggested-topics h5 {
                margin: 0 0 16px 0;
                font-size: 16px;
                font-weight: 600;
                color: #374151;
            }
            
            .ai-topics-grid {
                display: grid;
                gap: 12px;
            }
            
            .ai-topic-btn {
                background: rgba(22, 141, 96, 0.05);
                border: 1px solid rgba(22, 141, 96, 0.1);
                border-radius: 12px;
                padding: 16px;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s ease;
                font-size: 14px;
                color: #374151;
                line-height: 1.4;
            }
            
            .ai-topic-btn:hover {
                background: rgba(22, 141, 96, 0.1);
                border-color: rgba(22, 141, 96, 0.2);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(22, 141, 96, 0.15);
            }
            
            .ai-message {
                margin-bottom: 20px;
                display: flex;
                flex-direction: column;
                animation: aiMessageSlideIn 0.3s ease-out;
            }
            
            @keyframes aiMessageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .ai-message.user {
                align-items: flex-end;
            }
            
            .ai-message.ai-bot {
                align-items: flex-start;
            }
            
            .ai-message-content {
                padding: 16px 20px;
                border-radius: 18px;
                max-width: 85%;
                word-wrap: break-word;
                font-size: 15px;
                line-height: 1.5;
                position: relative;
            }
            
            .ai-message.user .ai-message-content {
                background: linear-gradient(135deg, #168d60 0%, #22c55e 100%);
                color: white;
                border-bottom-right-radius: 6px;
                box-shadow: 0 4px 12px rgba(22, 141, 96, 0.3);
            }
            
            .ai-message.ai-bot .ai-message-content {
                background: #f8fafc;
                color: #1a202c;
                border: 1px solid #e2e8f0;
                border-bottom-left-radius: 6px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            
            .ai-message-time {
                font-size: 12px;
                color: #94a3b8;
                margin-top: 6px;
                padding: 0 4px;
            }
            
            .ai-input-section {
                padding: 24px 32px;
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
            }
            
            .ai-input-container {
                position: relative;
            }
            
            .ai-input-wrapper {
                display: flex;
                align-items: center;
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 24px;
                padding: 4px;
                transition: all 0.2s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            
            .ai-input-wrapper:focus-within {
                border-color: #168d60;
                box-shadow: 0 4px 16px rgba(22, 141, 96, 0.15);
            }
            
            .ai-chat-input {
                flex: 1;
                padding: 12px 16px;
                border: none;
                outline: none;
                font-size: 15px;
                background: transparent;
                color: #1a202c;
            }
            
            .ai-chat-input::placeholder {
                color: #94a3b8;
            }
            
            .ai-send-btn {
                background: linear-gradient(135deg, #168d60 0%, #22c55e 100%);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                margin-right: 4px;
            }
            
            .ai-send-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(22, 141, 96, 0.3);
            }
            
            .ai-send-btn:active {
                transform: scale(0.95);
            }
            
            .ai-typing-indicator {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 16px 20px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 18px;
                border-bottom-left-radius: 6px;
                max-width: 85%;
                margin-bottom: 20px;
                animation: aiMessageSlideIn 0.3s ease-out;
            }
            
            .ai-typing-dot {
                width: 8px;
                height: 8px;
                background: #168d60;
                border-radius: 50%;
                animation: aiTyping 1.4s infinite ease-in-out;
            }
            
            .ai-typing-dot:nth-child(1) { animation-delay: -0.32s; }
            .ai-typing-dot:nth-child(2) { animation-delay: -0.16s; }
            
            @keyframes aiTyping {
                0%, 80%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            .ai-long-press-hint {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: linear-gradient(135deg, #168d60 0%, #22c55e 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 50px;
                font-size: 13px;
                font-weight: 500;
                z-index: 9999;
                animation: aiHintSlideIn 0.5s ease-out;
                box-shadow: 0 8px 24px rgba(22, 141, 96, 0.3);
                backdrop-filter: blur(10px);
            }
            
            @keyframes aiHintSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @media (max-width: 768px) {
                .ai-popup-container {
                    width: 95%;
                    height: 90vh;
                    border-radius: 20px;
                }
                
                .ai-popup-header {
                    padding: 20px 24px;
                }
                
                .ai-chat-container {
                    padding: 20px 24px;
                }
                
                .ai-input-section {
                    padding: 20px 24px;
                }
                
                .ai-avatar {
                    width: 40px;
                    height: 40px;
                }
                
                .ai-avatar-icon {
                    font-size: 20px;
                }
                
                .ai-title-content h3 {
                    font-size: 18px;
                }
                
                .ai-title-content p {
                    font-size: 13px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // Long press detection
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Touch events for mobile
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        document.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
        
        // Keyboard events for chat input
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.close();
            }
        });
        
        // Close on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('ai-popup-overlay') && this.isActive) {
                this.close();
            }
        });
    }
    
    handleMouseDown(e) {
        if (this.isActive) return;
        
        this.currentElement = e.target;
        this.startLongPressTimer();
    }
    
    handleMouseUp(e) {
        this.clearLongPressTimer();
    }
    
    handleTouchStart(e) {
        if (this.isActive) return;
        
        this.currentElement = e.target;
        this.startLongPressTimer();
    }
    
    handleTouchEnd(e) {
        this.clearLongPressTimer();
    }
    
    startLongPressTimer() {
        this.clearLongPressTimer();
        
        this.longPressTimer = setTimeout(() => {
            this.activate();
        }, this.longPressDuration);
    }
    
    clearLongPressTimer() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }
    
    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        const popup = document.getElementById('ai-assistant-popup');
        popup.style.display = 'block';
        
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('aiChatInput');
            input.focus();
        }, 100);
        
        // Show hint
        this.showHint();
    }
    
    close() {
        this.isActive = false;
        const popup = document.getElementById('ai-assistant-popup');
        popup.style.display = 'none';
        
        // Clear input
        const input = document.getElementById('aiChatInput');
        input.value = '';
        
        // Hide hint
        this.hideHint();
    }
    
    showHint() {
        const hint = document.createElement('div');
        hint.className = 'ai-long-press-hint';
        hint.textContent = '💡 Hold inne en knapp i 5 sekunder for AI-hjelp';
        hint.id = 'aiHint';
        document.body.appendChild(hint);
        
        setTimeout(() => {
            this.hideHint();
        }, 4000);
    }
    
    hideHint() {
        const hint = document.getElementById('aiHint');
        if (hint) {
            hint.remove();
        }
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter' && e.target.id === 'aiChatInput') {
            this.sendMessage();
        }
    }
    
    askTopic(topic) {
        document.getElementById('aiChatInput').value = topic;
        this.sendMessage();
    }
    
    sendMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Hide welcome message and topics after first message
        this.hideWelcomeContent();
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateAIResponse(message);
        }, 1500 + Math.random() * 1000);
    }
    
    hideWelcomeContent() {
        const welcome = document.querySelector('.ai-welcome-message');
        const topics = document.querySelector('.ai-suggested-topics');
        
        if (welcome) {
            welcome.style.display = 'none';
        }
        if (topics) {
            topics.style.display = 'none';
        }
    }
    
    addMessage(content, sender) {
        const container = document.getElementById('aiChatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        
        const time = new Date().toLocaleTimeString('no-NO', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="ai-message-content">${content}</div>
            <div class="ai-message-time">${time}</div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        // Save to history
        this.chatHistory.push({ content, sender, timestamp: new Date() });
        this.saveChatHistory();
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const container = document.getElementById('aiChatContainer');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-typing-indicator';
        typingDiv.id = 'aiTypingIndicator';
        typingDiv.innerHTML = `
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
        `;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('aiTypingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    generateAIResponse(userMessage) {
        const responses = this.getContextualResponses(userMessage);
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(response, 'ai-bot');
    }
    
    getContextualResponses(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Context-aware responses based on current page and user message
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        
        if (message.includes('hjelp') || message.includes('help')) {
            return [
                'Jeg er her for å hjelpe deg! Hva spesifikt trenger du hjelp med?',
                'La meg hjelpe deg. Kan du fortelle meg mer om hva du lurer på?',
                'Jeg kan hjelpe deg med økonomisk rådgivning, navigasjon, eller generelle spørsmål. Hva er det du trenger?'
            ];
        }
        
        if (message.includes('budsjett') || message.includes('budget')) {
            return [
                'For budsjettstyring kan du gå til "Budsjett"-siden i menyen. Der kan du legge til inntekter og utgifter, og se oversikt over din økonomi.',
                'På budsjett-siden kan du registrere alle dine transaksjoner og få en god oversikt over hvor pengene dine går.',
                'Budsjettfunksjonen hjelper deg med å spore inntekter og utgifter. Vil du at jeg skal vise deg hvordan du bruker den?'
            ];
        }
        
        if (message.includes('gjeld') || message.includes('lån')) {
            return [
                'Gjeldssiden viser oversikt over dine lån og gir deg råd om nedbetalingsstrategier som avalanche- eller snowball-metoden.',
                'Du kan finne gjeldsoversikten i hovedmenyen. Der ser du alle dine lån og får AI-rådgivning om nedbetaling.',
                'For gjeldsstyring anbefaler jeg å fokusere på lån med høyest rente først (avalanche-metoden).'
            ];
        }
        
        if (message.includes('støtte') || message.includes('nav')) {
            return [
                'Støtteordninger-siden hjelper deg finne relevante NAV-ordninger du kan kvalifisere for basert på din situasjon.',
                'Du kan søke etter støtteordninger på "Støtteordninger"-siden. Systemet analyserer din profil og foreslår relevante ordninger.',
                'Basert på din profil kan du kvalifisere for flere støtteordninger. Sjekk "Støtteordninger"-siden for detaljer.'
            ];
        }
        
        if (message.includes('ai') || message.includes('rådgivning')) {
            return [
                'AI-rådgiveren kan gi deg personlig økonomisk rådgivning. Gå til "AI-Rådgiver"-siden for å chatte direkte.',
                'Jeg kan hjelpe deg med økonomiske spørsmål. Du kan også bruke den dedikerte AI-rådgiveren på sin egen side.',
                'For detaljert økonomisk rådgivning, besøk "AI-Rådgiver"-siden hvor du kan stille spørsmål og få personlige anbefalinger.'
            ];
        }
        
        if (message.includes('profil') || message.includes('innstillinger')) {
            return [
                'Profil-siden lar deg endre personlig informasjon, abonnement, og innstillinger. Du finner den i toppmenyen.',
                'For å endre profilinformasjon, klikk på "Profil" i toppmenyen. Der kan du også administrere abonnement og varsler.',
                'Profilinnstillingene finner du ved å klikke på "Profil" i toppmenyen. Der kan du oppdatere informasjon og innstillinger.'
            ];
        }
        
        // Default responses
        return [
            'Jeg kan hjelpe deg med økonomisk rådgivning, navigasjon i appen, eller generelle spørsmål. Hva lurer du på?',
            'Basert på din økonomiske situasjon kan jeg gi deg personlige råd. Hva er det du trenger hjelp med?',
            'Jeg er her for å hjelpe deg med alt relatert til økonomi og bruk av Pengeplan. Hva kan jeg hjelpe deg med?',
            'Du kan spørre meg om budsjett, gjeld, støtteordninger, eller generell økonomisk rådgivning. Hva er ditt spørsmål?'
        ];
    }
    
    loadChatHistory() {
        const saved = localStorage.getItem('ai_chat_history');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
        }
    }
    
    saveChatHistory() {
        // Keep only last 50 messages
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(-50);
        }
        localStorage.setItem('ai_chat_history', JSON.stringify(this.chatHistory));
    }
}

// Initialize AI Assistant
let aiAssistant;

document.addEventListener('DOMContentLoaded', function() {
    aiAssistant = new AIAssistant();
});

// Global functions for HTML onclick
window.aiAssistant = {
    sendMessage: () => aiAssistant.sendMessage(),
    close: () => aiAssistant.close(),
    askTopic: (topic) => aiAssistant.askTopic(topic)
};
