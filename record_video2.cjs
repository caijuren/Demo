const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const videoDir = '/Users/grubby/Desktop/Demo1/videos';
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  // 使用 headed 模式（非 headless）来正确录制视频
  const browser = await chromium.launch({
    headless: false,
    args: ['--window-size=1920,1080'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();

  // 1. 打开网站
  console.log('Opening website...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 2. 移动鼠标到 AI研判按钮位置（显示光标轨迹）
  console.log('Moving mouse to AI研判 button...');
  const button = await page.locator('button:has-text("AI研判")').first();
  const box = await button.boundingBox();

  // 先移动鼠标到按钮附近（让用户看到光标移动）
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 30 });
  await page.waitForTimeout(500);

  // 3. 点击 AI研判按钮
  console.log('Clicking AI研判 button...');
  await button.click();

  // 等待弹窗出现
  await page.waitForSelector('text=安全事件调查助手详情', { timeout: 5000 });
  console.log('Modal opened, recording animation...');

  // 4. 录制直到所有内容显示完成（约90秒）
  await page.waitForTimeout(90000);

  console.log('Recording complete');

  await context.close();
  await browser.close();

  // Playwright 录制的是 webm 格式，转换为 mp4
  const files = fs.readdirSync(videoDir);
  const videoFile = files.find(f => f.endsWith('.webm') && !f.includes('ai_analysis'));

  if (videoFile) {
    const srcPath = path.join(videoDir, videoFile);
    const destPath = path.join(videoDir, 'ai_analysis_full.mp4');

    const { execSync } = require('child_process');
    try {
      execSync(`ffmpeg -i "${srcPath}" -c:v libx264 -preset fast -crf 23 -movflags +faststart -y "${destPath}"`, {
        stdio: 'inherit',
      });
      console.log(`Video saved to: ${destPath}`);
      fs.unlinkSync(srcPath);
    } catch (e) {
      console.error('ffmpeg conversion failed:', e.message);
      console.log(`Original webm saved to: ${srcPath}`);
    }
  }
})();
