// TUSHY Analytics - lightweight page view tracking via JSONBlob
(function() {
  var ANALYTICS_BLOB = '019c9a55-618a-7306-a12f-aa09e40c52ee';
  var VID_KEY = 'tushy_visitor_id';
  var API = 'https://jsonblob.com/api/jsonBlob/' + ANALYTICS_BLOB;

  // Don't double-track embeds (the parent page already tracks)
  var isEmbed = new URLSearchParams(window.location.search).get('embed') === '1';
  if (isEmbed) return;

  // Get or create persistent visitor ID (try/catch for restricted contexts)
  var vid;
  try {
    vid = localStorage.getItem(VID_KEY);
    if (!vid) {
      vid = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(VID_KEY, vid);
    }
  } catch(e) {
    vid = 'anon-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }

  var view = {
    p: location.pathname.split('/').pop() || 'index.html',
    h: location.hash || null,
    t: new Date().toISOString(),
    v: vid,
    r: document.referrer || null,
    s: screen.width + 'x' + screen.height
  };

  // Load current data, append view, save back
  fetch(API)
    .then(function(r) {
      if (!r.ok) throw new Error('GET failed: ' + r.status);
      return r.json();
    })
    .then(function(data) {
      var views = Array.isArray(data.views) ? data.views : [];
      views.push(view);
      // Cap at 5000 entries to prevent blob from growing too large
      if (views.length > 5000) {
        views = views.slice(-5000);
      }
      return fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ views: views })
      });
    })
    .catch(function(e) { console.warn('Analytics:', e); });
})();
