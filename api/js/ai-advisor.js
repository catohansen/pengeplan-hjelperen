/**
 * 🤖 AI ADVISOR - Enhanced Financial Chat Interface
 * Integrates with user's financial data for personalized advice
 */

class AIAdvisor {
    constructor() {
        this.chatHistory = [];
        this.userData = {};
        this.isTyping = false;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateFinancialOverview();
        this.loadChatHistory();
    }

    loadUserData() {
        // Load user data from localStorage or API
        this.userData = {
            budget: {
                total: 20000,
                used: 15600,
                categories: {
                    'Husleie': 8500,
                    'Mat': 2800,
                    'Transport': 1200,
                    'Underholdning': 1100,
                    'Strøm': 800,
                    'Internett': 400,
                    'Forsikring': 800
                }
            },
            savings: {
                monthly: 4400,
                total: 45230,
                rate: 22,
                goals: {
                    'Nødsparefond': 85,
                    'Ferie': 60,
                    'Bil': 30
                }
            },
            debt: {
                total: 1250000,
                monthly: 12500,
                rate: 3.2,
                breakdown: {
                    'Boliglån': 1100000,
                    'Bil': 150000
                }
            },
            income: {
                monthly: 25000,
                yearly: 300000,
                tax: 5500,
                sources: {
                    'Hovedjobb': 22000,
                    'Sideinntekt': 3000
                }
            }
        };
    }

