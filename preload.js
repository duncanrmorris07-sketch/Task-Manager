const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Task operations
  addTask: (task) => ipcRenderer.invoke('add-task', task),
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  getTask: (id) => ipcRenderer.invoke('get-task', id),
  updateTask: (id, updates) => ipcRenderer.invoke('update-task', id, updates),
  deleteTask: (id) => ipcRenderer.invoke('delete-task', id),

  // Time log operations
  addTimeLog: (taskId, startTime, endTime) =>
    ipcRenderer.invoke('add-time-log', taskId, startTime, endTime),
  getTimeLogs: (taskId) => ipcRenderer.invoke('get-time-logs', taskId),

  // Calendar operations
  getAuthUrl: () => ipcRenderer.invoke('get-auth-url'),
  handleAuthCode: (code) => ipcRenderer.invoke('handle-auth-code', code),
  initializeCalendar: () => ipcRenderer.invoke('initialize-calendar'),
  getCalendarEvents: (timeMin, timeMax) =>
    ipcRenderer.invoke('get-calendar-events', timeMin, timeMax),
});
