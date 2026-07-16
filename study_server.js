const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;

// MIME types for file serving
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
    // Enable CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Route: API Verification Handler
    if (req.method === 'POST' && req.url === '/api/verify') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                const tool = payload.tool;
                verifyEnvironment(tool, (status, output) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ tool, status, output }));
                });
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Invalid JSON payload');
            }
        });
        return;
    }

    // Default: Static File Server
    if (req.method === 'GET') {
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        
        // Safety check to prevent directory traversal
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File Not Found');
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${err.code}`);
                }
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }
});

function verifyEnvironment(tool, callback) {
    let command = '';
    
    switch (tool) {
        case 'git':
            command = 'git --version';
            break;
        case 'docker':
            // Check CLI and then check if daemon runs (Windows compatible check)
            command = 'docker --version && docker info';
            break;
        case 'aws':
            command = 'aws --version && aws sts get-caller-identity';
            break;
        case 'python':
            command = 'python --version';
            break;
        default:
            return callback('failed', 'Unknown diagnostic target');
    }

    exec(command, (error, stdout, stderr) => {
        // Output compilation
        const output = (stdout + '\n' + stderr).trim();
        
        if (error) {
            // Check specifically for AWS configuration issue vs AWS CLI not installed
            if (tool === 'aws' && output.includes('aws --version')) {
                return callback('failed', `AWS CLI is installed, but credentials are unauthenticated. Run 'aws configure' in your terminal.\n\nDetails:\n${output}`);
            }
            if (tool === 'docker' && output.includes('docker --version')) {
                return callback('failed', `Docker CLI is installed, but the Docker daemon is stopped or unreachable.\n\nDetails:\n${output}`);
            }
            return callback('failed', `Check failed:\n${output || 'Command not found in system PATH.'}`);
        }
        
        return callback('success', `Verification Success!\n\n${output}`);
    });
}

server.listen(PORT, () => {
    console.log(`Study Server running at http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server.`);
});
