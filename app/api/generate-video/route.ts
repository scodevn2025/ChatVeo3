import { NextRequest, NextResponse } from 'next/server';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || 'gen-lang-client-0022528467';
const MODEL_ID = 'veo-3.0-generate-preview';
const LOCATION_ID = 'us-central1';
const API_ENDPOINT = 'us-central1-aiplatform.googleapis.com';

export async function POST(req: NextRequest) {
  try {
    const { 
      prompt, 
      duration = 8, 
      sampleCount = 1,
      aspectRatio = '16:9',
      personGeneration = 'allow_all',
      addWatermark = true,
      includeRaiReason = true,
      generateAudio = true
    } = await req.json();

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
      // Fallback to using API key if available
      if (!process.env.GOOGLE_AI_API_KEY) {
        return NextResponse.json(
          { error: 'Authentication not configured' },
          { status: 500 }
        );
      }
    }

    // Start video generation with Veo 3.0 parameters
    const generateResponse = await fetch(
      `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/${LOCATION_ID}/publishers/google/models/${MODEL_ID}:predictLongRunning`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt
            }
          ],
          parameters: {
            aspectRatio: aspectRatio,
            sampleCount: sampleCount.toString(),
            durationSeconds: duration.toString(),
            personGeneration: personGeneration,
            addWatermark: addWatermark,
            includeRaiReason: includeRaiReason,
            generateAudio: generateAudio
          }
        })
      }
    );

    if (!generateResponse.ok) {
      const errorText = await generateResponse.text();
      console.error('Video generation error:', errorText);
      return NextResponse.json(
        { error: 'Failed to start video generation' },
        { status: generateResponse.status }
      );
    }

    const operationData = await generateResponse.json();
    
    return NextResponse.json({
      operationName: operationData.name,
      status: 'started'
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process video generation request' },
      { status: 500 }
    );
  }
}