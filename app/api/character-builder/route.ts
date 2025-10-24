import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Initialize OpenAI client at runtime, not build time
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { characterName, script, context, analysis } = await request.json();

    if (!characterName) {
      return NextResponse.json(
        { error: 'Character name is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional acting coach specializing in character development. Create a comprehensive character analysis for:

Character: ${characterName}
${script ? `Script Context: ${script}` : ''}
${context ? `Additional Context: ${context}` : ''}

Provide a deep character breakdown including:
1. Character's objective and motivation
2. Backstory and relationships
3. Emotional arc
4. Physical characteristics and mannerisms
5. Key acting choices and moments
6. Subtext analysis

Be specific, actionable, and focused on helping the actor embody this character.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert acting coach with deep knowledge of character development and method acting.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const characterAnalysis = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      analysis: characterAnalysis,
      character: characterName,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate character analysis' },
      { status: 500 }
    );
  }
}
