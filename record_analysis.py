from playwright.sync_api import sync_playwright
import os
import math

OUTPUT_DIR = "/Users/grubby/Desktop/Demo1/output"
SCREENSHOT_DIR = os.path.join(OUTPUT_DIR, "screenshots")

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def inject_cursor(page):
    page.evaluate("""
        const style = document.createElement('style');
        style.textContent = '* { cursor: none !important; }';
        document.head.appendChild(style);

        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("id", "custom-cursor");
        svg.setAttribute("width", "32");
        svg.setAttribute("height", "32");
        svg.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 999999;
            left: 0;
            top: 0;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        `;

        svg.innerHTML = `
            <defs>
                <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#00b4d8" stop-opacity="0.3"/>
                    <stop offset="100%" stop-color="#00b4d8" stop-opacity="0"/>
                </radialGradient>
            </defs>
            <circle cx="16" cy="16" r="14" fill="url(#cursorGlow)"/>
            <circle cx="16" cy="16" r="10" fill="none" stroke="#00b4d8" stroke-width="1.5" opacity="0.6"/>
            <circle cx="16" cy="16" r="3" fill="#00b4d8" opacity="0.9"/>
            <circle cx="16" cy="16" r="1" fill="white"/>
        `;

        document.body.appendChild(svg);

        let cursorX = 0, cursorY = 0;
        let targetX = 0, targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        document.addEventListener('mousedown', () => {
            const dot = svg.querySelector('circle:last-child');
            dot.setAttribute('r', '2');
            const glow = svg.querySelector('circle:first-child');
            glow.setAttribute('r', '18');
        });

        document.addEventListener('mouseup', () => {
            const dot = svg.querySelector('circle:last-child');
            dot.setAttribute('r', '1');
            const glow = svg.querySelector('circle:first-child');
            glow.setAttribute('r', '14');
        });

        function animate() {
            cursorX += (targetX - cursorX) * 0.3;
            cursorY += (targetY - cursorY) * 0.3;
            svg.style.left = (cursorX - 16) + 'px';
            svg.style.top = (cursorY - 16) + 'px';
            requestAnimationFrame(animate);
        }
        animate();
    """)

def smooth_mouse_move(page, start_x, start_y, end_x, end_y, steps=30, delay_ms=20):
    for i in range(1, steps + 1):
        t = i / steps
        eased = t * t * (3 - 2 * t)
        x = start_x + (end_x - start_x) * eased
        y = start_y + (end_y - start_y) * eased
        page.mouse.move(x, y)
        page.wait_for_timeout(delay_ms)

def smooth_scroll_to(page, element):
    box = element.bounding_box()
    if box:
        target = box['y'] + box['height'] / 2 - 300
        page.evaluate(f"""
            const targetY = {target};
            const startY = window.scrollY;
            const distance = targetY - startY;
            const duration = 800;
            const startTime = performance.now();

            function scroll(timestamp) {{
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                window.scrollTo(0, startY + distance * eased);
                if (progress < 1) requestAnimationFrame(scroll);
            }}
            requestAnimationFrame(scroll);
        """)
        page.wait_for_timeout(1000)

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        args=[
            "--start-maximized",
            "--window-size=1920,1080",
        ],
    )

    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=OUTPUT_DIR,
        record_video_size={"width": 1920, "height": 1080},
    )

    page = context.new_page()

    page.goto("http://localhost:5173/", wait_until="domcontentloaded")
    print("Page loaded")

    inject_cursor(page)
    print("Custom cursor injected")

    page.wait_for_timeout(1500)

    page.mouse.move(400, 300)
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "01_initial.png"), full_page=True)
    print("Screenshot 1: Initial page with cursor")

    page.mouse.move(960, 540)
    page.wait_for_timeout(800)
    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "02_highlight.png"), full_page=True)
    print("Screenshot 2: Page overview with cursor movement")

    ai_button = page.locator("button:has-text('AI研判')").first
    ai_button.wait_for(state="visible", timeout=5000)
    smooth_scroll_to(page, ai_button)

    box = ai_button.bounding_box()
    button_center_x = box['x'] + box['width'] / 2
    button_center_y = box['y'] + box['height'] / 2

    smooth_mouse_move(page, 960, 500, button_center_x, button_center_y, steps=40, delay_ms=25)
    page.wait_for_timeout(600)

    page.mouse.down()
    page.wait_for_timeout(150)
    page.mouse.up()
    print("Clicked AI研判 button with visible cursor!")

    page.wait_for_timeout(2000)

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "03_modal_opened.png"), full_page=True)
    print("Screenshot 3: AI analysis modal opened")

    page.wait_for_timeout(5000)

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04_streaming.png"), full_page=True)
    print("Screenshot 4: Streaming in progress")

    print("Waiting for AI analysis to fully complete...")
    total_waited = 5
    check_interval = 10
    max_wait = 300

    while total_waited < max_wait:
        page.wait_for_timeout(check_interval * 1000)
        total_waited += check_interval
        print(f"  ... {total_waited}s elapsed")

        check = page.locator("text=AI 研判完成")
        if check.is_visible():
            print("Found 'AI 研判完成' text!")
            break

        check2 = page.locator("text=研判完成")
        if check2.is_visible():
            print("Found '研判完成' text!")
            break

        page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"05_progress_{total_waited}s.png"), full_page=True)

    page.wait_for_timeout(3000)

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "06_final.png"), full_page=True)
    print("Screenshot final: Done")

    video_path = page.video.path()
    print(f"Video recorded at: {video_path}")

    browser.close()

    print(f"\nScreenshots saved to: {SCREENSHOT_DIR}")