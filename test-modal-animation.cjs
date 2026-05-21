const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Navigate to the page and wait for networkidle
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // 2. Wait for table to appear
  await page.waitForSelector('table');

  // 3. Click the first "AI研判" button
  await page.getByText('AI研判').first().click();

  // 4. Wait 500ms after click before first screenshot
  await page.waitForTimeout(500);

  // 5. Screenshot at t0 (0.5s after click)
  await page.screenshot({ path: '/tmp/modal_v2_t0.png', fullPage: false });
  console.log('Screenshot saved: /tmp/modal_v2_t0.png');

  // 6. Wait 2 seconds from t0, screenshot at t2 (2.5s after click)
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/modal_v2_t2.png', fullPage: false });
  console.log('Screenshot saved: /tmp/modal_v2_t2.png');

  // 7. Wait 3 more seconds, screenshot at t5 (5.5s after click)
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/tmp/modal_v2_t5.png', fullPage: false });
  console.log('Screenshot saved: /tmp/modal_v2_t5.png');

  // 8. Wait 5 more seconds, screenshot at t10 (10.5s after click)
  await page.waitForTimeout(5000);
  await page.screenshot({ path: '/tmp/modal_v2_t10.png', fullPage: false });
  console.log('Screenshot saved: /tmp/modal_v2_t10.png');

  await browser.close();
})();
