/**
 * Sleep for a random amount of time between min and max milliseconds
 * This makes our scraper look more human-like
 */
export function randomDelay(min: number = 2000, max: number = 5000): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`⏳ Waiting ${delay}ms...`);
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Sleep for exact milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
