const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  await page.goto('http://localhost:5176/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 点击第一行的 AI研判按钮
  const button = await page.locator('button:has-text("AI研判")').first();
  await button.click();

  // 等待弹窗出现
  await page.waitForSelector('text=安全事件调查助手详情', { timeout: 5000 });

  // 等待一下让动画开始
  await page.waitForTimeout(2000);

  // 截图
  await page.screenshot({ path: '/tmp/modal_clicked.png', fullPage: false });

  await browser.close();
  console.log('Done');
})();
