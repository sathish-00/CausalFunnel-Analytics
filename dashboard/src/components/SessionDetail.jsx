import React, { useState } from 'react';

export default function SessionDetail({ events, sessionId }) {
  const [filterType, setFilterType] = useState('ALL');

  if (!sessionId) {
    return (
      <div style={{ padding: '60px 40px', textAlign: 'center', color: '#718096' }}>
        <h3 style={{ fontWeight: '500' }}>
          Select a session from the sidebar to inspect events and user interactions.
        </h3>
      </div>
    );
  }

  const normalizeEvent = (e) => {
    const eventType = e.event_type || e.eventType || 'unknown';
    const url = e.url || e.pageUrl || 'demo.html';
    
    const x = e.click_data?.x ?? e.x ?? null;
    const y = e.click_data?.y ?? e.y ?? null;
    const w = e.click_data?.window_width ?? e.click_data?.viewport_width ?? e.windowWidth ?? e.viewportWidth ?? '1536';
    const h = e.click_data?.window_height ?? e.click_data?.viewport_height ?? e.windowHeight ?? e.viewportHeight ?? '779';
    
    // 🔍 Extract what item was clicked from different potential backend shapes
    const targetText = e.targetText || e.click_data?.targetText || '';
    const targetId = e.targetId || e.click_data?.targetId || e.customTargetId || '';
    const tagName = (e.tagName || e.click_data?.tagName || '').toUpperCase();

    return { eventType, url, x, y, w, h, timestamp: e.timestamp, targetText, targetId, tagName };
  };

  const totalEvents = events?.length || 0;
  const chronologicalEvents = events ? [...events].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) : [];
  
  const pageViews = events?.filter(e => {
    const norm = normalizeEvent(e);
    return norm.eventType.toLowerCase() === 'page_view' || norm.eventType.toLowerCase() === 'pageview';
  }).length || 0;
  
  const clicks = events?.filter(e => {
    const norm = normalizeEvent(e);
    return norm.eventType.toLowerCase() === 'click';
  }).length || 0;

  let durationText = '0s';
  if (totalEvents > 1) {
    const start = new Date(events[0].timestamp);
    const end = new Date(events[totalEvents - 1].timestamp);
    const diffMs = Math.abs(end - start);
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    durationText = diffMins > 0 ? `${diffMins}m ${diffSecs}s` : `${diffSecs}s`;
  }

  const getDeviceProfile = () => {
    if (!events || events.length === 0) return 'Desktop';
    const sample = normalizeEvent(events[0]);
    const width = parseInt(sample.w, 10) || window.innerWidth;

    if (width < 768) return 'Mobile';
    if (width >= 768 && width <= 1024) return 'Tablet';
    return 'Desktop';
  };

  let engagementLevel = 'LOW';
  let engagementColor = '#718096';
  if (clicks >= 9) {
    engagementLevel = 'HIGH';
    engagementColor = '#28a745';
  } else if (clicks >= 3) {
    engagementLevel = 'MEDIUM';
    engagementColor = '#dd6b20';
  }

  let deadClicksCount = 0;
  let rageClicksDetected = false;

  for (let i = 0; i < chronologicalEvents.length; i++) {
    const curr = normalizeEvent(chronologicalEvents[i]);
    if (curr.eventType.toLowerCase() !== 'click' || curr.x === null) continue;

    let clusterMatches = 0;
    let timeClusterMatches = 0;

    for (let j = i + 1; j < chronologicalEvents.length; j++) {
      const next = normalizeEvent(chronologicalEvents[j]);
      if (next.eventType.toLowerCase() !== 'click' || next.x === null) continue;

      const distance = Math.sqrt(Math.pow(next.x - curr.x, 2) + Math.pow(next.y - curr.y, 2));
      
      if (distance <= 20) {
        clusterMatches++;
        const timeDiffSeconds = Math.abs(new Date(next.timestamp) - new Date(curr.timestamp)) / 1000;
        if (timeDiffSeconds <= 1.5) {
          timeClusterMatches++;
        }
      }
    }

    if (clusterMatches >= 3) deadClicksCount++;
    if (timeClusterMatches >= 2) rageClicksDetected = true;
  }

  const sortedEventsForTimeline = events ? [...events].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];

  const filteredEvents = sortedEventsForTimeline.filter(e => {
    if (filterType === 'ALL') return true;
    const norm = normalizeEvent(e);
    if (filterType === 'CLICKS') return norm.eventType.toLowerCase() === 'click';
    if (filterType === 'VIEWS') return norm.eventType.toLowerCase() === 'page_view' || norm.eventType.toLowerCase() === 'pageview';
    return true;
  });

  const exportCSV = () => {
    const headers = ['Event Type', 'URL Path', 'Target Element', 'Coordinate X', 'Coordinate Y', 'Timestamp'];
    const rows = sortedEventsForTimeline.map(e => {
      const norm = normalizeEvent(e);
      const label = norm.targetText || norm.targetId || norm.tagName || 'Body';
      return [norm.eventType, norm.url, label, norm.x || '', norm.y || '', norm.timestamp];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `session_${sessionId}_metrics.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', height: 'calc(100vh - 60px)', overflowY: 'auto', boxSizing: 'border-box' }}>
      <h2>User Journey Detail</h2>
      
      {(deadClicksCount > 0 || rageClicksDetected) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {rageClicksDetected && (
            <div style={{ background: '#fff5f5', color: '#c53030', border: '1px solid #feb2b2', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
              Potential Rage Click Zone Detected: Users rapidly clicked the same region.
            </div>
          )}
          {deadClicksCount > 0 && (
            <div style={{ background: '#fffaf0', color: '#dd6b20', border: '1px solid #fbd38d', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
              {deadClicksCount} Potential Dead Clicks Detected: Repetitive actions registered without page updates.
            </div>
          )}
        </div>
      )}

      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '25px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#1a202c', fontSize: '16px' }}>Session Summary</h3>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={exportCSV}
              style={{ backgroundColor: '#28a745', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                const cleanData = sortedEventsForTimeline.map(e => normalizeEvent(e));
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ sessionId, totalEvents, pageViews, clicks, durationText, normalizedEvents: cleanData }, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `session_${sessionId}_audit.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              style={{ backgroundColor: '#1a202c', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
            >
              Export JSON
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>Session ID</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#2d3748', wordBreak: 'break-all' }}>{sessionId}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>Device Profile</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#319795' }}>{getDeviceProfile()}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>Engagement</div>
            <div style={{ fontSize: '13px', fontWeight: 'extrabold', color: engagementColor }}>{engagementLevel}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>Page Views</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#007bff' }}>{pageViews}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>Clicks</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#28a745' }}>{clicks}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px' }}>Duration</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#6f42c1' }}>{durationText}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#2d3748' }}>User Journey Timeline</h3>
        
        <div style={{ display: 'flex', backgroundColor: '#edf2f7', padding: '4px', borderRadius: '6px', gap: '4px' }}>
          {['ALL', 'CLICKS', 'VIEWS'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '4px 10px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: filterType === type ? '#ffffff' : 'transparent',
                color: filterType === type ? '#2b6cb0' : '#4a5568',
                boxShadow: filterType === type ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', borderLeft: '2px solid #007bff', marginLeft: '10px', paddingLeft: '20px', paddingBottom: '80px' }}>
        {filteredEvents.map((rawEvent, index) => {
          const event = normalizeEvent(rawEvent);
          const isClick = event.eventType.toLowerCase() === 'click';
          const eventDate = new Date(event.timestamp);

          // 🛠 Determine a friendly label for what was clicked
          let clickedItemName = "Page Canvas Body";
          if (event.targetText) clickedItemName = `"${event.targetText}"`;
          else if (event.targetId) {
            clickedItemName = event.targetId === 'btn-1' ? 'Action Button A' : event.targetId === 'btn-2' ? 'Action Button B' : event.targetId;
          } else if (event.tagName) {
            clickedItemName = `${event.tagName} Element`;
          }

          return (
            <div key={rawEvent._id || index} style={{ marginBottom: '25px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-27px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: isClick ? '#28a745' : '#007bff', border: '2px solid #fff' }} />

              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  
                  {/* Smart Label Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#fff', backgroundColor: isClick ? '#28a745' : '#007bff' }}>
                      {event.eventType}
                    </span>
                    
                    {/* 💡 SMART CONTEXT BADGE: Tells you EXACTLY what button/item was hit */}
                    {isClick && (
                      <span style={{ fontSize: '12px', color: '#1e293b', fontWeight: '700', background: '#dcfce7', padding: '3px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                        🎯 Clicked: {clickedItemName}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end', 
                    background: '#e2e8f0', 
                    padding: '6px 12px', 
                    borderRadius: '6px',
                    minWidth: '110px'
                  }}>
                    <span style={{ fontSize: '13px', color: '#1a202c', fontWeight: '800', lineHeight: '1.4' }}>
                      {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span style={{ fontSize: '12px', color: '#4a5568', fontWeight: '700', marginTop: '2px' }}>
                      {eventDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '14px', margin: '5px 0' }}>
                  <strong>URL:</strong>{' '}
                  <a href={rawEvent.url || rawEvent.pageUrl} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all', color: '#007bff', textDecoration: 'none', fontWeight: '500' }}>
                    {event.url.split('/').pop()}
                  </a>
                </div>

                {isClick && event.x !== null && (
                  <div style={{ fontSize: '13px', color: '#555', background: '#e9ecef', padding: '6px', borderRadius: '4px', marginTop: '5px' }}>
                     Position: <strong>X: {event.x}px, Y: {event.y}px</strong> 
                    <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                    Viewport: {event.w}x{event.h}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}