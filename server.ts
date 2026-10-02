import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Configurable backend URL with default to http://127.0.0.1:8000
const SILA_BACKEND_URL = process.env.SILA_BACKEND_URL || 'http://127.0.0.1:8000';

/**
 * Health check proxy
 * Forwards to ${SILA_BACKEND_URL}/health
 * Returns clean status: Connected / Unavailable, Loaded / Unavailable
 */
app.get('/api/sila/health', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const backendRes = await fetch(`${SILA_BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const data = await backendRes.json().catch(() => ({}));
      // Check if backend reported health. If connected and not explicitly unloaded, model is Loaded
      const isModelLoaded = !(data.model_loaded === false || data.model === 'unloaded' || data.model_status === 'unloaded');

      return res.json({
        connected: true,
        modelLoaded: isModelLoaded,
        statusText: 'Connected',
        modelText: isModelLoaded ? 'Loaded' : 'Not Loaded',
        backendUrl: SILA_BACKEND_URL,
        data,
      });
    } else {
      return res.status(503).json({
        connected: false,
        modelLoaded: false,
        statusText: 'Unavailable',
        modelText: 'Unavailable',
        error: 'Backend returned HTTP ' + backendRes.status,
      });
    }
  } catch (err: any) {
    return res.status(503).json({
      connected: false,
      modelLoaded: false,
      statusText: 'Unavailable',
      modelText: 'Unavailable',
      error: 'Backend unavailable',
    });
  }
});

/**
 * Scenario Execution Proxy
 * POST /api/sila/run-scenario
 * Forwards request body to Python scenario backend.
 * Does not alter the backend response structure.
 * Does not create mock responses when the backend is unavailable.
 */
app.post('/api/sila/run-scenario', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    // First attempt: POST ${SILA_BACKEND_URL}/run-scenario
    let backendRes = await fetch(`${SILA_BACKEND_URL}/run-scenario`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    }).catch(() => null);

    // If 404, fallback attempt: POST ${SILA_BACKEND_URL}/api/sila/run-scenario
    if (backendRes && backendRes.status === 404) {
      backendRes = await fetch(`${SILA_BACKEND_URL}/api/sila/run-scenario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(req.body),
        signal: controller.signal,
      }).catch(() => null);
    }

    clearTimeout(timeoutId);

    if (!backendRes) {
      return res.status(503).json({
        error: 'Backend unavailable',
        message: `Could not connect to SILA scenario backend at ${SILA_BACKEND_URL}`,
      });
    }

    // If 401 returned from internal container control-plane on port 8000
    if (backendRes.status === 401) {
      return res.status(503).json({
        error: 'Backend unavailable',
        message: `Local Python scenario backend is not reachable on ${SILA_BACKEND_URL}. Please ensure your Python server is running.`,
      });
    }

    // Pass through exact response code and body structure
    const contentType = backendRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await backendRes.json();
      return res.status(backendRes.status).json(data);
    } else {
      const text = await backendRes.text();
      return res.status(backendRes.status).send(text);
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        error: 'Timeout',
        message: 'Scenario execution timed out after 15 seconds',
      });
    }
    return res.status(503).json({
      error: 'Backend unavailable',
      message: 'Failed to connect to SILA scenario backend',
    });
  }
});

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

async function start() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`SILA Application Server listening on http://${HOST}:${PORT}`);
    console.log(`Forwarding SILA scenario requests to ${SILA_BACKEND_URL}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
