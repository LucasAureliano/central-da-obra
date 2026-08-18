import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # We need a mobile viewport to see the mobile navigation layout
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()

        print("Navigating to local site...")
        page.goto('http://localhost:5173')
        time.sleep(4)

        # Assume we are on landing page or need to click login
        try:
            # Maybe there is a button 'Acessar' or something
            page.click("text=Visitante")
            time.sleep(2)
        except:
            pass

        # Switch to assistant
        try:
            page.click("text=Assistente")
            time.sleep(2)
        except:
            print("Couldn't click Assistente directly")

        page.screenshot(path='screenshot_assistant.png', full_page=False)
        print("Screenshot saved to screenshot_assistant.png")
        browser.close()

if __name__ == "__main__":
    run()
