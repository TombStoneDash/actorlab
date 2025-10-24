import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { beat, lastLine, currentLine } = await request.json();

    if (!currentLine) {
      return NextResponse.json(
        { error: 'Current line is required' },
        { status: 400 }
      );
    }

    // Optimized prompt for coaching - max 30 words
    const prompt = `You are an expert acting coach. Give one short, actionable note (max 30 words) for the next line in a scene labeled "${beat || 'dramatic'}". ${lastLine ? `Last actor line: "${lastLine}".` : ''} Current line: "${currentLine}". Focus on intention, tempo, and emotional truth. No fluff.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional acting coach who gives concise, actionable direction.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 60,
      temperature: 0.5,
    });

    const note = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      note: note,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate coaching note' },
      { status: 500 }
    );
  }
}
