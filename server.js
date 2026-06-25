const express = require('express');
const app = express();
const PLATFORM = process.env.PLATFORM || 'unset';
const BACKEND_URL = process.env.BACKEND_URL || '';

app.get('/health', (_req, res) => res.status(200).send('ok'));

// Catch-all: render an HTML page that shows which platform/instance served
// the FE, the preserved path, and live-calls the backend so we can see which
// backend (Render vs CD) the FE reaches.
app.all('*', (req, res) => {
  res.send(`<!doctype html>
<html><head><meta charset="utf-8"><title>proxy-test FE [${PLATFORM}]</title></head>
<body style="font-family:system-ui;max-width:680px;margin:40px auto">
  <h1>Frontend &mdash; platform: <code>${PLATFORM}</code></h1>
  <ul>
    <li>host: <code>${req.headers.host}</code></li>
    <li>path: <code>${req.originalUrl}</code></li>
    <li>backend: <code>${BACKEND_URL || '(unset)'}</code></li>
  </ul>
  <pre id="out">calling backend&hellip;</pre>
  <script>
    fetch(${JSON.stringify(BACKEND_URL)} + '/api/whoami')
      .then(function (r) { return r.json(); })
      .then(function (d) { document.getElementById('out').textContent = JSON.stringify(d, null, 2); })
      .catch(function (e) { document.getElementById('out').textContent = 'backend error: ' + e; });
  </script>
</body></html>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`[frontend] platform=${PLATFORM} listening on :${port}`));
