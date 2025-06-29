import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize the Google AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

const generationConfig = {
  maxOutputTokens: 65535,
  temperature: 1,
  topP: 1,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  }
];

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('Google AI API key not found in environment variables');
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
      generationConfig,
      safetySettings
    });

    // Build conversation history for context
    const conversationHistory = history
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

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
        ...conversationHistory
      ]
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ content: text });

  } catch (error) {
    console.error('API Error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to process request';
    let errorDetails = 'Unknown error occurred';
    
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Check for specific API key related errors
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('invalid API key')) {
        errorMessage = 'Invalid Google AI API key';
        errorDetails = 'Please check your GOOGLE_AI_API_KEY in .env.local file';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API quota exceeded';
        errorDetails = 'Please check your Google AI API usage limits';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}