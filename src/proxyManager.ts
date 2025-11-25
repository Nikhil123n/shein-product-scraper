// src/proxyManager.ts
import axios from 'axios';
import { ProxyConfig } from './types';
import { WEBSHARE_PROXIES } from './webshareProxies';

export class ProxyManager {
  private proxies: ProxyConfig[] = [];
  private currentIndex: number = 0;
  private failedProxies: Set<string> = new Set();
  private isInitialized: boolean = false;

  constructor() {
    // Auto-load WebShare proxies if available
    this.initializeWebshareProxies();
  }

  /**
   * Initialize WebShare proxies from config
   */
  private initializeWebshareProxies() {
    if (WEBSHARE_PROXIES.length > 0) {
      console.log('🔐 Loading WebShare proxies...');

      for (const proxyString of WEBSHARE_PROXIES) {
        try {
          const [credentials, hostPort] = proxyString.split('@');
          const [username, password] = credentials.split(':');
          const [host, port] = hostPort.split(':');

          this.proxies.push({
            host,
            port: parseInt(port),
            username,
            password,
          });
        } catch (error) {
          console.warn('⚠️ Failed to parse proxy:', proxyString, error);
        }
      }

      console.log(`✅ Loaded ${this.proxies.length} WebShare proxies`);
      this.isInitialized = true;
    }
  }

  /**
   * Fetch free proxies from proxy-list API (fallback)
   */
  async fetchFreeProxies(): Promise<void> {
    // If we already have WebShare proxies, skip free proxies
    if (this.proxies.length > 0) {
      console.log('📡 Using existing proxies, skipping free proxy fetch');
      return;
    }

    if (this.isInitialized) {
      console.log('📡 Proxies already initialized');
      return;
    }

    try {
      console.log('🔍 Fetching free proxies (fallback)...');

      const response = await axios.get<string>('https://api.proxyscrape.com/v2/', {
        params: {
          request: 'displayproxies',
          protocol: 'http',
          timeout: 10000,
          country: 'all',
          ssl: 'all',
          anonymity: 'all',
        },
        timeout: 10000,
      });

      const proxyList = response.data.split('\n').filter((p: string) => p.trim());

      console.log(`📥 Found ${proxyList.length} free proxies`);

      // Parse and add proxies (take only 10 as free proxies are often bad)
      for (const proxyString of proxyList.slice(0, 10)) {
        const [host, port] = proxyString.trim().split(':');
        if (host && port) {
          this.proxies.push({
            host: host.trim(),
            port: parseInt(port.trim()),
          });
        }
      }

      console.log(`✅ Added ${this.proxies.length} proxies to pool`);
      this.isInitialized = true;
    } catch (error: unknown) {
      console.warn('⚠️ Failed to fetch free proxies:', (error as Error).message);
      console.log('📍 Continuing without proxies (direct connection)');
      this.isInitialized = true;
    }
  }

  /**
   * Get the next proxy in rotation
   */
  public getNextProxy(): ProxyConfig | null {
    if (this.proxies.length === 0) {
      return null; // No proxy, use direct connection
    }

    // Try to find a working proxy
    let attempts = 0;
    while (attempts < this.proxies.length) {
      const proxy = this.proxies[this.currentIndex];
      const proxyKey = `${proxy.host}:${proxy.port}`;

      // Move to next proxy for next call
      this.currentIndex = (this.currentIndex + 1) % this.proxies.length;

      // Skip if proxy is marked as failed
      if (!this.failedProxies.has(proxyKey)) {
        return proxy;
      }

      attempts++;
    }

    console.warn('⚠️ All proxies exhausted, using direct connection');
    return null; // All proxies failed
  }

  /**
   * Mark a proxy as failed
   */
  public markProxyAsFailed(proxy: ProxyConfig) {
    const proxyKey = `${proxy.host}:${proxy.port}`;
    this.failedProxies.add(proxyKey);
    console.log(`❌ Proxy marked as failed: ${proxyKey}`);
  }

  /**
   * Add a new proxy to the pool manually
   */
  public addProxy(proxy: ProxyConfig) {
    this.proxies.push(proxy);
    console.log(`➕ Added proxy: ${proxy.host}:${proxy.port}`);
  }

  /**
   * Get proxy configuration string for Puppeteer
   */
  public getProxyString(proxy: ProxyConfig): string {
    if (proxy.username && proxy.password) {
      return `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
    }
    return `http://${proxy.host}:${proxy.port}`;
  }

  /**
   * Get statistics
   */
  public getStats() {
    return {
      total: this.proxies.length,
      failed: this.failedProxies.size,
      active: this.proxies.length - this.failedProxies.size,
      hasWebshare: WEBSHARE_PROXIES.length > 0,
    };
  }
}
