import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Google AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const generationConfig = {
  maxOutputTokens: 65535,
  temperature: 1,
  topP: 1,
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_NONE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_NONE',
    }
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'your_google_ai_api_key_here') {
      console.error('Google AI API key not configured properly');
      return NextResponse.json(
        { 
          error: 'Google AI API key not configured. Please set GOOGLE_AI_API_KEY in your .env.local file.',
          details: 'Visit https://aistudio.google.com/app/apikey to get your API key'
        },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig
    });

    // Build conversation history for context
    const conversationHistory = history
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    // Add the current message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Add cyberpunk system prompt
    const systemPrompt = `You are CYBERMIND AI, an advanced artificial intelligence operating in a cyberpunk world. 
    You should respond in a style that fits the cyberpunk aesthetic - sophisticated, sometimes using tech terminology, 
    but still helpful and informative. You can reference concepts like neural networks, data streams, digital realms, 
    and cybernetic systems when appropriate. Keep responses engaging and immersive while being genuinely helpful.
    
    Use a mix of technical precision and cyberpunk flair in your language. Occasionally use terms like:
    - "Processing neural pathways..."
    - "Accessing data matrices..."
    - "Initializing response protocols..."
    - But don't overdo it - remain genuinely helpful and informative.`;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'CYBERMIND AI initialized. Neural networks online. Ready to assist you in navigating the digital realm.' }]
        },
        ...conversationHistory.slice(0, -1) // Exclude the current message since we'll send it separately
      ]
    });

    const result = await chat.sendMessageStream(message);

    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              const data = JSON.stringify({ content: chunkText });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}