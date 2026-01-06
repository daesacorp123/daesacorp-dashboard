// server-final.js - Simple HTTP Server untuk DaeSaCorp
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`📡 ${req.method} ${req.url}`);
    
    // API Endpoints
    if (req.url === '/api/dashboard' && req.method === 'GET') {
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        
        const data = {
            website: { 
                status: "active", 
                visitors: 1245 + Math.floor(Math.random() * 100),
                conversion: 3.17,
                uptime: "99.8%"
            },
            googleAds: { 
                status: "active", 
                clicks: 890 + Math.floor(Math.random() * 50),
                impressions: 24500 + Math.floor(Math.random() * 1000),
                cost: 1250000,
                conversions: 45 + Math.floor(Math.random() * 5)
            },
            metaAds: { 
                status: "inactive", 
                reach: 0,
                engagement: 0,
                cost: 0,
                conversions: 0
            },
            overall: {
                performance: "BBR1 - " + (3.17 + Math.random() * 0.5).toFixed(2) + "%",
                revenue: 28500000,
                roi: 228
            },
            timestamp: new Date().toISOString()
        };
        
        res.end(JSON.stringify(data));
        return;
    }
    
    if (req.url === '/api/test') {
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
            success: true, 
            message: "API Works!",
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    if (req.url.startsWith('/api/search')) {
        const urlParams = new URL(req.url, `http://${req.headers.host}`);
        const query = urlParams.searchParams.get('q') || '';
        
        res.writeHead(200, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        
        const results = [];
        if (query.toLowerCase().includes('google')) {
            results.push({ type: 'google_ads', name: 'Google Ads' });
        }
        if (query.toLowerCase().includes('meta') || query.toLowerCase().includes('facebook')) {
            results.push({ type: 'meta_ads', name: 'Meta Ads' });
        }
        if (query.toLowerCase().includes('website') || query.toLowerCase().includes('web')) {
            results.push({ type: 'website', name: 'Website' });
        }
        
        res.end(JSON.stringify({
            success: true,
            query: query,
            results: results,
            count: results.length,
            timestamp: new Date().toISOString()
        }));
        return;
    }
    
    if (req.url === '/api/toggle' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({
                success: true,
                message: "Status updated successfully",
                timestamp: new Date().toISOString()
            }));
        });
        return;
    }
    
    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }
    
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch(extname) {
        case '.css': contentType = 'text/css'; break;
        case '.js': contentType = 'application/javascript'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpeg'; break;
        case '.ico': contentType = 'image/x-icon'; break;
    }
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found, serve index.html
                fs.readFile('./index.html', (err, html) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 Not Found</h1>');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(html);
                    }
                });
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║         🚀 DaeSaCorp Dashboard            ║');
    console.log('╠════════════════════════════════════════════╣');
    console.log(`║     🌐 http://localhost:${PORT}            ║`);
    console.log('╠════════════════════════════════════════════╣');
    console.log('║ 📊 API Endpoints:                          ║');
    console.log('║   GET  /api/dashboard - Dashboard data     ║');
    console.log('║   POST /api/toggle    - Toggle service     ║');
    console.log('║   GET  /api/search?q= - Search data        ║');
    console.log('╠════════════════════════════════════════════╣');
    
    // Check files
    const files = ['index.html'];
    let allFilesExist = true;
    
    files.forEach(file => {
        const exists = fs.existsSync(file);
        const status = exists ? '✅' : '❌';
        console.log(`║   ${status} ${file.padEnd(30)} ║`);
        if (!exists) allFilesExist = false;
    });
    
    console.log('╚════════════════════════════════════════════╝');
    
    if (allFilesExist) {
        console.log('\n✨ Semua file siap! Buka http://localhost:3000');
    } else {
        console.log('\n⚠️  Beberapa file tidak ditemukan!');
    }
});