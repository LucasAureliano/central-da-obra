import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        print("Navigating to local site...")
        page.goto('http://localhost:5173')
        time.sleep(3)

        print("Clicking Explorar a Plataforma...")
        try:
            page.locator("text=Explorar a Plataforma").click()
            time.sleep(4)
            page.screenshot(path='screenshot_dashboard.png', full_page=True)
            print("Dashboard screenshot saved.")
        except Exception as e:
            print("Could not click: ", e)
            
        browser.close()

if __name__ == "__main__":
    run()
