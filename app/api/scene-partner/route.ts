import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Simple in-memory cache for scene context (lasts for request lifecycle)
const contextCache = new Map<string, string>();

export async function POST(request: NextRequest) {
  try {
    // Initialize OpenAI client at runtime, not build time
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { script, characterName, partnerCharacter, context, userLine, genre } = await request.json();

    if (!userLine) {
      return NextResponse.json(
        { error: 'User line is required' },
        { status: 400 }
      );
    }

    // Optimized system prompt - shorter, more focused
    const systemPrompt = `You're ${partnerCharacter || 'the scene partner'} in a ${genre || 'dramatic'} scene.
${context ? `Context: ${context}` : ''}
Stay in character. Reply naturally in 1-2 sentences max. Match the emotional tone.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Faster and cheaper than GPT-4 for scene practice
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userLine,
        },
      ],
      max_tokens: 100, // Reduced from 200 for faster responses
      temperature: 0.9, // Slightly higher for more natural variety
      stream: false,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      response: response,
      character: partnerCharacter || 'Partner',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate scene response' },
      { status: 500 }
    );
  }
}
