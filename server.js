import express from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// All sample programme data is intentionally hard-coded in this file.
const programmeName = 'Ada Study Programme';
const courses = [
  { id: 1, title: 'Introduction to Web Development', credits: 5 },
  { id: 2, title: 'Programming with JavaScript', credits: 6 },
  { id: 3, title: 'Backend Development Fundamentals', credits: 5 }
];

let requestCount = 0;

// Middleware 1: log each incoming request, then continue to the next handler.
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
}

// Middleware 2: count every request that reaches the application.
function requestCounter(req, res, next) {
  requestCount += 1;
  next();
}

// Middleware order: log first, count second, then serve static files and routes.
app.use(requestLogger);
app.use(requestCounter);
app.use(express.static(join(currentDirectory, 'public')));

app.get('/hello', (req, res) => {
  res.type('text').send(`Hello from ${programmeName} server`);
});

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow:');
});

app.get('/old-page', (req, res) => {
  res.redirect(301, '/hello');
});

app.get('/api/courses', (req, res) => {
  res.status(200).json(courses);
});

app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'running',
    process: process.pid,
    uptimeSeconds: Number(process.uptime().toFixed(2))
  });
});

app.get('/api/headers', (req, res) => {
  res.status(200).json({
    'user-agent': req.get('User-Agent') ?? null,
    accept: req.get('Accept') ?? null
  });
});

app.post('/api/subscribe', (req, res) => {
  // The assignment does not require reading or parsing the request body.
  res.status(201).json({ subscribed: true });
});

app.get('/api/admin', (req, res) => {
  res.status(403).json({ error: 'Forbidden' });
});

app.get('/api/stats', (req, res) => {
  res.status(200).json({ requestsServed: requestCount });
});

// Keep the fallback after every real route so it cannot intercept valid paths.
app.use((req, res) => {
  if (req.path === '/api' || req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.status(404).type('html').send(
    '<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Page not found</title></head><body><h1>404 - Page not found</h1><p>The requested page does not exist.</p><a href="/">Return home</a></body></html>'
  );
});

app.listen(PORT, () => {
  console.log(`${programmeName} server is running at http://localhost:${PORT}`);
});
