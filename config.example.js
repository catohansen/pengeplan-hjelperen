// Configuration file for ChatGPT 5 integration
// Rename this file to config.js and add your OpenAI API key

const CONFIG = {
    // Get your API key from: https://platform.openai.com/api-keys
    OPENAI_API_KEY: '', // Add your sk-... key here
    
    // API settings
    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    MODEL: 'gpt-4', // Will be updated to 'gpt-5' when available
    MAX_TOKENS: 600,
    TEMPERATURE: 0.7,
    
    // Chat settings
    DEMO_MODE: true, // Set to false when you have a valid API key
    
    // Norwegian financial focus areas
    FOCUS_AREAS: [
        'Budsjettplanlegging og økonomisk oversikt',
        'Sparestrategier og bankprodukter (BSU, høyrentekonto, etc.)',
        'Investeringsråd (aksjer, fond, eiendom) tilpasset norske forhold',
        'Gjeldshåndtering og refinansiering',
        'Pensjonssparing (tjenestepensjon, IPS, etc.)',
        'Norske skatteregler, fradrag og skatteoptimalisering',
        'Boliglån og boligkjøp i Norge'
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
