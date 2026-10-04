import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { DashboardDataServerService } from './server/services/dashboardDataServerService.ts';

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

// ==========================================
// PROTECTED SERVER-SIDE DATA API ENDPOINTS
// Never returns full raw datasets to browser
// ==========================================

/**
 * 1. Data Integration Audit Summary
 * Returns verification metadata, null counts, row counts, and governance items
 * without exposing raw multi-megabyte datasets to client JavaScript.
 */
app.get('/api/data/audit-summary', async (req, res) => {
  try {
    const force = req.query.force === 'true';
    const audit = await DashboardDataServerService.getAuditSummary();
    if (force) {
      await DashboardDataServerService.auditAllDatasets(true);
    }
    res.json(audit);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to perform audit', message: err.message });
  }
});

/**
 * 2. High-level dataset summary
 */
app.get('/api/data/summary', async (_req, res) => {
  try {
    const audit = await DashboardDataServerService.getAuditSummary();
    res.json({
      globalStats: audit.globalStats,
      security: audit.security,
      status: 'AVAILABLE',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve summary', message: err.message });
  }
});

/**
 * 3. Distinct markets, countries, cities, airlines, and routes
 */
app.get('/api/data/markets', async (_req, res) => {
  try {
    const markets = await DashboardDataServerService.getMarkets();
    res.json(markets);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve markets', message: err.message });
  }
});

/**
 * 4. Seasonality indices (strictly filtered by nationality or month)
 */
app.get('/api/data/seasonality', async (req, res) => {
  try {
    const nationality = req.query.nationality as string | undefined;
    const month = req.query.month as string | undefined;
    const records = await DashboardDataServerService.getSeasonality({ nationality, month });
    res.json({ records, count: records.length, filteredBy: { nationality, month } });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve seasonality', message: err.message });
  }
});

/**
 * 5. Flight market summary (filtered by route or departure country)
 */
app.get('/api/data/flight-summary', async (req, res) => {
  try {
    const routeKey = req.query.routeKey as string | undefined;
    const departureCountry = req.query.departureCountry as string | undefined;
    const month = req.query.month as string | undefined;
    const records = await DashboardDataServerService.getFlightSummary({ routeKey, departureCountry, month });
    res.json({ records, count: records.length, filteredBy: { routeKey, departureCountry, month } });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve flight summary', message: err.message });
  }
});

/**
 * 6. Market mapping (filtered by nationality)
 */
app.get('/api/data/market-mapping', async (req, res) => {
  try {
    const hotelNationality = req.query.hotelNationality as string | undefined;
    const departureCountry = req.query.departureCountry as string | undefined;
    const records = await DashboardDataServerService.getMarketMapping({ hotelNationality, departureCountry });
    res.json({ records, count: records.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve market mapping', message: err.message });
  }
});

/**
 * 7. Data Quality & Governance Register (9 items)
 */
app.get('/api/data/quality', async (req, res) => {
  try {
    const market = req.query.market as string | undefined;
    const severity = req.query.severity as string | undefined;
    const dataset = req.query.dataset as string | undefined;
    const records = await DashboardDataServerService.getDataQuality({ market, severity, dataset });
    res.json({ records, count: records.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve data quality', message: err.message });
  }
});

/**
 * 8. Model metrics & validation holdout info
 */
app.get('/api/data/model-metrics', async (_req, res) => {
  try {
    const metrics = await DashboardDataServerService.getModelMetrics();
    res.json(metrics);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve model metrics', message: err.message });
  }
});

/**
 * 9. Predictions (filtered by nationality and/or month)
 */
app.get('/api/data/predictions', async (req, res) => {
  try {
    const nationality = req.query.nationality as string | undefined;
    const month = req.query.month as string | undefined;
    const records = await DashboardDataServerService.getPredictions({ nationality, month });
    res.json({ records, count: records.length, filteredBy: { nationality, month } });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve predictions', message: err.message });
  }
});

/**
 * 10. Chatbot Knowledge Base Search
 * Returns only top relevant items matching user question/topic.
 * Never dumps the entire 20-item knowledge base.
 */
app.get('/api/data/knowledge', async (req, res) => {
  try {
    const query = (req.query.q || req.query.topic) as string | undefined;
    const items = await DashboardDataServerService.getKnowledge(query);
    res.json({ items, count: items.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to search knowledge base', message: err.message });
  }
});

/**
 * 11. Security Audit Status
 */
app.get('/api/data/security-audit', async (_req, res) => {
  try {
    const audit = await DashboardDataServerService.getAuditSummary();
    res.json(audit.security);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve security audit', message: err.message });
  }
});

// Explicitly block any direct public access to competition data paths or internal server files
app.all('/dashboard_data_v1*', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});
app.all('/server*', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});
app.all('*.json', (req, res, next) => {
  // Disallow direct static .json downloads unless explicitly permitted
  if (req.path.startsWith('/api/')) return next();
  res.status(404).json({ error: 'Not found' });
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
