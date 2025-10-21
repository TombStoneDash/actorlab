import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { name, roleType, experience, skills, credits } = await request.json();

    if (!name || !roleType) {
      return NextResponse.json(
        { error: 'Name and role type are required' },
        { status: 400 }
      );
    }

    const prompt = `You are a professional acting career advisor. Generate a polished, industry-standard acting resume and cover letter for:

Name: ${name}
Primary Role Type: ${roleType}
Years of Experience: ${experience || 'Entry level'}
Special Skills: ${skills || 'Not specified'}
Notable Credits: ${credits || 'Building portfolio'}

Format the resume with proper sections (Contact, Union Status, Physical Stats, Training, Credits by category, Special Skills).
Make the cover letter professional, engaging, and tailored for casting directors.
Keep both concise and impactful.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert acting career advisor who creates professional resumes and cover letters for actors.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const output = completion.choices[0].message.content;

    return NextResponse.json({
      success: true,
      content: output,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}
