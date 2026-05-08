/**
 * Production server
 * – Mounts the question-editor API at /qeditor  (same path the frontend calls)
 * – Serves the built React app (dist/) with proper caching
 * – Falls back to index.html for all non-asset, non-API paths (SPA routing)
 */

'use strict';

const express = require('express');
const path    = require('path');
const fs      = require('fs');
const zlib    = require('zlib');

const PORT     = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// ─── Question-editor API ──────────────────────────────────────────────────────
const questionEditorRouter = require('./question-editor-api');

const app = express();

// Mount question-editor routes at /qeditor — Express strips the prefix,
// so /qeditor/api/solutions → router.get('/api/solutions', ...)
app.use('/qeditor', questionEditorRouter);

// ─── Static file helpers ──────────────────────────────────────────────────────

const MIME_TYPES = {
  '.html': 'text/html',
  '.js':   'text/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.woff':  'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf':   'application/font-ttf',
  '.eot':   'application/vnd.ms-fontobject',
  '.otf':   'application/font-otf',
  '.wasm':  'application/wasm',
  '.webmanifest': 'application/manifest+json',
  '.pdf':  'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.doc':  'application/msword',
};

const IMMUTABLE_MAX_AGE = 31536000; // 1 year
const STATIC_MAX_AGE    = 604800;   // 1 week

const isImmutableAsset = filePath => /\.[0-9a-f]{8,}\./i.test(path.basename(filePath));

function getCacheControl(filePath) {
  const name = path.basename(filePath);
  const ext  = path.extname(filePath).toLowerCase();

  if (name === 'index.html' || name === 'web-app-version.json') return 'no-cache, no-store, must-revalidate';
  if (ext === '.webmanifest') return 'no-cache';
  if (isImmutableAsset(filePath)) return `public, max-age=${IMMUTABLE_MAX_AGE}, immutable`;
  if (['.js', '.css', '.png', '.jpg', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.eot', '.otf', '.wasm'].includes(ext)) {
    return `public, max-age=${STATIC_MAX_AGE}`;
  }
  return 'no-cache';
}

function sendFile(req, res, filePath) {
  const ext         = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const headers = {
    'Content-Type':  contentType,
    'Cache-Control': getCacheControl(filePath),
    'Vary':          'Accept-Encoding',
  };

  if (['.pdf', '.docx', '.doc'].includes(ext)) {
    headers['Content-Disposition'] = `attachment; filename="${path.basename(filePath)}"`;
  }

  const acceptEncoding = req.headers['accept-encoding'] || '';
  let compressionStream = null;
  if (acceptEncoding.includes('br')) {
    headers['Content-Encoding'] = 'br';
    compressionStream = zlib.createBrotliCompress();
  } else if (acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    compressionStream = zlib.createGzip();
  }

  res.writeHead(200, headers);
  const fileStream = fs.createReadStream(filePath);
  fileStream.on('error', () => { if (!res.headersSent) res.writeHead(500); res.end('Server Error'); });

  if (compressionStream) {
    fileStream.pipe(compressionStream).pipe(res);
  } else {
    fileStream.pipe(res);
  }
}

// ─── SPA static serving ───────────────────────────────────────────────────────

app.use((req, res) => {
  console.log(`${req.method} ${req.url}`);

  const urlPath  = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  let filePath   = path.join(DIST_DIR, urlPath.startsWith('/') ? urlPath.slice(1) : urlPath);
  filePath       = path.normalize(filePath);

  // Directory traversal guard
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (statErr, stats) => {
    if (!statErr && stats.isFile()) return sendFile(req, res, filePath);

    // SPA fallback
    const indexPath = path.join(DIST_DIR, 'index.html');
    fs.stat(indexPath, (indexErr, indexStats) => {
      if (indexErr || !indexStats.isFile()) { res.writeHead(404); return res.end('Not found'); }
      sendFile(req, res, indexPath);
    });
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${DIST_DIR}`);
  console.log(`Question-editor API available at /qeditor/api/*`);
});
