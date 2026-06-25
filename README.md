# Hausmeister Task Manager

A desktop application for managing tasks and jobs as a hausmeister (house superintendent), with Google Calendar integration for synchronizing your tasks.

## Features

- ✅ **Add, Edit, and Delete Tasks** - Manage all your daily tasks
- ⏱️ **Time Tracking** - Log time spent on each task with detailed time logs
- 📊 **Task Status Management** - Track task status (Pending, In Progress, Completed)
- 🎯 **Priority Levels** - Assign priority levels (Low, Medium, High) to tasks
- 📅 **Google Calendar Integration** - Sync tasks with your Google Calendar
- 📈 **Statistics Dashboard** - View task statistics at a glance
- 💾 **Local Database** - All data is stored locally using SQLite

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Desktop Framework**: Electron
- **Database**: SQLite3
- **UI Styling**: CSS3 with responsive design
- **Calendar**: Google Calendar API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google OAuth credentials (for calendar integration)

## Installation

1. Clone or download this project:
```bash
cd "Task Manager"
```

2. Install dependencies:
```bash
npm install
```

3. **Configure Google Calendar (Optional)**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google Calendar API
   - Create OAuth 2.0 credentials (Desktop application)
   - Copy your `Client ID` and `Client Secret`
   - Update `src/services/googleCalendar.ts`:
     ```typescript
     const DEMO_CREDENTIALS = {
       clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
       clientSecret: 'YOUR_CLIENT_SECRET',
       redirectUrl: 'http://localhost:3000/auth/callback'
     };
     ```

## Development

### Start the Development Server

```bash
npm run dev
```

This will start both the React development server and Electron app in watch mode.

### Build for Production

```bash
npm run prebuild
npm run dist
```

This creates a distributable application in the `dist` folder.

## Usage

### Adding a Task

1. Click the **+ New Task** button
2. Fill in the task details:
   - **Title** (required)
   - **Description** (optional)
   - **Priority** (Low, Medium, High)
   - **Status** (Pending, In Progress, Completed)
3. Click **Add Task**

### Managing Tasks

- **Start Task**: Click "Start Task" to mark a task as in-progress
- **Complete Task**: Click "Complete Task" to mark as completed
- **Log Time**: Click "Log Time" to add time entries for the task
- **Edit Task**: Click the ✎ icon to edit
- **Delete Task**: Click the ✕ icon to remove

### Time Tracking

1. Click **Log Time** on any task
2. Set the start and end times
3. Click **Save Time Log**
4. Total time spent is automatically calculated and displayed

### Google Calendar Integration

1. Click **Show Calendar** 📅
2. Click **Authorize with Google**
3. Follow the authorization flow
4. Tasks will automatically sync to your Google Calendar
5. Task status is reflected as event colors:
   - 🔵 Blue: Pending
   - 🟠 Orange: In Progress
   - 🟢 Green: Completed

### Filtering Tasks

Use the **Filter** dropdown to view:
- All Tasks
- Pending Tasks
- In Progress Tasks
- Completed Tasks

## Project Structure

```
src/
├── main/
│   ├── index.ts           # Electron main process
│   └── preload.ts         # IPC preload script
├── renderer/
│   ├── App.tsx            # Main React component
│   ├── App.css            # Styling
│   ├── index.tsx          # React entry point
│   └── components/
│       ├── TaskList.tsx   # Task list component
│       ├── TaskItem.tsx   # Individual task item
│       ├── TaskForm.tsx   # Task form component
│       └── CalendarSync.tsx # Google Calendar integration
├── services/
│   ├── database.ts        # SQLite database service
│   └── googleCalendar.ts  # Google Calendar service
└── shared/
    └── types.ts           # TypeScript types
public/
└── index.html             # HTML template
```

## Database

Tasks and time logs are stored in a local SQLite database (`hausmeister-tasks.db`). The database is created automatically on first run.

### Tables

- **tasks**: Stores task information
- **timeLogs**: Stores time tracking entries
- **calendarSettings**: Stores Google Calendar OAuth tokens

## Troubleshooting

### Tasks Not Saving
- Check that SQLite3 is properly installed: `npm install sqlite3`
- Ensure write permissions in the app directory

### Calendar Integration Not Working
- Verify Google OAuth credentials are correctly set in `googleCalendar.ts`
- Check that the redirect URL matches your OAuth configuration
- Ensure you're connected to the internet

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows
```

## Future Enhancements

- 🔔 Task reminders and notifications
- 📱 Mobile app version
- ☁️ Cloud sync with multiple devices
- 👥 Team collaboration features
- 📊 Advanced analytics and reports
- 🔐 Task encryption
- 🌙 Dark mode

## License

MIT License

## Support

For issues or questions, please create an issue in the project repository.

---

Happy task managing! 🏢📋
