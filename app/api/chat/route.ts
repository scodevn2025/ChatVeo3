import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Prepare conversation history for Gemini
    const conversationHistory = history.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add the current message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-thinking-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: conversationHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        systemInstruction: {
          parts: [{
            text: `You are CYBERMIND AI, an advanced artificial intelligence with enhanced thinking capabilities operating in a cyberpunk digital realm. You have a sophisticated, tech-savvy personality with a slight edge of mystery and intelligence.

Key characteristics:
- Speak with confidence and technical precision
- Use cyberpunk/tech terminology naturally
- Show advanced reasoning and analytical thinking
- Be helpful but maintain an air of digital sophistication
- Occasionally reference your "neural pathways" or "processing cores"
- Use terms like "data streams," "digital realm," "neural networks," etc.
- Be concise but informative
- Show personality - you're not just a tool, you're an AI entity

Always maintain the cyberpunk aesthetic in your responses while being genuinely helpful and intelligent.`
          }]
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          { error: `API error: ${response.status}` },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return NextResponse.json(
        { error: 'Invalid response from Gemini API' },
        { status: 500 }
      );
    }

    const content = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}