    setupEventListeners() {
        // Chat input events
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.querySelector('.chat-send-btn');

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            chatInput.addEventListener('input', () => {
                this.updateSendButton();
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Quick question buttons
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const question = e.currentTarget.querySelector('.action-title')?.textContent;
                if (question) {
                    this.askQuestion(question);
                }
            });
        });
    }

    updateSendButton() {
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.querySelector('.chat-send-btn');
        
        if (chatInput && sendBtn) {
            const hasText = chatInput.value.trim().length > 0;
            sendBtn.style.opacity = hasText ? '1' : '0.6';
            sendBtn.style.cursor = hasText ? 'pointer' : 'not-allowed';
        }
    }

    askQuestion(question) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = question;
            this.sendMessage();
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput?.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage('Du', message, 'user-message');
        chatInput.value = '';
        this.updateSendButton();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(message);
            this.addMessage('AI Rådgiver', response, 'ai-message');
        }, 1500 + Math.random() * 1000);
    }

    addMessage(sender, message, type = 'ai-message') {
        const container = document.getElementById('chatContainer');
        if (!container) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        const time = new Date().toLocaleTimeString('no-NO', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const avatar = type === 'user-message' ? '👤' : '🤖';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">${sender}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${message}</div>
            </div>
        `;

        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
        
        // Save to history
        this.chatHistory.push({ sender, message, type, timestamp: new Date() });
        this.saveChatHistory();
    }

    showTypingIndicator() {
        this.isTyping = true;
        const container = document.getElementById('chatContainer');
        if (!container) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-sender">AI Rådgiver</span>
                    <span class="message-time">Skriver...</span>
                </div>
                <div class="message-text">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Context-aware responses based on user's financial data
        if (message.includes('spare') || message.includes('sparing')) {
            return this.getSavingsAdvice();
        }
        
        if (message.includes('budsjett') || message.includes('utgifter')) {
            return this.getBudgetAdvice();
        }
        
        if (message.includes('gjeld') || message.includes('lån')) {
            return this.getDebtAdvice();
        }
        
        if (message.includes('inntekt') || message.includes('lønn')) {
            return this.getIncomeAdvice();
        }
        
        if (message.includes('støtte') || message.includes('nav')) {
            return this.getSupportAdvice();
        }
        
        if (message.includes('analyse') || message.includes('oversikt')) {
            return this.getFinancialAnalysis();
        }
        
        // Default responses
        return this.getGeneralAdvice();
    }

    getSavingsAdvice() {
        const savingsRate = this.userData.savings.rate;
        const monthlySavings = this.userData.savings.monthly;
        
        if (savingsRate >= 20) {
            return `Fantastisk! Du sparer ${savingsRate}% av inntekten din, som er over det anbefalte målet på 15-20%. Med kr ${monthlySavings.toLocaleString()} i månedlig sparing er du på god vei mot dine økonomiske mål. Vurder å øke sparingen ytterligere hvis du har mulighet.`;
        } else if (savingsRate >= 10) {
            return `Du sparer ${savingsRate}% av inntekten din, som er et godt startpunkt. For å nå det anbefalte målet på 15-20%, kan du prøve å øke sparingen med kr ${Math.round((this.userData.income.monthly * 0.15) - monthlySavings).toLocaleString()} i måneden.`;
        } else {
            return `Du sparer for øyeblikket ${savingsRate}% av inntekten din. For å forbedre din økonomiske sikkerhet, anbefaler jeg å øke sparingen til minst 10-15%. Start med små økninger og bygg opp gradvis.`;
        }
    }

    getBudgetAdvice() {
        const budgetUsed = this.userData.budget.used;
        const budgetTotal = this.userData.budget.total;
        const usagePercentage = (budgetUsed / budgetTotal) * 100;
        
        if (usagePercentage <= 80) {
            return `Du har brukt ${usagePercentage.toFixed(0)}% av budsjettet ditt denne måneden, som er veldig bra! Du har kr ${(budgetTotal - budgetUsed).toLocaleString()} igjen. Vurder å sette av overskuddet til sparing eller investering.`;
        } else if (usagePercentage <= 95) {
            return `Du har brukt ${usagePercentage.toFixed(0)}% av budsjettet ditt. Du har kr ${(budgetTotal - budgetUsed).toLocaleString()} igjen. Vær forsiktig med utgiftene resten av måneden.`;
        } else {
            return `Du har brukt ${usagePercentage.toFixed(0)}% av budsjettet ditt. Vurder å gjennomgå utgiftene dine og finn områder hvor du kan kutte ned. Høyeste utgift er husleie med kr ${this.userData.budget.categories['Husleie'].toLocaleString()}.`;
        }
    }

    getDebtAdvice() {
        const totalDebt = this.userData.debt.total;
        const monthlyPayment = this.userData.debt.monthly;
        const debtToIncomeRatio = (monthlyPayment / this.userData.income.monthly) * 100;
        
        if (debtToIncomeRatio <= 30) {
            return `Din gjeldsbelastning er ${debtToIncomeRatio.toFixed(0)}% av inntekten, som er innenfor anbefalte grenser. Med en rente på ${this.userData.debt.rate}% har du gunstige lånevilkår. Fokus på å betale ned høyest rente først.`;
        } else if (debtToIncomeRatio <= 50) {
            return `Din gjeldsbelastning er ${debtToIncomeRatio.toFixed(0)}% av inntekten, som er høyere enn anbefalt. Vurder å refinansiere lån eller øke inntekten for å redusere belastningen.`;
        } else {
            return `Din gjeldsbelastning er ${debtToIncomeRatio.toFixed(0)}% av inntekten, som er betydelig høy. Anbefaler å konsultere en økonomisk rådgiver for å lage en nedbetalingsplan.`;
        }
    }

    getIncomeAdvice() {
        const monthlyIncome = this.userData.income.monthly;
        const taxRate = (this.userData.income.tax / monthlyIncome) * 100;
        
        return `Du har en månedlig inntekt på kr ${monthlyIncome.toLocaleString()} med en skattebelastning på ${taxRate.toFixed(0)}%. Dette er en solid inntekt. Vurder å diversifisere inntektskildene dine ytterligere for å øke økonomisk sikkerhet.`;
    }

    getSupportAdvice() {
        const income = this.userData.income.yearly;
        
        if (income < 300000) {
            return `Basert på din årlige inntekt på kr ${income.toLocaleString()} kan du kvalifisere for flere støtteordninger. Sjekk NAV's nettside for barnetrygd, husbanklån, og andre relevante ordninger.`;
        } else {
            return `Med din årlige inntekt på kr ${income.toLocaleString()} kan du kvalifisere for begrenset støtte. Fokus på å optimalisere skatten og utnytte alle tilgjengelige fradrag.`;
        }
    }

    getFinancialAnalysis() {
        const savingsRate = this.userData.savings.rate;
        const debtToIncome = (this.userData.debt.monthly / this.userData.income.monthly) * 100;
        const budgetUsage = (this.userData.budget.used / this.userData.budget.total) * 100;
        
        return `Din økonomiske helse er ${this.getFinancialHealthScore()} av 10. Du sparer ${savingsRate}% av inntekten, har ${debtToIncome.toFixed(0)}% gjeldsbelastning, og bruker ${budgetUsage.toFixed(0)}% av budsjettet. Anbefalinger: ${this.getRecommendations()}`;
    }

    getFinancialHealthScore() {
        let score = 7; // Base score
        
        // Adjust based on savings rate
        if (this.userData.savings.rate >= 20) score += 2;
        else if (this.userData.savings.rate >= 10) score += 1;
        else score -= 1;
        
        // Adjust based on debt-to-income ratio
        const debtRatio = (this.userData.debt.monthly / this.userData.income.monthly) * 100;
        if (debtRatio <= 30) score += 1;
        else if (debtRatio > 50) score -= 2;
        
        // Adjust based on budget usage
        const budgetUsage = (this.userData.budget.used / this.userData.budget.total) * 100;
        if (budgetUsage <= 80) score += 1;
        else if (budgetUsage > 95) score -= 1;
        
        return Math.max(1, Math.min(10, score));
    }

    getRecommendations() {
        const recommendations = [];
        
        if (this.userData.savings.rate < 15) {
            recommendations.push('Øk sparingen til minst 15% av inntekten');
        }
        
        const debtRatio = (this.userData.debt.monthly / this.userData.income.monthly) * 100;
        if (debtRatio > 40) {
            recommendations.push('Reduser gjeldsbelastningen');
        }
        
        const budgetUsage = (this.userData.budget.used / this.userData.budget.total) * 100;
        if (budgetUsage > 90) {
            recommendations.push('Gjennomgå og reduser utgifter');
        }
        
        return recommendations.length > 0 ? recommendations.join(', ') : 'Fortsett som før - du gjør det bra!';
    }

    getGeneralAdvice() {
        const responses = [
            'Basert på din økonomiske oversikt kan jeg gi deg personlig rådgivning. Hva spesifikt lurer du på?',
            'Jeg ser på dine økonomiske data og kan hjelpe deg med å optimalisere din økonomiske strategi. Hva vil du fokusere på?',
            'Med din sparerate på 22% og solid økonomisk base har du et godt utgangspunkt. Hva kan jeg hjelpe deg med?',
            'Jeg har analysert din økonomi og kan gi deg spesifikke anbefalinger. Hva er ditt hovedmål?'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    updateFinancialOverview() {
        // Update budget progress
        const budgetProgress = (this.userData.budget.used / this.userData.budget.total) * 100;
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${budgetProgress}%`;
        }

        // Update budget stats
        const budgetUsed = document.querySelector('.budget-used');
        const budgetTotal = document.querySelector('.budget-total');
        if (budgetUsed) budgetUsed.textContent = `kr ${this.userData.budget.used.toLocaleString()}`;
        if (budgetTotal) budgetTotal.textContent = `av kr ${this.userData.budget.total.toLocaleString()}`;

        // Update savings stats
        const savingsAmounts = document.querySelectorAll('.savings-amount');
        if (savingsAmounts.length >= 3) {
            savingsAmounts[0].textContent = `kr ${this.userData.savings.monthly.toLocaleString()}`;
            savingsAmounts[1].textContent = `kr ${this.userData.savings.total.toLocaleString()}`;
            savingsAmounts[2].textContent = `${this.userData.savings.rate}%`;
        }

        // Update debt stats
        const debtAmounts = document.querySelectorAll('.debt-amount');
        if (debtAmounts.length >= 3) {
            debtAmounts[0].textContent = `kr ${this.userData.debt.total.toLocaleString()}`;
            debtAmounts[1].textContent = `kr ${this.userData.debt.monthly.toLocaleString()}`;
            debtAmounts[2].textContent = `${this.userData.debt.rate}%`;
        }

        // Update income stats
        const incomeAmounts = document.querySelectorAll('.income-amount');
        if (incomeAmounts.length >= 3) {
            incomeAmounts[0].textContent = `kr ${this.userData.income.monthly.toLocaleString()}`;
            incomeAmounts[1].textContent = `kr ${this.userData.income.yearly.toLocaleString()}`;
            incomeAmounts[2].textContent = `kr ${this.userData.income.tax.toLocaleString()}`;
        }
    }

    loadChatHistory() {
        const saved = localStorage.getItem('ai_advisor_chat_history');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
        }
    }

    saveChatHistory() {
        // Keep only last 50 messages
        if (this.chatHistory.length > 50) {
            this.chatHistory = this.chatHistory.slice(-50);
        }
        localStorage.setItem('ai_advisor_chat_history', JSON.stringify(this.chatHistory));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiAdvisor = new AIAdvisor();
});

// Global functions for HTML onclick
window.askQuestion = (question) => {
    if (window.aiAdvisor) {
        window.aiAdvisor.askQuestion(question);
    }
};

window.sendMessage = () => {
    if (window.aiAdvisor) {
        window.aiAdvisor.sendMessage();
    }
};
