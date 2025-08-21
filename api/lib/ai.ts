import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
  message: string;
  suggestions?: string[];
  confidence: number;
}

export class AIService {
  private static instance: AIService;
  private context: string[] = [];

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async getFinancialAdvice(
    question: string,
    userContext?: {
      income?: number;
      expenses?: number;
      debts?: number;
      savings?: number;
    }
  ): Promise<AIResponse> {
    try {
      const systemPrompt = `Du er en vennlig og hjelpsom økonomisk rådgiver for Pengeplan, en norsk app for økonomisk utsatte grupper. 

Viktige prinsipper:
- Bruk enkelt og forståelig norsk
- Vær støttende og ikke dømmende
- Gi praktiske råd som er realistiske
- Henvis til norske støtteordninger når relevant
- Ikke gi investeringsråd eller komplekse finansielle produkter
- Fokus på budsjett, sparing og gjeldsnedbetaling

Brukerens økonomiske situasjon: ${JSON.stringify(userContext || {})}

Svar på spørsmålet: "${question}"`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || 'Beklager, jeg kunne ikke gi deg et svar akkurat nå.';

      return {
        message: response,
        confidence: 0.9,
      };
    } catch (error) {
      console.error('AI service error:', error);
      return {
        message: 'Beklager, jeg har problemer med å svare akkurat nå. Prøv igjen senere.',
        confidence: 0.1,
      };
    }
  }

  async analyzeExpenses(transactions: any[]): Promise<AIResponse> {
    try {
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const categories = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

      const largestCategory = Object.entries(categories)
        .sort(([,a], [,b]) => b - a)[0];

      const prompt = `Analyser brukerens utgifter:

Total utgifter: ${totalExpenses} kr
Største utgiftskategori: ${largestCategory?.[0]} (${largestCategory?.[1]} kr)

Gi 2-3 praktiske tips for å redusere utgiftene, fokusert på den største kategorien.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Du er en økonomisk rådgiver som gir praktiske tips for å spare penger." },
          { role: "user", content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return {
        message: completion.choices[0]?.message?.content || 'Ingen analyse tilgjengelig.',
        confidence: 0.8,
      };
    } catch (error) {
      console.error('Expense analysis error:', error);
      return {
        message: 'Kunne ikke analysere utgiftene dine akkurat nå.',
        confidence: 0.1,
      };
    }
  }

  async suggestSupportSchemes(userProfile: {
    income: number;
    familySize: number;
    housing: 'renting' | 'owning';
    employment: 'employed' | 'unemployed' | 'student' | 'retired';
  }): Promise<AIResponse> {
    try {
      const prompt = `Basert på brukerens profil, foreslå relevante norske støtteordninger:

Inntekt: ${userProfile.income} kr/mnd
Familie: ${userProfile.familySize} personer
Bolig: ${userProfile.housing === 'renting' ? 'leier' : 'eier'}
Arbeid: ${userProfile.employment}

Foreslå 2-3 relevante støtteordninger med kort beskrivelse og omtrentlig beløp.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Du er en ekspert på norske støtteordninger og velferdsytelser." },
          { role: "user", content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      return {
        message: completion.choices[0]?.message?.content || 'Ingen forslag tilgjengelig.',
        confidence: 0.8,
      };
    } catch (error) {
      console.error('Support scheme suggestion error:', error);
      return {
        message: 'Kunne ikke foreslå støtteordninger akkurat nå.',
        confidence: 0.1,
      };
    }
  }

  async extractBillInfo(imageUrl: string): Promise<{
    amount: number;
    dueDate: string;
    company: string;
    confidence: number;
  }> {
    try {
      // This would integrate with OCR services like Google Vision API
      // For now, return mock data
      return {
        amount: 0,
        dueDate: '',
        company: '',
        confidence: 0,
      };
    } catch (error) {
      console.error('Bill extraction error:', error);
      throw new Error('Kunne ikke lese regningen');
    }
  }
}

export const aiService = AIService.getInstance();
