import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Add this line to specify Edge Runtime

export async function GET() {
  return NextResponse.json({ message: "GET request received" });
}

export async function POST(req) {
  const body = await req.json();

  // Ensure the API token is available
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!apiToken) {
    console.error('CLOUDFLARE_API_TOKEN is not set');
    return NextResponse.json({ error: 'API token is not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(
      'https://gateway.ai.cloudflare.com/v1/eca95c4515a39540cafc79d7b2561a25/1/workers-ai/@cf/meta/llama-3.1-8b-instruct',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudflare API error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in getItinerary:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
