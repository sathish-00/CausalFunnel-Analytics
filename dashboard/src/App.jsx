import React, { useState, useEffect } from 'react';
import SessionList from './components/SessionList';
import SessionDetail from './components/SessionDetail';
import HeatmapView from './components/HeatmapView';
import FunnelView from './components/FunnelView'; // 📉 Newly added conversion view module
import { fetchSessions, fetchSessionDetails } from './services/api';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [sessionEvents, setSessionEvents] = useState([]);
  const [currentView, setCurrentView] = useState('sessions'); 
  const [uniqueUrls, setUniqueUrls] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedUrl, setSelectedUrl] = useState(''); 

  useEffect(() => {
    const loadDashboardSessions = () => {
      fetchSessions()
        .then((data) => {
          const sortedData = data ? [...data].sort((a, b) => {
            const timeA = a.lastActiveTime || a.lastActive || a.timestamp || a.last_activity || 0;
            const timeB = b.lastActiveTime || b.lastActive || b.timestamp || b.last_activity || 0;
            return new Date(timeB) - new Date(timeA);
          }) : [];

          setSessions(sortedData);
          
          if (sortedData.length > 0) {
            const urlSet = new Set();
            sortedData.forEach(session => {
              if (session.url || session.pageUrl) urlSet.add(session.url || session.pageUrl);
              if (session.events) {
                session.events.forEach(e => { if (e.url || e.pageUrl) urlSet.add(e.url || e.pageUrl); });
              }
            });
            
            const rawFlatUrls = sortedData.flatMap(s => s.events ? s.events.map(e => e.url || e.pageUrl) : []).filter(Boolean);
            setUniqueUrls(Array.from(new Set([...Array.from(urlSet), ...rawFlatUrls, 'http://127.0.0.1:5500/tracker/demo.html'])));
          }
        })
        .catch((err) => console.error(err));
    };

    loadDashboardSessions();
    const refreshInterval = setInterval(loadDashboardSessions, 5000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const loadActiveSessionDetails = () => {
      if (selectedSessionId) {
        fetchSessionDetails(selectedSessionId)
          .then((data) => {
            setSessionEvents(data);
            const urls = data.map(e => e.url || e.pageUrl).filter(Boolean);
            setUniqueUrls(prev => Array.from(new Set([...prev, ...urls])));

            if (urls.length > 0 && !selectedUrl) {
              setSelectedUrl(urls[0]);
            }
          })
          .catch((err) => console.error(err));
      }
    };

    loadActiveSessionDetails();
    const detailsInterval = setInterval(loadActiveSessionDetails, 5000);
    return () => clearInterval(detailsInterval);
  }, [selectedSessionId, selectedUrl]);

  const totalSessionsCount = sessions?.length || 0;
  
  const totalGlobalEvents = sessions?.reduce((acc, curr) => {
    return acc + (curr.eventCount || curr.totalEvents || curr.count || curr.total_events || 0);
  }, 0) || 0;

  const activeSessionClicks = sessionEvents.filter(e => {
    const type = e.event_type || e.eventType || '';
    return type.toLowerCase() === 'click';
  }).length;

  const activeSessionViews = sessionEvents.filter(e => {
    const type = e.event_type || e.eventType || '';
    return type.toLowerCase() === 'page_view' || type.toLowerCase() === 'pageview';
  }).length;

  const isSessionInspected = selectedSessionId && (activeSessionClicks > 0 || activeSessionViews > 0);

  const totalEventsCount = isSessionInspected 
    ? (activeSessionClicks + activeSessionViews) 
    : totalGlobalEvents;

  const displayClicks = isSessionInspected 
    ? activeSessionClicks 
    : sessions?.reduce((acc, curr) => acc + (curr.clicksCount || curr.clicks || Math.round((curr.eventCount || curr.total_events || 0) * 0.40)), 0) || 0;

  const displayPageViews = isSessionInspected 
    ? activeSessionViews 
    : Math.max(0, totalEventsCount - displayClicks);

  const filteredSessions = sessions.filter(s => {
    const targetId = s.sessionId || s.session_id || s._id || '';
    return targetId.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc' }}>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        backgroundColor: '#1a202c',
        color: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 10
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '600', letterSpacing: '0.5px' }}>CausalFunnel Analytics Dashboard</h1>
        
        {currentView === 'sessions' && (
          <input 
            type="text"
            placeholder="Search Session ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #4a5568',
              backgroundColor: '#2d3748',
              color: '#fff',
              width: '240px',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        )}

        {/* 📊 Upgraded 3-Tab Workspace Navigation System */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCurrentView('sessions')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentView === 'sessions' ? '#3182ce' : '#4a5568',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Sessions View
          </button>
          <button
            onClick={() => setCurrentView('heatmap')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentView === 'heatmap' ? '#3182ce' : '#4a5568',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Heatmap View
          </button>
          <button
            onClick={() => setCurrentView('funnel')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentView === 'funnel' ? '#3182ce' : '#4a5568',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            📉 Funnel View
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        padding: '20px 20px 0 20px',
        boxSizing: 'border-box'
      }}>
        <div style={kpiCardStyle('#3182ce')}>
          <div style={kpiLabelStyle}>Total Tracked Sessions</div>
          <div style={kpiValueStyle}>{totalSessionsCount}</div>
          <div style={kpiSubtextStyle}>Unique user profiles captured</div>
        </div>

        <div style={kpiCardStyle('#4a5568')}>
          <div style={kpiLabelStyle}>Total Combined Events</div>
          <div style={kpiValueStyle}>{totalEventsCount}</div>
          <div style={kpiSubtextStyle}>Total round-trip raw logs</div>
        </div>

        <div style={kpiCardStyle('#28a745')}>
          <div style={kpiLabelStyle}>Total User Clicks</div>
          <div style={kpiValueStyle}>{displayClicks}</div>
          <div style={kpiSubtextStyle}>Spatial behavior tracking coordinates</div>
        </div>

        <div style={kpiCardStyle('#6f42c1')}>
          <div style={kpiLabelStyle}>Total Page Views</div>
          <div style={kpiValueStyle}>{Math.max(0, displayPageViews)}</div>
          <div style={kpiSubtextStyle}>Dynamic route loading fires</div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '20px', boxSizing: 'border-box' }}>
        <div style={{ 
          display: 'flex', 
          width: '100%', 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}>
          {/* Conditional Multi-Route Content Panel Splitting */}
          {currentView === 'sessions' && (
            <>
              <div style={{ width: '30%', minWidth: '280px', borderRight: '1px solid #e2e8f0' }}>
                <SessionList
                  sessions={filteredSessions}
                  totalCount={totalSessionsCount}
                  onSelectSession={(id) => {
                    setSelectedSessionId(id);
                    setSelectedUrl('');
                  }}
                  selectedSessionId={selectedSessionId}
                />
              </div>
              <div style={{ width: '70%' }}>
                <SessionDetail
                  events={sessionEvents}
                  sessionId={selectedSessionId}
                />
              </div>
            </>
          )}

          {currentView === 'heatmap' && (
            <div style={{ width: '100%', overflowY: 'auto' }}>
              <HeatmapView 
                uniqueUrls={uniqueUrls} 
                selectedUrl={selectedUrl}
                setSelectedUrl={setSelectedUrl}
                allSessions={sessions}
                sessionEvents={sessionEvents}
                selectedSessionId={selectedSessionId}
              />
            </div>
          )}

          {currentView === 'funnel' && (
            <div style={{ width: '100%', overflowY: 'auto' }}>
              {/* Pipe live database sync values directly downstream */}
              <FunnelView allSessions={sessions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const kpiCardStyle = (accentLeftBorderColor) => ({
  backgroundColor: '#ffffff',
  padding: '14px 20px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  borderLeft: `5px solid ${accentLeftBorderColor}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
});

const kpiLabelStyle = { fontSize: '11px', fontWeight: '600', color: '#718096', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const kpiValueStyle = { fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '2px' };
const kpiSubtextStyle = { fontSize: '11px', color: '#a0aec0' };