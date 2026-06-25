import React, { useEffect, useState } from 'react';
import { TaskList } from './components/TaskList';
import { CalendarSync } from './components/CalendarSync';
import './App.css';

declare global {
  interface Window {
    api: any;
  }
}

function App() {
  const [calendarInitialized, setCalendarInitialized] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);

  useEffect(() => {
    // Initialize calendar on app start
    initializeCalendar();
  }, []);

  const initializeCalendar = async () => {
    try {
      const initialized = await window.api.initializeCalendar();
      setCalendarInitialized(initialized);
    } catch (error) {
      console.error('Error initializing calendar:', error);
    }
  };

  const handleCalendarAuthSuccess = () => {
    setCalendarInitialized(true);
  };

  const handleTasksChange = () => {
    // Force refresh of task data if needed
    setTaskRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏢 Hausmeister Task Manager</h1>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`btn ${showCalendar ? 'btn-secondary' : 'btn-info'}`}
          >
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'} 📅
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="main-content">
          <TaskList key={taskRefreshKey} onTasksChange={handleTasksChange} />
        </div>

        {showCalendar && (
          <aside className="calendar-sidebar">
            <CalendarSync
              onAuthSuccess={handleCalendarAuthSuccess}
              isInitialized={calendarInitialized}
            />
          </aside>
        )}
      </main>

      <footer className="app-footer">
        <p>Hausmeister Task Manager • Manage your tasks efficiently</p>
      </footer>
    </div>
  );
}

export default App;
