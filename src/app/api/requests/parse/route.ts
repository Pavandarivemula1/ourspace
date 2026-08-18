import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalLanguageRequest } from '@/services/parser/requestParser';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text query is required' }, { status: 400 });
    }

    const parsed = parseNaturalLanguageRequest(text);

    return NextResponse.json({
      success: true,
      parsed,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
