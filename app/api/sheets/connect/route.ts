import { NextResponse } from 'next/server';
import { sheetsClient } from '@/lib/sheets/client';

export async function POST() {
  try {
    const authUrl = sheetsClient.getAuthUrl();
    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Sheets connect error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL' },
      { status: 500 }
    );
  }
}
