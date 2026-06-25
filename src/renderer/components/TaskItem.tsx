import React, { useState } from 'react';
import { Task, TimeLog } from '../shared/types';

interface TaskItemProps {
  task: Task;
  timeLogs: TimeLog[];
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
  onEdit: () => void;
  onAddTimeLog: (startTime: string, endTime: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  timeLogs,
  onUpdate,
  onDelete,
  onEdit,
  onAddTimeLog,
}) => {
  const [showTimeTracker, setShowTimeTracker] = useState(false);
  const [trackStartTime, setTrackStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [trackEndTime, setTrackEndTime] = useState(new Date().toISOString().slice(0, 16));

  const handleAddTimeLog = () => {
    if (trackStartTime && trackEndTime) {
      onAddTimeLog(trackStartTime, trackEndTime);
      setShowTimeTracker(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in-progress':
        return 'status-in-progress';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  return (
    <div className={`task-item ${getStatusColor(task.status)}`}>
      <div className="task-header">
        <div className="task-title-section">
          <h3 className="task-title">{task.title}</h3>
          <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          <span className={`status-badge ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ').toUpperCase()}
          </span>
        </div>
        <div className="task-actions">
          <button onClick={onEdit} className="btn btn-sm btn-primary" title="Edit">
            ✎
          </button>
          <button onClick={onDelete} className="btn btn-sm btn-danger" title="Delete">
            ✕
          </button>
        </div>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <div className="meta-item">
          <strong>Created:</strong> {formatDate(task.createdAt)}
        </div>
        {task.completedAt && (
          <div className="meta-item">
            <strong>Completed:</strong> {formatDate(task.completedAt)}
          </div>
        )}
        <div className="meta-item">
          <strong>Time Spent:</strong> {task.timeSpentMinutes} minutes
        </div>
      </div>

      {timeLogs.length > 0 && (
        <div className="time-logs">
          <strong>Time Logs:</strong>
          <ul className="logs-list">
            {timeLogs.map((log) => (
              <li key={log.id}>
                {formatDate(log.startTime)} to {formatDate(log.endTime)} ({log.duration} min)
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="task-controls">
        {task.status !== 'completed' && (
          <button
            onClick={() => onUpdate({ status: 'in-progress' })}
            className="btn btn-sm btn-info"
          >
            Start Task
          </button>
        )}
        {task.status !== 'completed' && (
          <button
            onClick={() =>
              onUpdate({
                status: 'completed',
                completedAt: new Date().toISOString(),
              })
            }
            className="btn btn-sm btn-success"
          >
            Complete Task
          </button>
        )}
        <button
          onClick={() => setShowTimeTracker(!showTimeTracker)}
          className="btn btn-sm btn-secondary"
        >
          {showTimeTracker ? 'Hide Time Tracker' : 'Log Time'}
        </button>
      </div>

      {showTimeTracker && (
        <div className="time-tracker">
          <div className="time-input-group">
            <label htmlFor={`start-${task.id}`}>Start Time:</label>
            <input
              id={`start-${task.id}`}
              type="datetime-local"
              value={trackStartTime}
              onChange={(e) => setTrackStartTime(e.target.value)}
            />
          </div>
          <div className="time-input-group">
            <label htmlFor={`end-${task.id}`}>End Time:</label>
            <input
              id={`end-${task.id}`}
              type="datetime-local"
              value={trackEndTime}
              onChange={(e) => setTrackEndTime(e.target.value)}
            />
          </div>
          <button onClick={handleAddTimeLog} className="btn btn-sm btn-primary">
            Save Time Log
          </button>
        </div>
      )}
    </div>
  );
};
