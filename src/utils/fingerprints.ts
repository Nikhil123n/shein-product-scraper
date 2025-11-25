/**
 * Returns a random user agent to make each request look different
 */
export function getRandomUserAgent(): string {
  const userAgents = [
    // Chrome on Windows (Latest versions)
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    // Chrome on macOS
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    
    // Firefox on Windows
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    
    // Firefox on macOS
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13.6; rv:120.0) Gecko/20100101 Firefox/120.0',
    
    // Safari on macOS
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    
    // Chrome on Linux
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    
    // Edge on Windows
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
    
    // Additional variety
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
  ];

  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

/**
 * Returns random viewport size (browser window dimensions)
 */
/**
 * Returns random viewport size (browser window dimensions)
 * Expanded to cover more common resolutions
 */
export function getRandomViewport() {
  const viewports = [
    // Common desktop resolutions
    { width: 1920, height: 1080 }, // Full HD (most common)
    { width: 1366, height: 768 },  // Laptop standard
    { width: 1536, height: 864 },  // Surface Pro
    { width: 1440, height: 900 },  // MacBook Pro 15"
    { width: 1280, height: 720 },  // HD
    
    // Additional common resolutions
    { width: 2560, height: 1440 }, // 2K monitor
    { width: 1680, height: 1050 }, // 16:10 monitor
    { width: 1600, height: 900 },  // HD+
    { width: 1280, height: 800 },  // MacBook Air
    { width: 1280, height: 1024 }, // 5:4 monitor
    
    // Wide screens
    { width: 2560, height: 1080 }, // Ultrawide
    { width: 3440, height: 1440 }, // Ultrawide QHD
    
    // High DPI displays
    { width: 1920, height: 1200 }, // 16:10 Full HD
    { width: 2048, height: 1152 }, // MacBook Pro 13"
    { width: 1400, height: 1050 }, // 4:3 laptop
  ];

  return viewports[Math.floor(Math.random() * viewports.length)];
}

/**
 * Returns random browser language settings
 * More realistic language headers
 */
export function getRandomLanguage(): string {
  const languages = [
    'en-US,en;q=0.9',
    'en-GB,en;q=0.9',
    'en-US,en;q=0.9,es;q=0.8',
    'en-US,en;q=0.9,fr;q=0.8',
    'en-US,en;q=0.9,de;q=0.8',
    'en-GB,en-US;q=0.9,en;q=0.8',
  ];

  return languages[Math.floor(Math.random() * languages.length)];
}

/**
 * Returns random platform string
 */
export function getRandomPlatform(): string {
  const platforms = [
    'Win32',
    'MacIntel',
    'Linux x86_64',
  ];

  return platforms[Math.floor(Math.random() * platforms.length)];
}

/**
 * Returns random timezone offset (in minutes)
 */
export function getRandomTimezone(): number {
  const timezones = [
    -480, // PST (US West)
    -420, // MST (US Mountain)
    -360, // CST (US Central)
    -300, // EST (US East)
    0,    // GMT (London)
    60,   // CET (Paris)
    120,  // EET (Athens)
  ];

  return timezones[Math.floor(Math.random() * timezones.length)];
}
