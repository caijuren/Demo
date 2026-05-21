const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const videoDir = '/Users/grubby/Desktop/Demo1/videos';
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
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

  // 2. 点击 AI研判按钮
  console.log('Clicking AI研判 button...');
  const button = await page.locator('button:has-text("AI研判")').first();
  await button.click();

  // 等待弹窗出现
  await page.waitForSelector('text=安全事件调查助手详情', { timeout: 5000 });
  console.log('Modal opened, recording...');

  // 3. 录制直到所有内容显示完成
  // 等待动画完成 - 总共32项，每项约1-3秒，预计需要60-90秒
  await page.waitForTimeout(90000);

  console.log('Recording complete');

  await context.close();
  await browser.close();

  // Playwright 录制的是 webm 格式，需要转换为 mp4
  const files = fs.readdirSync(videoDir);
  const videoFile = files.find(f => f.endsWith('.webm'));

  if (videoFile) {
    const srcPath = path.join(videoDir, videoFile);
    const destPath = path.join(videoDir, 'ai_analysis.mp4');

    // 使用 ffmpeg 转换
    const { execSync } = require('child_process');
    try {
      execSync(`ffmpeg -i "${srcPath}" -c:v libx264 -preset fast -crf 23 -movflags +faststart -y "${destPath}"`, {
        stdio: 'inherit',
      });
      console.log(`Video saved to: ${destPath}`);

      // 删除原始 webm
      fs.unlinkSync(srcPath);
    } catch (e) {
      console.error('ffmpeg conversion failed:', e.message);
      console.log(`Original webm saved to: ${srcPath}`);
    }
  }
})();
