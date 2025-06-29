const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, history } = JSON.parse(event.body);

    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'your_google_ai_api_key_here') {
      console.error('Google AI API key not configured properly');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Google AI API key not configured. Please set GOOGLE_AI_API_KEY in Netlify environment variables.',
          details: 'Visit https://aistudio.google.com/app/apikey to get your API key'
        }),
      };
    }

    // Initialize the new Google GenAI client
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    });

    // Configuration with thinking capabilities
    const config = {
      thinkingConfig: {
        thinkingBudget: -1, // Unlimited thinking budget
      },
      responseMimeType: 'text/plain',
      maxOutputTokens: 65535,
      temperature: 1,
      topP: 1,
    };

    // Build conversation history for context
    const conversationHistory = history
      .slice(-10) // Keep last 10 messages for context
      .map((msg) => ({
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

    // Prepare contents array with system prompt and conversation history
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'CYBERMIND AI initialized. Neural networks online. Ready to assist you in navigating the digital realm.' }]
      },
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    // Generate response using the new API
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-pro',
      config,
      contents,
    });

    let fullResponse = '';
    for await (const chunk of response) {
      if (chunk.text) {
        fullResponse += chunk.text;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: fullResponse }),
    };

  } catch (error) {
    console.error('API Error:', error);
    
    // Handle specific error types
    let errorMessage = 'Failed to process request';
    let statusCode = 500;
    
    if (error.message && error.message.includes('API key')) {
      errorMessage = 'Invalid API key configuration';
      statusCode = 401;
    } else if (error.message && error.message.includes('quota')) {
      errorMessage = 'API quota exceeded';
      statusCode = 429;
    } else if (error.message && error.message.includes('model')) {
      errorMessage = 'Model not available or invalid';
      statusCode = 400;
    }
    
    return {
      statusCode,
      headers,
      body: JSON.stringify({
        error: errorMessage,
        details: error.message || 'Unknown error occurred'
      }),
    };
  }
};