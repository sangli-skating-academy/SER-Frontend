// Simple test page to check if the keep-alive is working
export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html");

  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Keep-Alive Status</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
        button:hover { background: #0056b3; }
        pre { background: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔄 Keep-Alive Monitor</h1>
        <p>This page helps you test and monitor the keep-alive functionality for your Render backend.</p>
        
        <div class="status info">
            <strong>Backend URL:</strong> https://ser-backend-cjdn.onrender.com
        </div>
        
        <div>
            <button onclick="testKeepAlive()">🧪 Test Keep-Alive</button>
            <button onclick="testBackendDirect()">🎯 Test Backend Direct</button>
            <button onclick="clearResults()">🗑️ Clear Results</button>
        </div>
        
        <div id="results"></div>
        
        <div class="status info">
            <h3>📋 How it works:</h3>
            <ul>
                <li>Vercel cron job runs every 10 minutes</li>
                <li>Calls <code>/api/keep-alive</code> endpoint</li>
                <li>Pings your Render backend's <code>/health</code> endpoint</li>
                <li>Prevents Render from spinning down your free-tier backend</li>
            </ul>
        </div>
        
        <div class="status info">
            <h3>🔍 Monitoring:</h3>
            <ul>
                <li>Check Vercel Function logs in your dashboard</li>
                <li>Monitor Render service logs for health check requests</li>
                <li>Use this page to manually test functionality</li>
            </ul>
        </div>
    </div>

    <script>
        async function testKeepAlive() {
            addResult('info', '🔄 Testing keep-alive endpoint...');
            try {
                const response = await fetch('/api/keep-alive');
                const data = await response.json();
                
                if (response.ok) {
                    addResult('success', '✅ Keep-alive successful!', data);
                } else {
                    addResult('error', '❌ Keep-alive failed', data);
                }
            } catch (error) {
                addResult('error', '❌ Keep-alive error: ' + error.message);
            }
        }
        
        async function testBackendDirect() {
            addResult('info', '🎯 Testing backend directly...');
            try {
                const response = await fetch('https://ser-backend-cjdn.onrender.com/health');
                const data = await response.json();
                
                if (response.ok) {
                    addResult('success', '✅ Backend is healthy!', data);
                } else {
                    addResult('error', '❌ Backend returned non-200 status', data);
                }
            } catch (error) {
                addResult('error', '❌ Backend error: ' + error.message);
            }
        }
        
        function addResult(type, message, data = null) {
            const results = document.getElementById('results');
            const div = document.createElement('div');
            div.className = 'status ' + type;
            
            let content = '<strong>' + new Date().toLocaleTimeString() + '</strong>: ' + message;
            if (data) {
                content += '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            }
            
            div.innerHTML = content;
            results.insertBefore(div, results.firstChild);
        }
        
        function clearResults() {
            document.getElementById('results').innerHTML = '';
        }
        
        // Auto-test on page load
        window.onload = function() {
            addResult('info', '📊 Keep-Alive Monitor loaded. Click buttons to test functionality.');
        };
    </script>
</body>
</html>
  `;

  res.status(200).send(html);
}
