(function () {
  let sessionId = localStorage.getItem('cf_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('cf_session_id', sessionId);
  }

  const API_URL = 'http://localhost:5000/api/track';

  function sendEvent(eventType, extraData = {}) {
    const payload = {
      session_id: sessionId,
      event_type: eventType,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      click_data: extraData
    };

    console.log("Tracker sending to API:", payload);

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error("Tracker Error:", err));
  }

  sendEvent('page_view');

  document.addEventListener('click', function (event) {
    // 1. Identify the target (and bubble up to find buttons if needed)
    let targetElement = event.target.closest('button, a, input, [id]') || event.target;
    
    let targetId = targetElement.id || '';
    let tagName = (targetElement.tagName || 'BODY').toUpperCase();
    
    // 2. Extract text, cleaning whitespace and limiting length
    let targetText = (targetElement.innerText || targetElement.value || '').replace(/\s+/g, ' ').trim().substring(0, 60);

    // 3. Fallback logic for simulator coordinates
    if (tagName === 'BODY' || (targetId === '' && targetText === '')) {
      const btnA = document.getElementById('btn-1');
      const btnB = document.getElementById('btn-2');
      
      const checkOverlap = (el, x, y) => {
        const r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      };

      if (btnA && checkOverlap(btnA, event.clientX, event.clientY)) {
        targetId = 'btn-1';
        targetText = 'Action Button A';
        tagName = 'BUTTON';
      } else if (btnB && checkOverlap(btnB, event.clientX, event.clientY)) {
        targetId = 'btn-2';
        targetText = 'Action Button B';
        tagName = 'BUTTON';
      }
    }

    console.log(`Click detected on: ${targetText || tagName}`);

    sendEvent('click', {
      x: event.pageX,
      y: event.pageY,
      window_width: window.innerWidth,
      window_height: window.innerHeight,
      targetId: targetId,
      targetText: targetText,
      tagName: tagName
    });
  });
})();