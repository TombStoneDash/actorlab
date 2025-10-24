import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Initialize OpenAI client at runtime, not build time
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { reelDescription, scenes, duration, targetRoles } = await request.json();

    if (!reelDescription) {
      return NextResponse.json(
        { error: 'Demo reel description is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional casting director and acting coach. Analyze this actor's demo reel and provide constructive feedback:

Demo Reel Description: ${reelDescription}
${scenes ? `Scenes Included: ${scenes}` : ''}
${duration ? `Duration: ${duration}` : ''}
${targetRoles ? `Target Roles: ${targetRoles}` : ''}

Provide feedback on:
1. Overall impression and marketability
2. Scene selection and variety
3. Performance quality and range
4. Technical aspects (sound, editing, clarity)
5. Specific strengths to highlight
6. Areas for improvement
7. Recommendations for castability

Be honest but constructive, focusing on actionable advice.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced casting director who provides valuable, honest feedback on actor demo reels.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      analysis: analysis,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze demo reel' },
      { status: 500 }
    );
  }
}
