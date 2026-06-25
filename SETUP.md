# Quick Start Guide

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies for the React frontend and Electron desktop application.

### 2. Run in Development Mode

```bash
npm run dev
```

This command will:
- Start the React development server on http://localhost:3000
- Wait for the React server to be ready
- Launch the Electron application with DevTools open for debugging

### 3. Build for Production

To create a production build:

```bash
npm run build
```

Then distribute the app using:

```bash
npx electron-builder
```

## Directory Structure

```
├── electron-main.js        # Electron main process (Node.js)
├── preload.js              # IPC preload script for secure communication
├── public/                 # Static assets
│   └── index.html         # HTML template
├── src/
│   ├── renderer/          # React frontend
│   │   ├── App.tsx        # Main app component
│   │   ├── App.css        # Styling
│   │   ├── index.tsx      # React entry point
│   │   └── components/
│   │       ├── TaskList.tsx
│   │       ├── TaskItem.tsx
│   │       ├── TaskForm.tsx
│   │       └── CalendarSync.tsx
│   ├── services/          # Business logic services
│   ├── shared/            # Shared TypeScript types
│   └── main/              # Electron main process (TypeScript)
├── package.json
└── README.md
```

## How It Works

### Architecture

1. **Electron Main Process** (`electron-main.js`):
   - Manages the desktop window
   - Handles SQLite database operations
   - Provides IPC endpoints for the frontend
   - Manages Google Calendar integration

2. **React Frontend** (`src/renderer/`):
   - User interface for task management
   - Communicates with Electron via IPC
   - Time tracking interface
   - Google Calendar sync UI

3. **Database** (SQLite):
   - Stores tasks locally in `~/.hausmeister-tasks.db`
   - No internet connection required for basic functionality
   - Tables: tasks, timeLogs, calendarSettings

## Key Features

### Task Management
- ✅ Add tasks with title, description, priority, and status
- 📝 Edit existing tasks
- 🗑️ Delete tasks
- 🏷️ Filter tasks by status (All, Pending, In Progress, Completed)

### Time Tracking
- ⏱️ Log time for each task
- 📊 Track total time spent on each task
- 📈 View detailed time logs
- 🎯 Calculate total hours logged

### Google Calendar Integration
- 📅 Authorize with your Google Calendar
- 🔄 Sync tasks to calendar events
- 🎨 Color-coded task status (Blue=Pending, Orange=In Progress, Green=Completed)
- 📅 View upcoming events

## Troubleshooting

### Port 3000 Already in Use

If you get an error that port 3000 is already in use:

**macOS/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### SQLite3 Build Issues

If you encounter issues installing sqlite3:

```bash
npm rebuild sqlite3
```

### Database File Location

The database is stored at:
- **macOS/Linux**: `~/.hausmeister-tasks.db`
- **Windows**: `C:\Users\<YourUsername>\hausmeister-tasks.db`

To reset the database, simply delete this file and restart the app.

### Google Calendar Not Showing Events

1. Ensure you've authorized the app with your Google account
2. Check that Google Calendar API is enabled in your Google Cloud Console
3. Verify your OAuth credentials are correct in the authorization dialog
4. Check internet connectivity

## Development Tips

### Enable React DevTools
- React DevTools are automatically shown in development mode
- Use Chrome DevTools in the Electron window (press F12)

### Hot Reload
- Changes to React components will hot-reload automatically
- Changes to electron-main.js require a restart

### Debugging
- Open DevTools: Press F12 in the Electron window
- Check Console tab for errors
- Use React DevTools extension for component inspection

## Performance Optimization

For better performance:
1. Limit time logs displayed per task (consider pagination)
2. Cache task data in React state
3. Debounce rapid updates
4. Use virtual scrolling for large task lists

## Future Enhancements

- Dark mode
- Task categories/tags
- Recurring tasks
- Task templates
- Team collaboration
- Cloud backup
- Mobile app
- Advanced analytics

## Support

For issues or feature requests, please check the README.md for additional information.

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-25
