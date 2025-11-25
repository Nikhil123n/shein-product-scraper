// src/server.ts
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { SheinScraper } from './scraper';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Create scraper instance with proxy support
const USE_PROXIES = process.env.USE_PROXIES === 'true';
const scraper = new SheinScraper(USE_PROXIES);

// Initialize scraper
let isReady = false;
scraper.initialize().then(() => {
  isReady = true;
  console.log('✅ Scraper initialized and ready');
});

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: isReady ? 'ready' : 'initializing',
    message: 'Shein Scraper API',
    useProxies: USE_PROXIES,
    endpoints: {
      scrape: 'GET /shein?productUrl=<url>',
      health: 'GET /',
      stats: 'GET /stats',
    },
  });
});

// Stats endpoint
app.get('/stats', (req: Request, res: Response) => {
  const stats = scraper.getProxyStats();
  res.json({
    ready: isReady,
    useProxies: USE_PROXIES,
    proxyStats: stats,
  });
});

// Main scraping endpoint
app.get('/shein', async (req: Request, res: Response) => {
  try {
    // Check if ready
    if (!isReady) {
      return res.status(503).json({
        success: false,
        error: 'Scraper is still initializing, please wait...',
      });
    }

    const { productUrl } = req.query;

    // Validate productUrl
    if (!productUrl || typeof productUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid productUrl parameter',
        example: '/shein?productUrl=https://us.shein.com/...',
      });
    }

    // Validate it's a Shein URL
    if (!productUrl.includes('shein.com')) {
      return res.status(400).json({
        success: false,
        error: 'URL must be from shein.com',
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('📨 New scrape request received');
    console.log('🔗 URL:', productUrl);
    console.log('='.repeat(60));

    // Scrape the product
    const result = await scraper.scrapeProduct(productUrl, {
      timeout: 60000,
      retries: 3,
    });

    // Return result
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('💥 Server error:', message);
    res.status(500).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await scraper.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await scraper.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '🎉'.repeat(30));
  console.log(`✨ Shein Scraper API is running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`📖 API Docs: http://localhost:${PORT}`);
  console.log(`🔐 Proxies: ${USE_PROXIES ? 'ENABLED' : 'DISABLED'}`);
  console.log('🎉'.repeat(30) + '\n');
});
