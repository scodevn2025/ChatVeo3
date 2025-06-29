const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

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

    // Initialize the Google AI with your API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

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

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig,
      safetySettings
    });

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ content: text }),
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