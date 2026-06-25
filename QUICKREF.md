# Quick Reference Card - Hausmeister Task Manager

## 🚀 Quick Start (30 seconds)

```bash
cd "Task Manager"
npm install          # One-time setup
npm run dev          # Start the app
```

---

## ⚡ Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development (React + Electron) |
| `npm run build` | Build production version |
| `npm install` | Install dependencies |
| `npm run react-dev` | React only (port 3000) |
| `npm run electron-dev` | Electron only |

---

## 📋 Features At a Glance

### Task Management
| Feature | How to Use |
|---------|-----------|
| **Add Task** | Click "+ New Task" → Fill form → Click "Add Task" |
| **Edit Task** | Click ✎ icon on task card |
| **Delete Task** | Click ✕ icon on task card |
| **Filter** | Use "Filter" dropdown (All, Pending, In Progress, Completed) |
| **Mark In Progress** | Click "Start Task" button |
| **Complete Task** | Click "Complete Task" button |

### Time Tracking
| Feature | How to Use |
|---------|-----------|
| **Log Time** | Click "Log Time" → Set start/end → "Save Time Log" |
| **View Logs** | See "Time Logs" section on task |
| **Total Time** | Shows "Time Spent: X minutes" on each task |

### Priority & Status
| Option | Meaning |
|--------|---------|
| **High Priority** | 🔴 Red badge - urgent |
| **Medium Priority** | 🟠 Orange badge - normal |
| **Low Priority** | 🟢 Green badge - low urgency |
| **Pending** | Not started yet |
| **In Progress** | Currently working on |
| **Completed** | Done ✓ |

### Google Calendar
| Feature | How to Use |
|---------|-----------|
| **Connect** | Click "Show Calendar" 📅 → "Authorize with Google" |
| **View Events** | Calendar sync panel shows next 30 days |
| **Refresh** | Click "Refresh Events" button |
| **Status Colors** | Blue (Pending), Orange (In Progress), Green (Done) |

---

## 📁 Where Data Is Stored

**Database Location**:
- macOS/Linux: `~/.hausmeister-tasks.db`
- Windows: `C:\Users\YourUsername\hausmeister-tasks.db`

**What's Stored**:
- ✅ All tasks and details
- ⏱️ Time logs
- 🔑 Google Calendar tokens

---

## 🔧 Configuration

### Change Google Calendar Credentials

Edit `electron-main.js` (lines 6-10):
```javascript
const DEMO_CREDENTIALS = {
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUrl: 'http://localhost:3000/auth/callback'
};
```

### Customize Colors

Edit `src/renderer/App.css`:
```css
:root {
  --primary-color: #2563eb;      /* Main blue */
  --success-color: #16a34a;      /* Green */
  --danger-color: #dc2626;       /* Red */
  /* ... more colors ... */
}
```

---

## 🎨 Dashboard Stats

The app shows:
- **Total Tasks**: All tasks count
- **Completed**: How many done
- **In Progress**: Currently active
- **Total Time Logged**: Hours calculation

---

## ⚠️ Common Issues & Fixes

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` |
| SQLite build fails | `npm rebuild sqlite3` |
| Database corrupted | Delete `~/.hausmeister-tasks.db` + restart |
| React not loading | `rm -rf node_modules && npm install` |
| Changes not showing | Clear DevTools cache (F12) |

---

## 🎯 Typical Workflow

1. **Morning**: Add tasks for the day
2. **During Work**: Mark tasks "In Progress", log time
3. **End of Day**: Complete tasks, review time logs
4. **Sync**: Tasks auto-sync to Google Calendar

---

## 📱 Keyboard Shortcuts

- **F12**: Open DevTools for debugging
- **Cmd+Q** (Mac) / **Ctrl+Q** (Windows/Linux): Quit app
- **Cmd+Z** (Mac) / **Ctrl+Z** (Windows/Linux): Undo edit

---

## 📊 Browser/DevTools

- Press **F12** in Electron window to open DevTools
- React Components tab available in DevTools
- Console shows any errors
- Application tab shows stored data

---

## 🚀 Production Build

```bash
npm run build           # Build React app
npm run dist           # Create installers
```

Installers will be in: `dist/` folder

---

## 📞 Project Structure

```
TaskManager/
├── electron-main.js    ← Electron logic
├── preload.js          ← IPC security
├── package.json        ← Dependencies
├── public/index.html   ← HTML template
└── src/
    ├── renderer/       ← React components
    ├── services/       ← Database & calendar
    └── shared/types.ts ← TypeScript types
```

---

## ✅ Checklist After First Run

- [ ] Tasks can be added
- [ ] Tasks show in list
- [ ] Time can be logged
- [ ] Tasks can be marked complete
- [ ] Statistics update
- [ ] Filter works
- [ ] Google Calendar button appears

---

## 🎓 Learning Resources

- **Electron Docs**: https://www.electronjs.org/docs
- **React Docs**: https://react.dev
- **SQLite**: https://www.sqlite.org
- **Google Calendar API**: https://developers.google.com/calendar

---

## 📝 Notes

- All data is **local** - no internet needed for tasks
- Google Calendar sync requires internet
- Database is **automatic** - no setup needed
- No user accounts needed - runs on your computer

---

## Version Info

- **Version**: 1.0.0
- **Status**: Ready for Production
- **Last Updated**: 2026-06-25

**For detailed info, see**: README.md, SETUP.md, PROJECT_SUMMARY.md

---

**Ready to go!** Run `npm run dev` and start managing tasks! 🚀
