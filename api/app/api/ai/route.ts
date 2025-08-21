import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userContext } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const response = await aiService.getFinancialAdvice(message, userContext);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Kunne ikke behandle forespørselen. Prøv igjen senere.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'AI Advisor API is running',
    version: '1.0.0',
  });
}
