import React, { useState, useEffect } from 'react';
import { Task, TimeLog } from '../shared/types';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';

interface TaskListProps {
  onTasksChange: () => void;
}

declare global {
  interface Window {
    api: any;
  }
}

export const TaskList: React.FC<TaskListProps> = ({ onTasksChange }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLogs, setTimeLogs] = useState<Record<number, TimeLog[]>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const loadedTasks = await window.api.getTasks();
      setTasks(loadedTasks);

      // Load time logs for each task
      const logs: Record<number, TimeLog[]> = {};
      for (const task of loadedTasks) {
        logs[task.id] = await window.api.getTimeLogs(task.id);
      }
      setTimeLogs(logs);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    try {
      const newTask = await window.api.addTask(task);
      setTasks([newTask, ...tasks]);
      setTimeLogs({ ...timeLogs, [newTask.id]: [] });
      setShowForm(false);
      onTasksChange();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updatedTask = await window.api.updateTask(id, updates);
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      if (editingTask?.id === id) {
        setEditingTask(null);
      }
      onTasksChange();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await window.api.deleteTask(id);
        setTasks(tasks.filter((t) => t.id !== id));
        const newLogs = { ...timeLogs };
        delete newLogs[id];
        setTimeLogs(newLogs);
        onTasksChange();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    }
  };

  const handleAddTimeLog = async (taskId: number, startTime: string, endTime: string) => {
    try {
      const timeLog = await window.api.addTimeLog(taskId, startTime, endTime);
      setTimeLogs({
        ...timeLogs,
        [taskId]: [timeLog, ...(timeLogs[taskId] || [])],
      });

      // Reload task to get updated timeSpentMinutes
      const updatedTask = await window.api.getTask(taskId);
      setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error('Error adding time log:', error);
      alert('Failed to add time log');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>Hausmeister Task Manager</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTask(null);
          }}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <TaskForm
            onSubmit={editingTask ? (t) => handleUpdateTask(editingTask.id, t) : handleAddTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            initialTask={editingTask || undefined}
          />
        </div>
      )}

      <div className="filter-controls">
        <label htmlFor="filter">Filter:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="form-select"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. {filter !== 'all' && `Try a different filter.`}</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              timeLogs={timeLogs[task.id] || []}
              onUpdate={(updates) => handleUpdateTask(task.id, updates)}
              onDelete={() => handleDeleteTask(task.id)}
              onEdit={() => {
                setEditingTask(task);
                setShowForm(true);
              }}
              onAddTimeLog={(start, end) => handleAddTimeLog(task.id, start, end)}
            />
          ))}
        </div>
      )}

      <div className="stats">
        <div className="stat-item">
          <strong>Total Tasks:</strong> {tasks.length}
        </div>
        <div className="stat-item">
          <strong>Completed:</strong> {tasks.filter((t) => t.status === 'completed').length}
        </div>
        <div className="stat-item">
          <strong>In Progress:</strong> {tasks.filter((t) => t.status === 'in-progress').length}
        </div>
        <div className="stat-item">
          <strong>Total Time Logged:</strong>{' '}
          {Math.round(tasks.reduce((sum, t) => sum + (t.timeSpentMinutes || 0), 0) / 60)} hours
        </div>
      </div>
    </div>
  );
};
