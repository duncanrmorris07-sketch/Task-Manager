import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { database } from './database';
import { Task } from '../shared/types';

// Demo/Test credentials - replace with your own from Google Cloud Console
const DEMO_CREDENTIALS = {
  clientId: '1006272285652-es9scneu456mrkj7fn6r4co507kebt5a.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUrl: 'http://localhost:3000/auth/callback'
};

class GoogleCalendarService {
  private oauth2Client: OAuth2Client;
  private calendar = null;

  constructor() {
    this.oauth2Client = new OAuth2Client(
      DEMO_CREDENTIALS.clientId,
      DEMO_CREDENTIALS.clientSecret,
      DEMO_CREDENTIALS.redirectUrl
    );
  }

  /**
   * Get authorization URL for user to login
   */
  getAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async handleAuthCode(code: string): Promise<void> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // Save tokens to database
      await database.saveCalendarSettings({
        accessToken: tokens.access_token || '',
        refreshToken: tokens.refresh_token || '',
        expiresAt: tokens.expiry_date || 0,
        calendarId: 'primary'
      });

      this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    } catch (error) {
      console.error('Error exchanging auth code:', error);
      throw error;
    }
  }

  /**
   * Initialize calendar service with stored credentials
   */
  async initializeFromStorage(): Promise<boolean> {
    try {
      const settings = await database.getCalendarSettings();
      if (!settings || !settings.accessToken) {
        return false;
      }

      this.oauth2Client.setCredentials({
        access_token: settings.accessToken,
        refresh_token: settings.refreshToken,
        expiry_date: settings.expiresAt,
      });

      this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
      return true;
    } catch (error) {
      console.error('Error initializing from storage:', error);
      return false;
    }
  }

  /**
   * Create a calendar event for a task
   */
  async createTaskEvent(task: Task): Promise<string | null> {
    if (!this.calendar) {
      console.log('Calendar not initialized');
      return null;
    }

    try {
      const event = {
        summary: task.title,
        description: task.description || '',
        start: {
          dateTime: new Date(task.createdAt).toISOString(),
        },
        end: {
          dateTime: new Date(new Date(task.createdAt).getTime() + 60 * 60 * 1000).toISOString(),
        },
        extendedProperties: {
          private: {
            taskId: task.id.toString(),
          },
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return response.data.id || null;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  }

  /**
   * Update a calendar event for a task
   */
  async updateTaskEvent(task: Task): Promise<boolean> {
    if (!this.calendar || !task.googleCalendarEventId) {
      return false;
    }

    try {
      const event = {
        summary: task.title,
        description: task.description || '',
        start: {
          dateTime: new Date(task.createdAt).toISOString(),
        },
        end: {
          dateTime: task.completedAt
            ? new Date(task.completedAt).toISOString()
            : new Date(new Date(task.createdAt).getTime() + (task.timeSpentMinutes || 60) * 60 * 1000).toISOString(),
        },
      };

      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: task.googleCalendarEventId,
        requestBody: event,
      });

      return true;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return false;
    }
  }

  /**
   * Delete a calendar event for a task
   */
  async deleteTaskEvent(eventId: string): Promise<boolean> {
    if (!this.calendar) {
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
   * Sync task status to calendar (mark as complete/incomplete)
   */
  async syncTaskStatus(task: Task): Promise<void> {
    if (!task.googleCalendarEventId) {
      return;
    }

    try {
      let colorId = '1'; // blue - default
      if (task.status === 'completed') {
        colorId = '2'; // green
      } else if (task.status === 'in-progress') {
        colorId = '4'; // red
      }

      await this.calendar.events.update({
        calendarId: 'primary',
        eventId: task.googleCalendarEventId,
        requestBody: {
          colorId,
        },
      });
    } catch (error) {
      console.error('Error syncing task status:', error);
    }
  }

  /**
   * Get list of upcoming tasks from calendar
   */
  async getUpcomingEvents(timeMin: string, timeMax: string): Promise<any[]> {
    if (!this.calendar) {
      return [];
    }

    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin,
        timeMax,
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }
}

export const googleCalendarService = new GoogleCalendarService();
