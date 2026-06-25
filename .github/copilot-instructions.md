# Hausmeister Task Manager - Development Guide

This is a desktop application for managing tasks and time tracking as a hausmeister (house superintendent), with Google Calendar integration.

## Project Overview

- **Type**: Electron Desktop Application
- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js (Electron Main Process)
- **Database**: SQLite3
- **Calendar**: Google Calendar API

## Key Features

1. **Task Management** - Add, edit, delete, and filter tasks
2. **Time Tracking** - Log time spent on each task
3. **Task Status** - Track status (Pending, In Progress, Completed)
4. **Priority Levels** - Assign priority (Low, Medium, High)
5. **Google Calendar Sync** - Synchronize tasks with Google Calendar
6. **Local Database** - All data stored locally using SQLite

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts:
- React dev server on http://localhost:3000
- Electron app with hot-reload
- DevTools for debugging

### Build

```bash
npm run build
npm run dist
```

## Project Structure

```
.
├── electron-main.js              # Electron main process with IPC handlers
├── preload.js                    # Secure IPC bridge
├── package.json                  # Dependencies and scripts
├── public/
│   └── index.html               # HTML template
├── src/
│   ├── renderer/                # React frontend
│   │   ├── App.tsx              # Main component
│   │   ├── App.css              # Styling
│   │   ├── index.tsx            # Entry point
│   │   └── components/
│   │       ├── TaskList.tsx
│   │       ├── TaskItem.tsx
│   │       ├── TaskForm.tsx
│   │       └── CalendarSync.tsx
│   ├── services/                # Business logic
│   │   ├── database.ts          # SQLite operations
│   │   └── googleCalendar.ts    # Calendar service
│   ├── shared/
│   │   └── types.ts             # TypeScript types
│   └── main/
│       ├── index.ts             # Electron main (TypeScript)
│       └── preload.ts           # IPC preload (TypeScript)
├── README.md                     # User guide
└── SETUP.md                      # Setup guide
```

## Important Files

- **electron-main.js**: Main process - handles IPC, database, Electron lifecycle
- **App.tsx**: Root React component with main layout
- **TaskList.tsx**: Manages task list state and operations
- **CalendarSync.tsx**: Google Calendar UI and sync logic

## Database

- **Location**: `~/.hausmeister-tasks.db`
- **Tables**:
  - `tasks` - Task information
  - `timeLogs` - Time tracking entries
  - `calendarSettings` - Google Calendar OAuth tokens

## IPC Handlers

Available in electron-main.js:
- `add-task`
- `get-tasks`
- `update-task`
- `delete-task`
- `add-time-log`
- `get-time-logs`
- `get-auth-url`
- `handle-auth-code`
- `initialize-calendar`
- `get-calendar-events`

## Google Calendar Integration

To enable Google Calendar sync:

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Update credentials in `electron-main.js`
4. Users can authorize in the Calendar tab

## Development Workflow

1. Make changes to React components - auto-reload
2. Make changes to electron-main.js - requires restart
3. Test with DevTools open (F12)
4. Check database with sqlite3 CLI

## Troubleshooting

- **Port 3000 in use**: `lsof -ti:3000 | xargs kill -9`
- **Database issues**: Delete `~/.hausmeister-tasks.db` and restart
- **SQLite3 build errors**: Run `npm rebuild sqlite3`

## Next Steps

- [ ] Implement full Google Calendar API integration
- [ ] Add task categories/tags
- [ ] Implement recurring tasks
- [ ] Add task export to CSV
- [ ] Add dark mode
- [ ] Implement task reminders
- [ ] Add team collaboration
- [ ] Cloud backup support

## Notes

- Using JavaScript for electron-main.js for easier setup
- TypeScript in React components
- Tailwind-like CSS utility classes
- react-scripts handles webpack bundling
- No external UI framework - custom CSS only
