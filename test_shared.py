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

        print("Navigating to shared link...")
        # Since 'co_test' doesn't exist, we expect it to show 'Link de compartilhamento inválido ou expirado.'
        page.goto('http://localhost:5173/?shared=co_test')
        time.sleep(3)

        print("Errors caught:")
        for e in errors:
            print(e)
            
        print("Page text content:", page.inner_text('body'))
        browser.close()

if __name__ == "__main__":
    run()
