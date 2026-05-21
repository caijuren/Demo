const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click the first AI研判 button
  const button = await page.locator('button:has-text("AI研判")').first();
  await button.click();

  // Wait for modal to appear
  await page.waitForSelector('text=安全事件调查助手详情', { timeout: 5000 });

  // Screenshot immediately
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/m_t0.png', fullPage: false });

  // Wait 2s
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/m_t2.png', fullPage: false });

  // Wait 3s more (5s total)
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/m_t5.png', fullPage: false });

  // Wait 5s more (10s total)
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/tmp/m_t10.png', fullPage: false });

  await browser.close();
  console.log('Done');
})();
