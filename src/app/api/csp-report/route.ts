import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Log the incoming CSP report. In production you may want to write this to
    // a persistent store or integrate with a logging/alerting system.
    // Keep logs concise but include the full payload for triage.
    console.info('[CSP REPORT]', JSON.stringify(body));
  } catch (err) {
    console.warn('[CSP REPORT] failed to parse body', err);
  }

  // Respond with 204 No Content as required for CSP report receivers
  return new NextResponse(null, { status: 204 });
}

