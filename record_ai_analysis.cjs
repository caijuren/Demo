const { chromium } = require('playwright');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5175/';
const VIDEO_DIR = '/Users/grubby/Desktop/Demo1/videos';
const OUTPUT_FINAL = path.join(VIDEO_DIR, '钓鱼邮件AI研判.mp4');

(async () => {
  if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1200 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1920, height: 1200 },
    },
  });

  const page = await context.newPage();

  // Inject a visual cursor indicator that follows real mouse events
  await page.addInitScript(() => {
    const cursor = document.createElement('div');
    cursor.id = 'vc';
    cursor.innerHTML = `
      <div style="
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0,180,216,0.35) 0%, rgba(0,180,216,0.1) 70%);
        border: 2.5px solid #00b4d8;
        box-shadow: 0 0 12px rgba(0,180,216,0.4), inset 0 0 6px rgba(0,180,216,0.15);
        transform: translate(-50%, -50%);
        left: -100px;
        top: -100px;
        transition: none;
      "></div>
      <div style="
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #00b4d8;
        box-shadow: 0 0 6px rgba(0,180,216,0.8);
        transform: translate(-50%, -50%);
        left: -100px;
        top: -100px;
        transition: none;
      "></div>
    `;
    document.body.appendChild(cursor);

    const outer = cursor.children[0];
    const inner = cursor.children[1];

    document.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      outer.style.left = x + 'px';
      outer.style.top = y + 'px';
      inner.style.left = x + 'px';
      inner.style.top = y + 'px';
    });

    document.addEventListener('mousedown', () => {
      outer.style.transform = 'translate(-50%, -50%) scale(0.8)';
      outer.style.background = 'radial-gradient(circle, rgba(0,180,216,0.5) 0%, rgba(0,180,216,0.2) 70%)';
    });

    document.addEventListener('mouseup', () => {
      outer.style.transform = 'translate(-50%, -50%) scale(1)';
      outer.style.background = 'radial-gradient(circle, rgba(0,180,216,0.35) 0%, rgba(0,180,216,0.1) 70%)';
    });
  });

  // 1. Open the website
  console.log('1/8  Opening website...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 2. Move mouse with trajectory to the first AI研判 button
  console.log('2/8  Moving mouse to AI研判 button...');
  const button = page.locator('button:has-text("AI研判")').first();

  // Get button position
  const box = await button.boundingBox();
  if (!box) {
    console.error('Button not found!');
    await browser.close();
    return;
  }

  const targetX = box.x + box.width / 2;
  const targetY = box.y + box.height / 2;

  // Move mouse from top-left corner with smooth trajectory
  await page.mouse.move(200, 300, { steps: 30 });
  await page.waitForTimeout(400);

  await page.mouse.move(targetX, targetY - 60, { steps: 40 });
  await page.waitForTimeout(300);

  await page.mouse.move(targetX, targetY, { steps: 15 });
  await page.waitForTimeout(500);

  // 3. Click the AI研判 button
  console.log('3/8  Clicking AI研判 button...');
  await button.click();
  await page.waitForTimeout(800);

  // 4. Wait for modal to appear
  console.log('4/8  Waiting for modal to open...');
  await page.waitForSelector('text=安全事件调查助手详情', { timeout: 10000 });
  console.log('Modal opened!');

  // 5. Wait for streaming content to fully complete
  console.log('5/8  Waiting for AI analysis to complete...');
  await page.waitForTimeout(5000);

  // Take debug screenshot
  await page.screenshot({ path: '/tmp/modal_debug_1.png' });
  console.log('Debug screenshot 1 saved');

  // Wait for the completion text - try multiple selectors
  try {
    await page.waitForSelector('text=研判完成', { timeout: 200000 });
    console.log('Analysis complete - 研判完成 found!');
  } catch (e) {
    // Fallback: wait for the status badge
    console.log('Trying fallback selector...');
    await page.screenshot({ path: '/tmp/modal_debug_2.png' });
    await page.waitForSelector('text=已完成', { timeout: 60000 });
    console.log('Analysis complete - 已完成 found!');
  }
  await page.waitForTimeout(2000);

  // 6. Scroll to top of modal content
  console.log('6/8  Scrolling to top of modal content...');
  const scrollContainer = page.locator('.overflow-y-auto').first();
  await scrollContainer.evaluate((el) => {
    el.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  // 7. Slowly scroll down through all content
  console.log('7/8  Slowly scrolling through content...');
  const totalHeight = await scrollContainer.evaluate((el) => el.scrollHeight);

  const scrollSteps = 140;
  const scrollDuration = 18000;
  const stepDelay = scrollDuration / scrollSteps;

  for (let i = 1; i <= scrollSteps; i++) {
    const progress = i / scrollSteps;
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const scrollPos = eased * totalHeight;

    await scrollContainer.evaluate((el, pos) => {
      el.scrollTop = pos;
    }, scrollPos);

    await new Promise((r) => setTimeout(r, stepDelay));
  }

  await page.waitForTimeout(1500);

  // 8. Done - close browser
  console.log('8/8  Recording complete, closing browser...');
  await context.close();
  await browser.close();

  // Convert webm to mp4
  console.log('Converting video to MP4...');
  const files = fs.readdirSync(VIDEO_DIR)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => ({
      name: f,
      time: fs.statSync(path.join(VIDEO_DIR, f)).mtimeMs,
    }))
    .sort((a, b) => b.time - a.time);

  if (files.length > 0) {
    const srcPath = path.join(VIDEO_DIR, files[0].name);
    console.log(`Using video file: ${files[0].name}`);
    try {
      execSync(
        `ffmpeg -i "${srcPath}" -c:v libx264 -preset fast -crf 18 -movflags +faststart -y "${OUTPUT_FINAL}"`,
        { stdio: 'inherit' }
      );
      console.log(`Video saved to: ${OUTPUT_FINAL}`);

      // Delete original webm
      fs.unlinkSync(srcPath);
      console.log('Original webm deleted.');
    } catch (e) {
      console.error('Conversion error:', e.message);
    }
  } else {
    console.log('No webm file found.');
  }

  console.log('All done!');
})();