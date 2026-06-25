import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // Task operations
  addTask: (task: any) => ipcRenderer.invoke('add-task', task),
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  getTask: (id: number) => ipcRenderer.invoke('get-task', id),
  updateTask: (id: number, updates: any) => ipcRenderer.invoke('update-task', id, updates),
  deleteTask: (id: number) => ipcRenderer.invoke('delete-task', id),

  // Time log operations
  addTimeLog: (taskId: number, startTime: string, endTime: string) =>
    ipcRenderer.invoke('add-time-log', taskId, startTime, endTime),
  getTimeLogs: (taskId: number) => ipcRenderer.invoke('get-time-logs', taskId),

  // Calendar operations
  getAuthUrl: () => ipcRenderer.invoke('get-auth-url'),
  handleAuthCode: (code: string) => ipcRenderer.invoke('handle-auth-code', code),
  initializeCalendar: () => ipcRenderer.invoke('initialize-calendar'),
  getCalendarEvents: (timeMin: string, timeMax: string) =>
    ipcRenderer.invoke('get-calendar-events', timeMin, timeMax),
});
