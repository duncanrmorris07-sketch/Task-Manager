import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

// Google OAuth Configuration
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_CLIENT_ID';
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // For desktop app

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
  status: string;
}

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;
  private calendar: any;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  /**
   * Get the OAuth authorization URL
   */
  getAuthUrl(): string {
    try {
      const authUrl = this.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
      });
      return authUrl;
    } catch (error) {
      console.error('Error generating auth URL:', error);
      return '';
    }
  }

  /**
   * Handle the authorization code from Google OAuth
   */
  async handleAuthCode(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      this.accessToken = tokens.access_token || null;
      this.refreshToken = tokens.refresh_token || null;

      return {
        accessToken: this.accessToken || '',
        refreshToken: this.refreshToken || '',
      };
    } catch (error) {
      console.error('Error handling auth code:', error);
      throw error;
    }
  }

  /**
   * Initialize calendar service with stored tokens
   */
  async initializeFromStorage(accessToken: string, refreshToken: string): Promise<boolean> {
    try {
      this.oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      return true;
    } catch (error) {
      console.error('Error initializing from storage:', error);
      return false;
    }
  }

  /**
   * Create a calendar event from a task
   */
  async createTaskEvent(task: any): Promise<string | null> {
    if (!this.accessToken) {
      console.error('Not authenticated with Google Calendar');
      return null;
    }

    try {
      const event = {
        summary: task.title,
        description: task.description || '',
        start: { dateTime: new Date(task.createdAt).toISOString() },
        end: { dateTime: new Date(Date.now() + 3600000).toISOString() }, // 1 hour duration
        status: 'confirmed',
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.data.id || null;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  }

  /**
   * Update a calendar event with task status
   */
  async updateTaskEvent(eventId: string, task: any): Promise<boolean> {
    if (!this.accessToken) {
      console.error('Not authenticated with Google Calendar');
      return false;
    }

    try {
      const event = {
        summary: task.title,
        description: `${task.description || ''}\n\nStatus: ${task.status}`,
        start: { dateTime: new Date(task.createdAt).toISOString() },
        end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
        status: task.status === 'completed' ? 'completed' : 'confirmed',
      };

      await this.calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: event,
      });

      return true;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return false;
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteTaskEvent(eventId: string): Promise<boolean> {
    if (!this.accessToken) {
      console.error('Not authenticated with Google Calendar');
      return false;
    }

    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }

  /**
   * Get upcoming calendar events
   */
  async getUpcomingEvents(): Promise<CalendarEvent[]> {
    if (!this.accessToken) {
      console.error('Not authenticated with Google Calendar');
      return [];
    }

    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return [];
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();

