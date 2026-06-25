import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { database } from '../services/database';
import { googleCalendarService } from '../services/googleCalendar';
import { Task, TimeLog } from '../shared/types';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers for Task Management
ipcMain.handle('add-task', async (event, task: Omit<Task, 'id'>) => {
  const newTask = await database.addTask(task);
  
  // Try to create calendar event
  const eventId = await googleCalendarService.createTaskEvent(newTask);
  if (eventId) {
    await database.updateTask(newTask.id, { googleCalendarEventId: eventId });
  }
  
  return newTask;
});

ipcMain.handle('get-tasks', async () => {
  return await database.getTasks();
});

ipcMain.handle('get-task', async (event, id: number) => {
  return await database.getTaskById(id);
});

ipcMain.handle('update-task', async (event, id: number, updates: Partial<Task>) => {
  const task = await database.updateTask(id, updates);
  
  // Sync status to calendar
  if (task.googleCalendarEventId) {
    await googleCalendarService.syncTaskStatus(task);
  }
  
  return task;
});

ipcMain.handle('delete-task', async (event, id: number) => {
  const task = await database.getTaskById(id);
  
  // Delete calendar event
  if (task?.googleCalendarEventId) {
    await googleCalendarService.deleteTaskEvent(task.googleCalendarEventId);
  }
  
  await database.deleteTask(id);
});

// Time Log Handlers
ipcMain.handle('add-time-log', async (event, taskId: number, startTime: string, endTime: string) => {
  const timeLog = await database.addTimeLog(taskId, startTime, endTime);
  
  // Update task time spent
  const task = await database.getTaskById(taskId);
  if (task) {
    const updatedTime = (task.timeSpentMinutes || 0) + timeLog.duration;
    await database.updateTask(taskId, { timeSpentMinutes: updatedTime });
  }
  
  return timeLog;
});

ipcMain.handle('get-time-logs', async (event, taskId: number) => {
  return await database.getTimeLogs(taskId);
});

// Calendar Handlers
ipcMain.handle('get-auth-url', async () => {
  return googleCalendarService.getAuthUrl();
});

ipcMain.handle('handle-auth-code', async (event, code: string) => {
  try {
    await googleCalendarService.handleAuthCode(code);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('initialize-calendar', async () => {
  return await googleCalendarService.initializeFromStorage();
});

ipcMain.handle('get-calendar-events', async (event, timeMin: string, timeMax: string) => {
  return await googleCalendarService.getUpcomingEvents(timeMin, timeMax);
});

// App Menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' as const },
      { role: 'redo' as const },
      { type: 'separator' as const },
      { role: 'cut' as const },
      { role: 'copy' as const },
      { role: 'paste' as const },
    ],
  },
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

// Handle app closure
app.on('before-quit', async () => {
  await database.close();
});
