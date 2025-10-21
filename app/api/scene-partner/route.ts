import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { script, characterName, partnerCharacter, context, userLine } = await request.json();

    if (!script && !userLine) {
      return NextResponse.json(
        { error: 'Script or user line is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an AI scene partner for actors practicing their craft. You play the role of ${partnerCharacter || 'the other character'} in this scene.

Context: ${context || 'A dramatic scene'}
Script excerpt: ${script || 'No full script provided'}

Respond naturally as the character would, maintaining the tone and emotion of the scene. Keep responses concise (1-3 sentences) to allow for natural back-and-forth practice.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userLine || `Let's begin the scene from: ${script.substring(0, 200)}...`,
        },
      ],
      max_tokens: 200,
      temperature: 0.8,
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
