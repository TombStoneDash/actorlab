import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Initialize OpenAI client at runtime, not build time
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { recipientName, recipientRole, context, purpose, tone } = await request.json();

    if (!recipientName || !purpose) {
      return NextResponse.json(
        { error: 'Recipient name and purpose are required' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional networking consultant for actors. Draft a professional ${purpose} message to:

Recipient: ${recipientName}
${recipientRole ? `Role: ${recipientRole}` : ''}
Context: ${context || 'Professional introduction'}
Tone: ${tone || 'Professional and friendly'}

The message should be:
- Brief and respectful of their time (3-4 sentences)
- Professional yet personable
- Clear about your purpose
- Include a specific call to action
- Appropriate for ${purpose}

Do not include a subject line, just the body of the message.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in professional networking and communication for the entertainment industry.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const message = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      message: message,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate message' },
      { status: 500 }
    );
  }
}
