import { NextRequest, NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/sheets/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    await sheetsClient.handleCallback(code);
    return NextResponse.redirect(new URL('/?sheets=connected', request.url));
  } catch (error) {
    console.error('Sheets callback error:', error);
    return NextResponse.redirect(new URL('/?error=sheets_failed', request.url));
  }
}
