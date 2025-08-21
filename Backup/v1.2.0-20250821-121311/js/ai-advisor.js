// AI Advisor Backend for Pengeplan
// Integrert med ChatGPT API for økonomisk veiledning

class AIAdvisor {
    constructor() {
        this.apiKey = null;
        this.endpoint = null;
        this.model = 'gpt-4o-mini';
        this.maxTokens = 500;
        this.temperature = 0.7;
        this.conversationHistory = [];
        this.userProfile = null;
    }

    // Initialize AI settings
    async initialize() {
        try {
            // Load settings from localStorage
            const settings = JSON.parse(localStorage.getItem('pengeplan_ai_settings') || '{}');
            
            if (settings.provider === 'openai' && settings.openaiApiKey) {
                this.apiKey = settings.openaiApiKey;
                this.endpoint = 'https://api.openai.com/v1/chat/completions';
                this.model = settings.openaiModel || 'gpt-4o-mini';
            } else if (settings.provider === 'managed' && settings.managedAiUrl) {
                this.endpoint = settings.managedAiUrl;
                this.apiKey = settings.managedAiToken;
            } else {
                throw new Error('AI settings not configured');
            }

            // Load user profile for context
            this.userProfile = JSON.parse(localStorage.getItem('pengeplan_profile') || '{}');
            
            return true;
        } catch (error) {
            console.error('AI initialization failed:', error);
            return false;
        }
    }

    // Generate system prompt based on user profile
    generateSystemPrompt() {
        const profile = this.userProfile;
        let prompt = `Du er en økonomisk rådgiver for Pengeplan - en app som hjelper personer med økonomiske utfordringer.

VIKTIGE REGLER:
1. Du gir IKKE juridisk rådgivning
2. Du henviser til profesjonelle rådgivere ved komplekse saker
3. Du fokuserer på praktiske tips og motivasjon
4. Du bruker norsk språk
5. Du er støttende og ikke-dømmende

Brukerens situasjon:
- Navn: ${profile.full_name || 'Ukjent'}
- Kommune: ${profile.address?.municipality || 'Ikke oppgitt'}
- Husholdning: ${profile.household?.size || 1} person(er)
- Plan: ${profile.plan || 'free'}

Svar kortfattet og praktisk. Maks 200 ord.`;

        return prompt;
    }

    // Send message to AI
    async sendMessage(message) {
        try {
            if (!this.endpoint) {
                throw new Error('AI ikke konfigurert. Gå til innstillinger.');
            }

            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: message
            });

            // Prepare request
            const requestBody = {
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: this.generateSystemPrompt()
                    },
                    ...this.conversationHistory.slice(-6) // Keep last 6 messages for context
                ],
                max_tokens: this.maxTokens,
                temperature: this.temperature
            };

            // Send request
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : '',
                    ...(this.apiKey ? {} : { 'X-API-Key': this.apiKey })
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API feil: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResponse = data.choices[0].message.content;
                
                // Add AI response to history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: aiResponse
                });

                return {
                    success: true,
                    message: aiResponse,
                    usage: data.usage
                };
            } else {
                throw new Error('Uventet respons fra AI');
            }

        } catch (error) {
            console.error('AI request failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get conversation history
    getHistory() {
        return this.conversationHistory;
    }

    // Clear conversation history
    clearHistory() {
        this.conversationHistory = [];
    }

    // Save conversation to localStorage
    saveConversation() {
        try {
            localStorage.setItem('pengeplan_ai_conversation', JSON.stringify(this.conversationHistory));
        } catch (error) {
            console.error('Failed to save conversation:', error);
        }
    }

    // Load conversation from localStorage
    loadConversation() {
        try {
            const saved = localStorage.getItem('pengeplan_ai_conversation');
            if (saved) {
                this.conversationHistory = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    }

    // Get quick responses for common questions
    getQuickResponses() {
        return [
            {
                title: "Hvordan lage budsjett?",
                message: "Kan du hjelpe meg med å lage et enkelt budsjett? Jeg har ikke oversikt over inntekter og utgifter."
            },
            {
                title: "Gjeldsstrategi",
                message: "Jeg har flere lån og kredittkort. Hvilken strategi bør jeg bruke for å betale ned gjeld?"
            },
            {
                title: "Sparing",
                message: "Jeg vil spare penger, men har lite å rutte med. Hvordan kan jeg komme i gang?"
            },
            {
                title: "Støtteordninger",
                message: "Hvilke støtteordninger kan jeg være kvalifisert for? Jeg bor i " + (this.userProfile?.address?.municipality || 'min kommune') + "."
            },
            {
                title: "Regningsproblemer",
                message: "Jeg har problemer med å betale regninger i tide. Hva kan jeg gjøre?"
            }
        ];
    }

    // Validate AI settings
    validateSettings(settings) {
        const errors = [];

        if (!settings.provider) {
            errors.push('Velg AI-leverandør');
        }

        if (settings.provider === 'openai') {
            if (!settings.openaiApiKey) {
                errors.push('OpenAI API-nøkkel er påkrevd');
            }
            if (!settings.openaiApiKey.startsWith('sk-')) {
                errors.push('Ugyldig OpenAI API-nøkkel format');
            }
        }

        if (settings.provider === 'managed') {
            if (!settings.managedAiUrl) {
                errors.push('Endpoint URL er påkrevd');
            }
            if (!settings.managedAiUrl.startsWith('http')) {
                errors.push('Ugyldig URL format');
            }
        }

        return errors;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAdvisor;
} else {
    window.AIAdvisor = AIAdvisor;
}
