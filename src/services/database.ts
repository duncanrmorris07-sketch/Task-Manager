import sqlite3 from 'sqlite3';
import path from 'path';
import { Task, TimeLog, CalendarSettings } from '../shared/types';

const DB_PATH = path.join(process.env.APPDATA || process.env.HOME || '.', 'hausmeister-tasks.db');

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this.initializeTables();
  }

  private initializeTables() {
    this.db.serialize(() => {
      // Tasks table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'pending',
          createdAt TEXT NOT NULL,
          completedAt TEXT,
          timeSpentMinutes INTEGER DEFAULT 0,
          googleCalendarEventId TEXT,
          priority TEXT DEFAULT 'medium'
        )
      `);

      // Time logs table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS timeLogs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          taskId INTEGER NOT NULL,
          startTime TEXT NOT NULL,
          endTime TEXT NOT NULL,
          duration INTEGER NOT NULL,
          FOREIGN KEY (taskId) REFERENCES tasks(id)
        )
      `);

      // Calendar settings table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS calendarSettings (
          id INTEGER PRIMARY KEY,
          accessToken TEXT,
          refreshToken TEXT,
          expiresAt INTEGER,
          calendarId TEXT
        )
      `);
    });
  }

  // Task operations
  async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    return new Promise((resolve, reject) => {
      const { title, description, status, createdAt, priority } = task;
      this.db.run(
        `INSERT INTO tasks (title, description, status, createdAt, priority) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, description, status, createdAt, priority],
        function(err) {
          if (err) reject(err);
          else resolve({ ...task, id: this.lastID } as Task);
        }
      );
    });
  }

  async getTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM tasks ORDER BY createdAt DESC`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Task[]);
      });
    });
  }

  async getTaskById(id: number): Promise<Task | null> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as Task | null);
      });
    });
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    return new Promise((resolve, reject) => {
      const allowedFields = ['title', 'description', 'status', 'completedAt', 'timeSpentMinutes', 'googleCalendarEventId', 'priority'];
      const setClause = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .map(key => `${key} = ?`)
        .join(', ');
      
      const values = Object.keys(updates)
        .filter(key => allowedFields.includes(key))
        .map(key => (updates as any)[key]);

      this.db.run(
        `UPDATE tasks SET ${setClause} WHERE id = ?`,
        [...values, id],
        async (err) => {
          if (err) reject(err);
          else {
            const task = await this.getTaskById(id);
            resolve(task!);
          }
        }
      );
    });
  }

  async deleteTask(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM tasks WHERE id = ?`, [id], (err) => {
        if (err) reject(err);
        else {
          // Also delete associated time logs
          this.db.run(`DELETE FROM timeLogs WHERE taskId = ?`, [id], (err) => {
            if (err) reject(err);
            else resolve();
          });
        }
      });
    });
  }

  // Time log operations
  async addTimeLog(taskId: number, startTime: string, endTime: string): Promise<TimeLog> {
    return new Promise((resolve, reject) => {
      const duration = Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000);
      this.db.run(
        `INSERT INTO timeLogs (taskId, startTime, endTime, duration) VALUES (?, ?, ?, ?)`,
        [taskId, startTime, endTime, duration],
        function(err) {
          if (err) reject(err);
          else {
            resolve({
              id: this.lastID,
              taskId,
              startTime,
              endTime,
              duration
            });
          }
        }
      );
    });
  }

  async getTimeLogs(taskId: number): Promise<TimeLog[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM timeLogs WHERE taskId = ? ORDER BY startTime DESC`,
        [taskId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as TimeLog[]);
        }
      );
    });
  }

  // Calendar settings operations
  async saveCalendarSettings(settings: CalendarSettings): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO calendarSettings (id, accessToken, refreshToken, expiresAt, calendarId)
         VALUES (1, ?, ?, ?, ?)`,
        [settings.accessToken, settings.refreshToken, settings.expiresAt, settings.calendarId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getCalendarSettings(): Promise<CalendarSettings | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM calendarSettings WHERE id = 1`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row as CalendarSettings | null);
        }
      );
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export const database = new Database();
