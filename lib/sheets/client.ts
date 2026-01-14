import { google } from 'googleapis';
import type { ScrapedItem } from '../scraper/types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export class SheetsClient {
  private static instance: SheetsClient;
  private auth: any = null;
  private spreadsheetId: string | null = null;

  static getInstance(): SheetsClient {
    if (!this.instance) {
      this.instance = new SheetsClient();
    }
    return this.instance;
  }

  getAuthUrl(): string {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/sheets/callback'
    );

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  }

  async handleCallback(code: string): Promise<void> {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/sheets/callback'
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    this.auth = oauth2Client;

    // Create or find sheet
    await this.ensureSheet();
  }

  private async ensureSheet(): Promise<void> {
    if (!this.auth) throw new Error('Not authenticated');

    const sheets = google.sheets({ version: 'v4', auth: this.auth });

    try {
      // Create new spreadsheet
      const response = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: 'Ithena Scraper Output',
          },
          sheets: [
            {
              properties: {
                title: 'Sheet1',
              },
            },
          ],
        },
      });

      this.spreadsheetId = response.data.spreadsheetId!;

      // Add headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A1:B1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Exhibitor Name', 'Booth #']],
        },
      });

      console.log(`[Sheets] Created spreadsheet: ${this.spreadsheetId}`);
    } catch (error) {
      console.error('[Sheets] Error creating sheet:', error);
      throw error;
    }
  }

  async appendRow(item: ScrapedItem): Promise<void> {
    if (!this.auth || !this.spreadsheetId) {
      console.warn('[Sheets] Not connected, skipping append');
      return;
    }

    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Sheet1!A:B',
        valueInputOption: 'RAW',
        requestBody: {
          values: [[item.exhibitor, item.booth]],
        },
      });
    } catch (error) {
      console.error('[Sheets] Error appending row:', error);
    }
  }

  isConnected(): boolean {
    return this.auth !== null && this.spreadsheetId !== null;
  }

  getSpreadsheetId(): string | null {
    return this.spreadsheetId;
  }
}

export const sheetsClient = SheetsClient.getInstance();
