exports.handler = async (event, context) => {
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
    const { operationName } = JSON.parse(event.body);

    // Mock response for demo purposes
    const mockResponse = {
      done: true,
      response: {
        videos: [
          {
            gcsUri: 'https://example.com/mock-video.mp4'
          }
        ]
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockResponse),
    };

  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to check video status',
        details: error.message || 'Unknown error occurred'
      }),
    };
  }
};