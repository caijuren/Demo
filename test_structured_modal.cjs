const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 点击第3行（非工作时间大规模数据下载）的 AI研判按钮
  const buttons = await page.locator('button:has-text("AI研判")').all();
  await buttons[2].click(); // 第3个按钮（索引2）

  // 等待弹窗出现
  await page.waitForSelector('text=安全事件调查助手详情', { timeout: 5000 });

  // 等待动画完成（约60秒）
  await page.waitForTimeout(60000);

  // 截图
  await page.screenshot({ path: '/tmp/structured_modal.png', fullPage: false });

  await browser.close();
  console.log('Done');
})();
