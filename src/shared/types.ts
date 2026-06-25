export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  completedAt: string | null;
  timeSpentMinutes: number;
  googleCalendarEventId?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface TimeLog {
  id: number;
  taskId: number;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

export interface CalendarSettings {
  id?: number;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  calendarId?: string;
}
