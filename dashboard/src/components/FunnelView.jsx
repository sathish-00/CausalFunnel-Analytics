import React from 'react';

export default function FunnelView({ allSessions = [] }) {
  // Debug log to see what data fields your sessions actually contain
  console.log("FunnelView received data snapshot:", allSessions);

  let step1_Landing = 0;   
  let step2_Engaged = 0;   
  let step3_Conversion = 0; 

  allSessions.forEach(session => {
    if (!session) return;

    let hasViewed = false;
    let hasClicked = false;
    let hasConverted = false;

    // 1️⃣ Extract event numbers using every possible naming variation
    const totalEvents = 
      Number(session.eventCount) || 
      Number(session.totalEvents) || 
      Number(session.count) || 
      Number(session.total_events) || 
      (session.events ? session.events.length : 0);

    const clickCount = 
      Number(session.clicksCount) || 
      Number(session.clicks) || 
      Number(session.clicks_count) || 0;

    const viewCount = 
      Number(session.pageViewsCount) || 
      Number(session.pageViews) || 
      Number(session.page_views) || 0;

    // 2️⃣ Evaluation Logic Rules
    // Step 1: Landing (If there are any events, views, or URLs recorded)
    if (totalEvents > 0 || viewCount > 0 || session.url || session.pageUrl || session.sessionId || session._id) {
      hasViewed = true;
    }
    
    // Step 2: Engagement (If there are registered clicks or the fallback calculated events)
    if (clickCount > 0 || totalEvents > 1) {
      hasClicked = true;
    }
    
    // Step 3: Conversion (Met target depth, explicitly set flag, or simulated conversion threshold)
    if (clickCount >= 2 || totalEvents >= 5 || session.converted || session.isConverted) {
      hasConverted = true;
    }

    // 3️⃣ Deep Nested Event Array Verification Layer (If present)
    if (session.events && Array.isArray(session.events)) {
      session.events.forEach(e => {
        const type = String(e.event_type || e.eventType || '').toLowerCase();
        if (type.includes('view')) hasViewed = true;
        if (type.includes('click')) {
          hasClicked = true;
          const targetId = String(e.targetId || (e.click_data && e.click_data.targetId) || e.customTargetId || '');
          if (targetId === 'btn-2' || targetId.includes('secondary') || e.y > 350) {
            hasConverted = true;
          }
        }
      });
    }

    // Increment counters sequentially
    if (hasViewed) step1_Landing++;
    if (hasViewed && hasClicked) step2_Engaged++;
    if (hasViewed && hasClicked && hasConverted) step3_Conversion++;
  });

  // Safe Math Calculations
  const landingRate = 100;
  const engagementRate = step1_Landing > 0 ? Math.round((step2_Engaged / step1_Landing) * 100) : 0;
  const conversionRate = step1_Landing > 0 ? Math.round((step3_Conversion / step1_Landing) * 100) : 0;
  
  const dropoffEngagedCount = Math.max(0, step1_Landing - step2_Engaged);
  const dropoffConversionCount = Math.max(0, step2_Engaged - step3_Conversion);

  const dropoffEngagedPercent = 100 - engagementRate;
  const dropoffConversionPercent = engagementRate - conversionRate;

  const funnelSteps = [
    { 
      title: '1. Page Discovery Landing', 
      count: step1_Landing, 
      rate: landingRate, 
      color: '#2563eb', 
      desc: 'Total user sessions arriving at monitored tracking scripts.' 
    },
    { 
      title: '2. Interaction Engagement', 
      count: step2_Engaged, 
      rate: engagementRate, 
      color: '#d97706', 
      desc: 'Users executing active coordinate clicks or canvas actions.',
      dropCount: dropoffEngagedCount,
      dropPercent: dropoffEngagedPercent
    },
    { 
      title: '3. CTA Conversion Goal', 
      count: step3_Conversion, 
      rate: conversionRate, 
      color: '#16a34a', 
      desc: 'Users completing the conversion path by firing primary action targets.',
      dropCount: dropoffConversionCount,
      dropPercent: dropoffConversionPercent
    }
  ];

  return (
    <div style={{ padding: '24px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#ffffff', minHeight: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
        <h2 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '20px', fontWeight: '700' }}>
          Conversion Funnel Analytics
        </h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
          Analyze user progression down linear navigation channels and pinpoint drop-off friction points.
        </p>
      </div>

      {/* Fallback Empty UI State */}
      {step1_Landing === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b', maxWidth: '750px', margin: '0 auto' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>No active session metric attributes found to map into funnel structures.</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Verify if the mock servers are initialized or run an action on demo.html.</p>
        </div>
      )}

      {step1_Landing > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '750px', margin: '0 auto', paddingBottom: '80px' }}>
          {funnelSteps.map((step, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              
              {idx > 0 && step.dropCount > 0 && (
                <div style={{ 
                  padding: '8px 16px', 
                  background: '#fef2f2', 
                  borderLeft: '4px solid #ef4444', 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: '#991b1b', 
                  margin: '6px 0 6px 40px', 
                  borderRadius: '0 8px 8px 0',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>🛑 User Drop-off: -{step.dropCount} profiles</span>
                  <span>({step.dropPercent}% total loss)</span>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '14px', 
                padding: '20px', 
                gap: '20px',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  backgroundColor: step.color, 
                  color: '#ffffff', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '15px', 
                  fontWeight: '800',
                  flexShrink: 0
                }}>
                  {step.rate}%
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '15px', fontWeight: '700' }}>
                    {step.title}
                  </h4>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '13px', lineHeight: '1.4' }}>
                    {step.desc}
                  </p>
                  
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', marginTop: '12px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${step.rate}%`, 
                      height: '100%', 
                      background: step.color, 
                      borderRadius: '4px', 
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }} />
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '90px', flexShrink: 0 }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', fontFamily: 'monospace' }}>
                    {step.count}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                    Profiles
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}