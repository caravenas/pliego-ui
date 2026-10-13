// Sirve storybook-static para las pruebas de navegador. Solo Node, sin
// dependencias: lo lanza `webServer` en playwright.config.ts.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'storybook-static');
const port = Number(process.env.PORT ?? 6007);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    // normalize + comprobación de prefijo: ninguna ruta sale de `root`.
    let file = join(root, normalize(decodeURIComponent(url.pathname)));
    if (!file.startsWith(root)) throw Object.assign(new Error('fuera de la raíz'), { code: 'ENOENT' });
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('no encontrado');
  }
}).listen(port, '127.0.0.1', () => console.log(`storybook-static en http://127.0.0.1:${port}`));
