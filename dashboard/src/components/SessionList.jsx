import React from 'react';

export default function SessionList({ sessions, totalCount, onSelectSession, selectedSessionId }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      
      {/* Dynamic Keyframes for the Active Pulsing Green Dot */}
      <style>{`
        @keyframes subtlePulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3); }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
        .live-pulse-dot {
          width: 8px;
          height: 8px;
          background-color: #22c55e;
          border-radius: 50%;
          display: inline-block;
          animation: subtlePulse 1.8s infinite ease-in-out;
        }
      `}</style>
      
      {/* Sidebar Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Active Sessions</span>
          <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '12px', padding: '2px 8px', borderRadius: '20px', fontWeight: '600' }}>{totalCount}</span>
        </h3>
      </div>

      {/* Scrollable Cards Wrapper */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px 16px 80px 16px', // 🔄 FIXED: Added 80px bottom padding buffer so the last card scrolls up fully
        backgroundColor: '#f8fafc', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px' 
      }}>
        {sessions.map((session) => {
          const sid = session.sessionId || session.session_id || session._id || 'unknown';
          const isSelected = selectedSessionId === sid;
          
          const rawTime = session.lastActiveTime || session.lastActive || session.timestamp || session.last_activity || 0;
          const dateObj = new Date(rawTime);
          
          const displayTime = rawTime ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A';
          const displayDate = rawTime ? dateObj.toLocaleDateString() : 'N/A';
          
          const eventCount = session.eventCount || session.totalEvents || session.count || session.total_events || 0;
          
          const timeDifferenceMs = Date.now() - dateObj.getTime();
          const isDynamicActive = timeDifferenceMs <= 60000; 

          return (
            <div
              key={sid}
              onClick={() => onSelectSession(sid)}
              style={{
                padding: '18px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                backgroundColor: isSelected ? '#1e293b' : '#ffffff',
                color: isSelected ? '#f1f5f9' : '#334155',
                boxShadow: isSelected 
                  ? '0 10px 20px -5px rgba(15, 23, 42, 0.25)' 
                  : '0 1px 3px rgba(0,0,0,0.02)',
              }}
            >
              {/* Top Meta Details Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: isSelected ? '#94a3b8' : '#64748b' }}>
                  Session Reference
                </span>
                
                {/* Active / Inactive Status Indicator pill */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  letterSpacing: '0.02em',
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : (isDynamicActive ? '#dcfce7' : '#f1f5f9'),
                  color: isSelected ? '#ffffff' : (isDynamicActive ? '#166534' : '#475569')
                }}>
                  {isDynamicActive && <span className="live-pulse-dot" />}
                  <span>{isDynamicActive ? 'ACTIVE' : 'INACTIVE'}</span>
                </div>
              </div>

              {/* Monospace Session Reference Title */}
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace', 
                wordBreak: 'break-all', 
                marginBottom: '20px', 
                color: isSelected ? '#ffffff' : '#0f172a' 
              }}>
                {sid}
              </div>

              {/* Bottom Section: Logs Counter vs Split Row Timestamps */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-end', 
                borderTop: isSelected ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #f1f5f9', 
                paddingTop: '12px' 
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: isSelected ? '#94a3b8' : '#64748b', marginBottom: '3px', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.02em' }}>Logs</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: isSelected ? '#ffffff' : '#0f172a', lineHeight: '1' }}>{eventCount}</div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div style={{ fontSize: '10px', color: isSelected ? '#94a3b8' : '#64748b', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.02em', marginBottom: '1px' }}>Last Activity</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: isSelected ? '#ffffff' : '#1e293b', lineHeight: '1.2' }}>
                    {displayTime}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '800', 
                    color: isSelected ? '#cbd5e1' : '#000000',
                    lineHeight: '1.2'
                  }}>
                    {displayDate}
                  </div>
                </div>
              </div>

            </div>
          );
        })}

        {sessions.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px', fontSize: '13px' }}>
            No records tracked inside system memory.
          </div>
        )}
      </div>

    </div>
  );
}