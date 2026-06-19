import React, { useState, useEffect } from 'react';

export default function HeatmapView({ uniqueUrls, selectedUrl, setSelectedUrl, allSessions = [], sessionEvents = [], selectedSessionId }) {
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    // If a specific session is selected, filter clicks only from that session's active events
    if (selectedSessionId && sessionEvents.length > 0) {
      const activeClicks = sessionEvents.filter(e => {
        const isClick = e.event_type?.toLowerCase() === 'click' || e.eventType?.toLowerCase() === 'click';
        const matchesUrl = selectedUrl ? (e.url === selectedUrl || e.pageUrl === selectedUrl) : true;
        return isClick && matchesUrl;
      });
      setClicks(activeClicks);
    } 
    // Fallback: If no session is selected but a global URL is chosen, filter from all loaded sessions
    else if (selectedUrl && allSessions.length > 0) {
      const globalClicks = [];
      allSessions.forEach(session => {
        if (session.events) {
          session.events.forEach(e => {
            const isClick = e.event_type?.toLowerCase() === 'click' || e.eventType?.toLowerCase() === 'click';
            if (isClick && (e.url === selectedUrl || e.pageUrl === selectedUrl)) {
              globalClicks.push(e);
            }
          });
        }
      });
      setClicks(globalClicks);
    } else {
      setClicks([]);
    }
  }, [selectedUrl, sessionEvents, allSessions, selectedSessionId]);

  const getHeatStyle = (currentClick, allClicks) => {
    const currentX = currentClick.click_data?.x ?? currentClick.x ?? 0;
    const currentY = currentClick.click_data?.y ?? currentClick.y ?? 0;
    
    const neighborhoodRadius = 30;
    const nearbyClicksCount = allClicks.filter(c => {
      const x = c.click_data?.x ?? c.x ?? 0;
      const y = c.click_data?.y ?? c.y ?? 0;
      const distance = Math.sqrt(Math.pow(x - currentX, 2) + Math.pow(y - currentY, 2));
      return distance <= neighborhoodRadius;
    }).length;

    if (nearbyClicksCount >= 5) {
      return 'radial-gradient(circle, rgba(255, 0, 0, 1) 0%, rgba(255, 0, 0, 0.5) 50%, rgba(255, 0, 0, 0) 100%)';
    } else if (nearbyClicksCount >= 3) {
      return 'radial-gradient(circle, rgba(255, 165, 0, 1) 0%, rgba(255, 215, 0, 0.6) 50%, rgba(255, 215, 0, 0) 100%)';
    } else {
      return 'radial-gradient(circle, rgba(0, 122, 255, 0.9) 0%, rgba(0, 122, 255, 0.4) 50%, rgba(0, 122, 255, 0) 100%)';
    }
  };

  const getAdvancedBehavioralMetrics = () => {
    if (clicks.length === 0) {
      return { total: 0, uniqueSessions: 0, hotSpot: 'N/A', engagementScore: 0, engagementStatus: 'Low', deadClicks: 0, rageClicks: 0, recommendations: [] };
    }

    const sessionSet = new Set();
    let maxNearby = 0;
    let bestX = 0;
    let bestY = 0;
    let deadClicksCount = 0;
    let rageClicksCount = 0;

    const chronologicalClicks = [...clicks].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    chronologicalClicks.forEach((c, i) => {
      const sessionId = c.session_id || c.sessionId || selectedSessionId;
      if (sessionId) sessionSet.add(sessionId);

      const cx = c.click_data?.x ?? c.x ?? 0;
      const cy = c.click_data?.y ?? c.y ?? 0;

      const neighborhood = chronologicalClicks.filter(other => {
        const ox = other.click_data?.x ?? other.x ?? 0;
        const oy = other.click_data?.y ?? other.y ?? 0;
        return Math.sqrt(Math.pow(ox - cx, 2) + Math.pow(oy - cy, 2)) <= 30;
      });

      if (neighborhood.length > maxNearby) {
        maxNearby = neighborhood.length;
        bestX = cx;
        bestY = cy;
      }

      let spatialMatches = 0;
      let rapidTimeMatches = 0;

      for (let j = i + 1; j < chronologicalClicks.length; j++) {
        const nextX = chronologicalClicks[j].click_data?.x ?? chronologicalClicks[j].x ?? 0;
        const nextY = chronologicalClicks[j].click_data?.y ?? chronologicalClicks[j].y ?? 0;
        const dist = Math.sqrt(Math.pow(nextX - cx, 2) + Math.pow(nextY - cy, 2));

        if (dist <= 20) {
          spatialMatches++;
          const timeDelta = Math.abs(new Date(chronologicalClicks[j].timestamp) - new Date(c.timestamp)) / 1000;
          if (timeDelta <= 1.0) {
            rapidTimeMatches++;
          }
        }
      }

      if (spatialMatches >= 3) deadClicksCount++;
      if (rapidTimeMatches >= 2) rageClicksCount++;
    });

    const rawScore = (clicks.length * 4) + (maxNearby * 5) - (deadClicksCount * 10) - (rageClicksCount * 15);
    const engagementScore = Math.max(0, Math.min(100, rawScore));

    let engagementStatus = 'Low';
    if (engagementScore >= 75) engagementStatus = 'High';
    else if (engagementScore >= 40) engagementStatus = 'Medium';

    const hotspotPercentage = clicks.length > 0 ? Math.round((maxNearby / clicks.length) * 100) : 0;

    const recommendations = [];
    if (maxNearby > 0) {
      recommendations.push(` ${hotspotPercentage}% of clicks occurred near (${bestX}px, ${bestY}px). Consider placing primary actions in this region.`);
    }
    if (deadClicksCount > 0) {
      recommendations.push(` Detected multiple repetitive interaction anomalies. Review structural elements near hotzones to clear unmapped click paths.`);
    }
    if (rageClicksCount > 0) {
      recommendations.push(`Add-Content .gitignore "node_modules/" Rapid burst actions identified. Verify response loop performance values or check responsive padding rules.`);
    }

    return {
      total: clicks.length,
      uniqueSessions: sessionSet.size || 1,
      hotSpot: maxNearby > 0 ? `(${bestX}px, ${bestY}px)` : 'N/A',
      engagementScore,
      engagementStatus,
      deadClicks: deadClicksCount,
      rageClicks: rageClicksCount,
      recommendations
    };
  };

  const metrics = getAdvancedBehavioralMetrics();

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Page Click Heatmap</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Page URL:</label>
          <select 
            value={selectedUrl} 
            onChange={(e) => setSelectedUrl(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '300px' }}
          >
            <option value="">-- Choose a Tracked Page --</option>
            {uniqueUrls.map((url, idx) => (
              <option key={idx} value={url}>{url}</option>
            ))}
          </select>
        </div>

        {selectedUrl && clicks.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f5f5f5', padding: '8px 15px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <span style={{ fontSize: '12px', color: '#007aff', fontWeight: 'bold' }}>Low (Blue)</span>
            <span style={{ fontSize: '12px', color: '#ccc' }}>→</span>
            <span style={{ fontSize: '12px', color: '#ff9500', fontWeight: 'bold' }}>Medium (Yellow)</span>
            <span style={{ fontSize: '12px', color: '#ccc' }}>→</span>
            <span style={{ fontSize: '12px', color: '#ff3b30', fontWeight: 'bold' }}>High Activity (Red)</span>
          </div>
        )}
      </div>

      {selectedUrl && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginBottom: '20px', background: '#ffffff', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Total Clicks</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2d3748' }}>{metrics.total}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Engagement Score</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3182ce' }}>
              {metrics.engagementScore}/100 <span style={{ fontSize: '12px', fontWeight: '500', color: '#718096' }}>({metrics.engagementStatus})</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Top Hotspot</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a202c' }}>{metrics.hotSpot}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Potential Dead Clicks</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: metrics.deadClicks > 0 ? '#dd6b20' : '#718096' }}>{metrics.deadClicks}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#718096', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Potential Rage Clicks</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: metrics.rageClicks > 0 ? '#e53e3e' : '#718096' }}>{metrics.rageClicks}</div>
          </div>
        </div>
      )}

      {selectedUrl && metrics.recommendations.length > 0 && (
        <div style={{ backgroundColor: '#ebf8ff', border: '1px solid #bee3f8', borderRadius: '8px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2b6cb0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Smart UI Insights & Recommendations</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#2c5282', fontSize: '13px', lineHeight: '1.6' }}>
            {metrics.recommendations.map((rec, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {selectedUrl && (
        <div style={{ position: 'relative', width: '100%', height: '600px', border: '2px dashed #ccc', borderRadius: '8px', backgroundColor: '#fff', overflow: 'auto', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' }}>
          {clicks.map((click, index) => {
            const xPos = click.click_data?.x ?? click.x ?? 0;
            const yPos = click.click_data?.y ?? click.y ?? 0;
            const dynamicGradient = getHeatStyle(click, clicks);

            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${xPos}px`,
                  top: `${yPos}px`,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: dynamicGradient,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none'
                }}
              />
            );
          })}

          {clicks.length === 0 && (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '250px' }}>
              No click events captured for this selection.
            </div>
          )}
        </div>
      )}
    </div>
  );
}