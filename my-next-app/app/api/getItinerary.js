// pages/api/getItinerary.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();

  const response = await fetch(
    'https://api.cloudflare.com/client/v4/accounts/eca95c4515a39540cafc79d7b2561a25/ai/run/@cf/meta/llama-3-8b-instruct',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch itinerary' }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}