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
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);

  useEffect(() => {
    initializeCalendar();
  }, []);

  const initializeCalendar = async () => {
    try {
      if (window.api && window.api.initializeCalendar) {
        const result = await window.api.initializeCalendar();
        if (result.success) {
          setCalendarInitialized(true);
          console.log('Calendar initialized with stored tokens');
        } else {
          console.log('No stored calendar tokens - user needs to authorize');
        }
      }
    } catch (error) {
      console.error('Error initializing calendar:', error);
    }
  };

  const handleTasksChange = () => {
    // Force refresh of task data if needed
    setTaskRefreshKey((prev) => prev + 1);
  };

  const handleCalendarAuthSuccess = () => {
    setCalendarInitialized(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🏢 Hausmeister Task Manager</h1>
        </div>
      </header>

      <main className="app-main">
        <div className="main-content">
          <TaskList key={taskRefreshKey} onTasksChange={handleTasksChange} />
        </div>
        <aside className="calendar-sidebar">
          <CalendarSync 
            onAuthSuccess={handleCalendarAuthSuccess}
            isInitialized={calendarInitialized}
          />
        </aside>
      </main>

      <footer className="app-footer">
        <p>Hausmeister Task Manager • Manage your tasks efficiently</p>
      </footer>
    </div>
  );
}

export default App;
