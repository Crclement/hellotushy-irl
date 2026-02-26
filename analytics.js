// TUSHY Analytics - lightweight page view tracking via JSONBlob
(function() {
  var ANALYTICS_BLOB = '019c9a55-618a-7306-a12f-aa09e40c52ee';
  var VID_KEY = 'tushy_visitor_id';
  var API = 'https://jsonblob.com/api/jsonBlob/' + ANALYTICS_BLOB;

  // Get or create persistent visitor ID
  var vid = localStorage.getItem(VID_KEY);
  if (!vid) {
    vid = Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
    localStorage.setItem(VID_KEY, vid);
  }

  var isEmbed = new URLSearchParams(window.location.search).get('embed') === '1';

  var view = {
    p: location.pathname.split('/').pop() || 'index.html',
    h: location.hash || null,
    t: new Date().toISOString(),
    v: vid,
    r: document.referrer || null,
    s: screen.width + 'x' + screen.height,
    e: isEmbed
  };

  // Don't double-track embeds (the parent page already tracks)
  if (isEmbed) return;

  // Load current data, append view, save back
  fetch(API)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      data.views = data.views || [];
      data.views.push(view);
      // Cap at 5000 entries to prevent blob from growing too large
      if (data.views.length > 5000) {
        data.views = data.views.slice(-5000);
      }
      return fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    })
    .catch(function() {});
})();
