const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
http.createServer((req, res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); return res.end(); }
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep) || path.relative(root, file).split(path.sep).some(part => part.startsWith('.')) || !mime[path.extname(file)]) {
    res.writeHead(404); return res.end('Página não encontrada');
  }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); return res.end('Página não encontrada'); }
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)], 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => console.log('Luganas: http://127.0.0.1:' + (process.env.PORT || 4173)));
