// src/scraper.ts
import puppeteer, { Browser, Page } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { addExtra } from 'puppeteer-extra';
import { ProxyConfig, ScrapeResult, ScraperConfig } from './types';
import { randomDelay, sleep } from './utils/delays';
import { getRandomUserAgent, getRandomViewport } from './utils/fingerprints';
import { ProxyManager } from './proxyManager';

// Add stealth plugin to puppeteer
const puppeteerExtra = addExtra(puppeteer);
puppeteerExtra.use(StealthPlugin());

export class SheinScraper {
  private browser: Browser | null = null;
  private proxyManager: ProxyManager;
  private useProxy: boolean;

  constructor(useProxy: boolean = false) {
    this.proxyManager = new ProxyManager();
    this.useProxy = useProxy;
  }

  /**
   * Initialize proxies if needed
   */
  async initialize() {
    if (this.useProxy) {
      await this.proxyManager.fetchFreeProxies();
      const stats = this.proxyManager.getStats();
      console.log(`📊 Proxy stats:`, stats);
    }
  }

  /**
   * Initialize browser instance
   */
  private async initBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    console.log('🚀 Launching browser...');

    const proxy = this.useProxy ? this.proxyManager.getNextProxy() : null;
    const launchOptions: any = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--disable-blink-features=AutomationControlled',
      ],
    };

    // Add proxy if available
    if (proxy) {
      // For proxies WITHOUT authentication, use direct format
      if (!proxy.username || !proxy.password) {
        launchOptions.args.push(`--proxy-server=${proxy.host}:${proxy.port}`);
        console.log(`🔐 Using proxy: ${proxy.host}:${proxy.port}`);
      } else {
        // For authenticated proxies, just add the server (we'll authenticate later)
        launchOptions.args.push(`--proxy-server=${proxy.host}:${proxy.port}`);
        console.log(`🔐 Using authenticated proxy: ${proxy.host}:${proxy.port}`);
      }
    } else {
      console.log('🌐 Using direct connection (no proxy)');
    }

    this.browser = await puppeteerExtra.launch(launchOptions);
    return this.browser;
  }

  /**
   * Setup proxy authentication if needed
   */
  private async setupProxyAuth(page: Page, proxy: ProxyConfig | null) {
    if (proxy && proxy.username && proxy.password) {
      await page.authenticate({
        username: proxy.username,
        password: proxy.password,
      });
      console.log('✅ Proxy authentication configured');
    }
  }

  /**
   * Scrape a single Shein product page
   */
  async scrapeProduct(url: string, config: ScraperConfig = {}): Promise<ScrapeResult> {
    const startTime = Date.now();
    const {
      timeout = 60000,
      retries = 3,
    } = config;

    let lastError: string = '';

    // Clean URL - remove query parameters
    const cleanUrl = url.split('?')[0];

    // Get current proxy for this request
    const currentProxy = this.useProxy ? this.proxyManager.getNextProxy() : null;

    // Retry logic
    for (let attempt = 1; attempt <= retries; attempt++) {
      let page: Page | null = null;
      
      try {
        console.log(`\n🔍 Attempt ${attempt}/${retries} - Scraping: ${cleanUrl}`);

        const browser = await this.initBrowser();
        page = await browser.newPage();

        // Setup proxy authentication if needed
        await this.setupProxyAuth(page, currentProxy);

        // Set random user agent
        const userAgent = getRandomUserAgent();
        await page.setUserAgent(userAgent);
        console.log(`🎭 User Agent: ${userAgent.substring(0, 50)}...`);

        // Set random viewport
        const viewport = getRandomViewport();
        await page.setViewport(viewport);
        console.log(`📱 Viewport: ${viewport.width}x${viewport.height}`);

        // Set timeout
        page.setDefaultTimeout(timeout);

        // Navigate to the page
        console.log('🌐 Navigating to page...');
        const response = await page.goto(cleanUrl, {
          waitUntil: 'domcontentloaded',
          timeout: timeout,
        });

        if (!response || response.status() !== 200) {
          throw new Error(`Page returned status: ${response?.status()}`);
        }

        console.log(`✅ Page loaded with status: ${response.status()}`);

        // Wait for page to load completely
        console.log('⏳ Waiting for page to stabilize...');
        await sleep(5000);

        // Check for CAPTCHA
        const hasCaptcha = await page.evaluate(() => {
          // @ts-ignore - document exists in browser context
          const content = document.body.innerHTML.toLowerCase();
          return content.includes('captcha') || content.includes('challenge');
        });

        if (hasCaptcha) {
          throw new Error('CAPTCHA detected - page blocked');
        }

        // Random delay to look more human
        await randomDelay(1000, 2000);

        // Extract window.gbRawData
        console.log('📦 Extracting gbRawData...');
        const gbRawData = await page.evaluate(() => {
          // @ts-ignore
          return window.gbRawData || null;
        });

        // Close the page
        await page.close();
        page = null;

        if (!gbRawData) {
          throw new Error('gbRawData not found on page');
        }

        const elapsed = Date.now() - startTime;
        console.log(`✅ Success! Scraped in ${elapsed}ms`);

        return {
          success: true,
          data: gbRawData,
          timestamp: new Date().toISOString(),
          url: cleanUrl,
        };

      } catch (error: any) {
        lastError = error.message;
        console.error(`❌ Attempt ${attempt} failed:`, error.message);

        // Clean up page if it's still open
        if (page) {
          try {
            await page.close();
          } catch (e) {
            // Ignore close errors
          }
        }

        // Wait before retrying
        if (attempt < retries) {
          const waitTime = attempt * 3000;
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await sleep(waitTime);
        }
      }
    }

    // All retries failed
    const elapsed = Date.now() - startTime;
    return {
      success: false,
      error: lastError,
      timestamp: new Date().toISOString(),
      url: cleanUrl,
    };
  }

  /**
   * Close browser and cleanup
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('🔒 Browser closed');
    }
  }
}