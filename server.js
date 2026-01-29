const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3002;

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NodeBase</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      background-color: #f5f5f5;
      padding: 2rem;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #333;
      margin-bottom: 1rem;
    }
    
    p {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    
    .button {
      display: inline-block;
      padding: 10px 20px;
      margin-right: 10px;
      margin-bottom: 10px;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 150ms ease-in-out;
      font-size: 14px;
    }
    
    .button-primary {
      background-color: #f97316;
      color: white;
    }
    
    .button-primary:hover {
      background-color: #ea580c;
      opacity: 0.9;
    }
    
    .button-secondary {
      background-color: #3b82f6;
      color: white;
    }
    
    .button-secondary:hover {
      background-color: #2563eb;
      opacity: 0.9;
    }
    
    .button-destructive {
      background-color: #ef4444;
      color: white;
    }
    
    .button-destructive:hover {
      background-color: #dc2626;
      opacity: 0.9;
    }
    
    .status {
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 6px;
      background-color: #f0fdf4;
      color: #166534;
      border-left: 4px solid #22c55e;
    }
    
    .error-status {
      background-color: #fef2f2;
      color: #991b1b;
      border-left-color: #ef4444;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 NodeBase</h1>
    <p>Welcome to your application! This is a temporary server running while dependencies install.</p>
    
    <div class="status">
      ✅ Server is running on http://localhost:3000
    </div>
    
    <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Actions</h2>
    <button class="button button-secondary" onclick="testAI()">🤖 Test AI</button>
    <button class="button button-secondary" onclick="createWorkflow()">➕ Create Workflow</button>
    <button class="button button-destructive" onclick="logout()">🚪 Logout</button>
    
    <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Status</h2>
    <p id="status" style="color: #666;">Initializing application...</p>
    
    <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Available Routes</h2>
    <ul style="color: #666; line-height: 1.8;">
      <li><strong>/</strong> - Home page (you are here)</li>
      <li><strong>/api/inngest</strong> - Inngest webhook</li>
      <li><strong>/auth/login</strong> - Login page</li>
      <li><strong>/auth/signup</strong> - Signup page</li>
    </ul>
  </div>
  
  <script>
    function testAI() {
      document.getElementById('status').textContent = '🤖 Triggering AI test event...';
      fetch('/api/inngest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { email: 'test@example.com' },
          name: 'execute/ai'
        })
      }).then(() => {
        document.getElementById('status').textContent = '✅ AI test event sent! Check http://localhost:8288/runs';
      }).catch(e => {
        document.getElementById('status').textContent = '❌ Error: ' + e.message;
      });
    }
    
    function createWorkflow() {
      document.getElementById('status').textContent = '➕ Creating workflow event...';
      fetch('/api/inngest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { email: 'test@example.com' },
          name: 'test/hello.world'
        })
      }).then(() => {
        document.getElementById('status').textContent = '✅ Workflow event sent! Check http://localhost:8288/runs';
      }).catch(e => {
        document.getElementById('status').textContent = '❌ Error: ' + e.message;
      });
    }
    
    function logout() {
      document.getElementById('status').textContent = '🚪 Logging out...';
      fetch('/api/auth/logout', { method: 'POST' })
        .then(() => {
          document.getElementById('status').textContent = '✅ Logged out! Redirecting...';
          setTimeout(() => location.href = '/auth/login', 1000);
        })
        .catch(e => {
          document.getElementById('status').textContent = '❌ Error: ' + e.message;
        });
    }
    
    // Update status
    setTimeout(() => {
      document.getElementById('status').textContent = '✅ Application ready! The full Next.js app will load once dependencies are installed.';
    }, 500);
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Serve home page
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }
  
  // Proxy API requests to Next.js dev server if it's running on 3001
  if (req.url.startsWith('/api/') || req.url.startsWith('/auth/')) {
    const proxyReq = http.request({
      hostname: 'localhost',
      port: 3001,
      path: req.url,
      method: req.method,
      headers: req.headers
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    proxyRes.on('error', () => {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'API server not available' }));
    });
    
    req.pipe(proxyReq);
    return;
  }
  
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`✅ Temporary server running at http://localhost:${PORT}`);
  console.log(`⏳ Full Next.js app will be available once dependencies install...`);
  console.log(`📱 Inngest dev server: http://localhost:8288`);
});
