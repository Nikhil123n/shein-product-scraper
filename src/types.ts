// This defines what a scraping result looks like
export interface ScrapeResult {
  success: boolean;
  data?: unknown; // The gbRawData from Shein
  error?: string;
  timestamp: string;
  url: string;
}

// Configuration for our scraper
export interface ScraperConfig {
  timeout?: number; // How long to wait before giving up
  retries?: number; // How many times to retry on failure
  useProxy?: boolean;
}

// Proxy information
export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
}
