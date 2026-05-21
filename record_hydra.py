from playwright.sync_api import sync_playwright
import os

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


with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        args=[
            "--start-maximized",
            "--window-size=1920,1080",
            "--disable-features=ChromeCrashpad",
        ],
    )

    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=OUTPUT_DIR,
        record_video_size={"width": 1920, "height": 1080},
    )

    page = context.new_page()

    page.goto("http://127.0.0.1:8081/", wait_until="domcontentloaded")
    print("Page loaded")

    inject_cursor(page)
    print("Custom cursor injected")

    page.wait_for_timeout(1000)

    page.mouse.move(400, 200)
    page.wait_for_timeout(500)

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "01_hydra_initial.png"))
    print("Screenshot 1: Initial page")

    smooth_mouse_move(page, 400, 200, 800, 400, steps=25, delay_ms=30)
    page.wait_for_timeout(500)

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "02_hydra_running.png"))
    print("Screenshot 2: Attempts running")

    smooth_mouse_move(page, 800, 400, 500, 600, steps=20, delay_ms=30)
    page.wait_for_timeout(500)

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "03_hydra_mid.png"))
    print("Screenshot 3: Mid-way")

    print("Waiting for brute force animation to complete...")
    total_waited = 0
    check_interval = 5
    max_wait = 120

    while total_waited < max_wait:
        page.wait_for_timeout(check_interval * 1000)
        total_waited += check_interval
        print(f"  ... {total_waited}s elapsed")

        breached = page.locator("text=ACCOUNT BREACHED")
        if breached.is_visible():
            print("Found 'ACCOUNT BREACHED' text!")
            page.wait_for_timeout(2000)
            break

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04_hydra_breach.png"))
    print("Screenshot 4: Breach result")

    smooth_mouse_move(page, 500, 600, 300, 800, steps=15, delay_ms=20)
    page.wait_for_timeout(2000)

    cursor_visible = page.locator(".cursor")
    if cursor_visible.is_visible():
        print("Animation fully complete!")
        page.wait_for_timeout(2000)

    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "05_hydra_final.png"))
    print("Screenshot 5: Final state")

    page.wait_for_timeout(2000)

    context.close()
    browser.close()

    video_path = page.video.path()
    new_video_path = os.path.join(OUTPUT_DIR, "hydra_terminal_bruteforce.webm")
    if os.path.exists(video_path):
        os.rename(video_path, new_video_path)
        print(f"Video saved as: {new_video_path}")
    else:
        print(f"WARNING: Video file not found at {video_path}")

    print("Done!")