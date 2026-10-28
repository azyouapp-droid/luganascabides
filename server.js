const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.txt': 'text/plain; charset=utf-8'
};

function serveFile(req, res) {
  try {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname.endsWith('/')) {
      pathname += 'index.html';
    }

    const safePath = path.normalize(path.join(BASE_DIR, pathname));

    // Prevent directory traversal attacks
    if (!safePath.startsWith(BASE_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(safePath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`500 Internal Server Error: ${err.message}`);
        }
        return;
      }

      let filePathToServe = safePath;
      if (stats.isDirectory()) {
        filePathToServe = path.join(safePath, 'index.html');
      }

      const ext = path.extname(filePathToServe).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      const stream = fs.createReadStream(filePathToServe);
      stream.on('open', () => {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
      });
      stream.on('error', (streamErr) => {
        if (!res.headersSent) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        }
        res.end('File not found');
      });
      stream.pipe(res);
    });
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
  }
}

function startServer(port) {
  const server = http.createServer(serveFile);

  server.listen(port, () => {
    console.log(`\n========================================`);
    console.log(`  🚀 Servidor rodando com sucesso!`);
    console.log(`  Local:   http://localhost:${port}`);
    console.log(`========================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Porta ${port} em uso. Tentando porta ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Erro no servidor:', err);
    }
  });
}

startServer(DEFAULT_PORT);
