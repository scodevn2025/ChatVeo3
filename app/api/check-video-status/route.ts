import { NextRequest, NextResponse } from 'next/server';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'gen-lang-client-0022528467';
const MODEL_ID = 'veo-3.0-generate-preview';
const LOCATION_ID = 'us-central1';
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';

export async function POST(req: NextRequest) {
  try {
    const { operationName } = await req.json();

    if (!PROJECT_ID) {
      return NextResponse.json(
        { error: 'Google Cloud Project ID not configured' },
        { status: 500 }
      );
    }

    // Get access token
    const tokenResponse = await fetch('http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token', {
      headers: {
        'Metadata-Flavor': 'Google'
      }
    }).catch(() => null);

    let accessToken = '';
    if (tokenResponse?.ok) {
      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;
    } else {
      if (!process.env.GOOGLE_AI_API_KEY) {
        return NextResponse.json(
          { error: 'Authentication not configured' },
          { status: 500 }
        );
      }
    }

    const statusResponse = await fetch(
      `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/google/models/${MODEL_ID}:fetchPredictOperation`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operationName: operationName
        })
      }
    );

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error('Status check error:', errorText);
      return NextResponse.json(
        { error: 'Failed to check video status' },
        { status: statusResponse.status }
      );
    }

    const statusData = await statusResponse.json();
    
    return NextResponse.json(statusData);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to check video status' },
      { status: 500 }
    );
  }
}