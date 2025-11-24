// src/testScraper.ts
import { SheinScraper } from './scraper';

async function test() {
  const scraper = new SheinScraper();
  
  // Test with a real Shein product URL
  const testUrl = 'https://us.shein.com/Manfinity-Homme-Men-s-Contrast-Color-Short-Sleeve-Casual-Commuter-Polo-Shirt-Men-Knitted-Polo-Shirt-Cream-Polo-Shirt-Men-Mens-V-Neck-Knitted-Shirt-Mens-Short-Sleeve-Sweater-Polo-Mens-Textured-Polo-Shirt-Old-Money-p-162986982.html';
  
  console.log('🧪 Testing scraper with sample URL...\n');
  
  const result = await scraper.scrapeProduct(testUrl);
  
  if (result.success) {
    console.log('\n✅ Test PASSED!');
    console.log('📊 Data keys found:', Object.keys(result.data || {}).length);
  } else {
    console.log('\n❌ Test FAILED!');
    console.log('Error:', result.error);
  }
  
  await scraper.close();
}

test();