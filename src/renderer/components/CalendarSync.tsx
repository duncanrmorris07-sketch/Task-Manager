import React, { useEffect, useState } from 'react';

interface CalendarSyncProps {
  onAuthSuccess: () => void;
  isInitialized: boolean;
}

declare global {
  interface Window {
    api: any;
  }
}

export const CalendarSync: React.FC<CalendarSyncProps> = ({ onAuthSuccess, isInitialized }) => {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [showAuthLink, setShowAuthLink] = useState(!isInitialized);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');

  useEffect(() => {
    if (isInitialized) {
      fetchUpcomingEvents();
    }
  }, [isInitialized]);

  const fetchAuthUrl = async () => {
    try {
      setLoading(true);
      const url = await window.api.getAuthUrl();
      setAuthUrl(url);
    } catch (error) {
      console.error('Error fetching auth URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const timeMin = now.toISOString();
      const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days from now

      const events = await window.api.getCalendarEvents(timeMin, timeMax);
      setUpcomingEvents(events || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAuthLink = () => {
    if (authUrl) {
      window.open(authUrl, '_blank');
      // In a real app, you'd listen for a callback from Google OAuth
      // For now, user needs to manually trigger sync after auth
      alert('After authorizing, click "Sync with Google" to complete the connection.');
    } else {
      fetchAuthUrl();
    }
  };

  const handleManualAuth = async () => {
    if (!authCode.trim()) {
      alert('Please enter the authorization code');
      return;
    }
    
    try {
      setLoading(true);
      const result = await window.api.handleAuthCode(authCode);
      if (result.success) {
        setShowAuthLink(false);
        setShowCodeInput(false);
        setAuthCode('');
        onAuthSuccess();
        fetchUpcomingEvents();
      } else {
        alert(`Authorization failed: ${result.error}`);
      }
    } catch (error) {
      alert(`Error during authorization: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calendar-sync panel">
      <h2>Google Calendar Integration</h2>

      {!isInitialized && showAuthLink ? (
        <div className="auth-section">
          <p>Connect your Google Calendar to sync your tasks.</p>
          <div className="auth-buttons">
            <button
              onClick={handleOpenAuthLink}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Loading...' : 'Authorize with Google'}
            </button>
            <button
              onClick={() => setShowCodeInput(!showCodeInput)}
              disabled={loading}
              className="btn btn-secondary"
            >
              {showCodeInput ? 'Hide Code Input' : 'Enter Authorization Code'}
            </button>
          </div>

          {showCodeInput && (
            <div className="code-input-section">
              <label htmlFor="auth-code">Authorization Code:</label>
              <input
                id="auth-code"
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Paste the authorization code from Google"
                className="form-input"
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  onClick={handleManualAuth}
                  disabled={loading || !authCode.trim()}
                  className="btn btn-primary"
                >
                  {loading ? 'Authorizing...' : 'Submit Code'}
                </button>
                <button
                  onClick={() => {
                    setShowCodeInput(false);
                    setAuthCode('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {authUrl && (
            <p className="help-text">
              Or copy this URL manually: <br />
              <code className="url-code">{authUrl}</code>
            </p>
          )}
        </div>
      ) : (
        <div className="sync-section">
          <div className="sync-header">
            <p className="status-text">✓ Connected to Google Calendar</p>
            <button
              onClick={fetchUpcomingEvents}
              disabled={loading}
              className="btn btn-sm btn-secondary"
            >
              {loading ? 'Syncing...' : 'Refresh Events'}
            </button>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="events-list">
              <h3>Upcoming Events (Next 30 Days)</h3>
              <ul>
                {upcomingEvents.slice(0, 10).map((event) => (
                  <li key={event.id} className="event-item">
                    <strong>{event.summary}</strong>
                    <p>
                      {new Date(event.start.dateTime || event.start.date).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </li>
                ))}
              </ul>
              {upcomingEvents.length > 10 && (
                <p className="more-text">... and {upcomingEvents.length - 10} more events</p>
              )}
            </div>
          ) : (
            <p className="no-events">No upcoming events in the next 30 days.</p>
          )}
        </div>
      )}
    </div>
  );
};
