import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        errors = []
        page.on("pageerror", lambda err: errors.append(f"PAGE ERROR: {err}"))
        page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type.upper()}: {msg.text}") if msg.type in ["error", "warning"] else None)

        print("Navigating to local site...")
        page.goto('http://localhost:5173')
        time.sleep(3)

        print("Errors caught:")
        for e in errors:
            print(e)
            
        browser.close()

if __name__ == "__main__":
    run()
