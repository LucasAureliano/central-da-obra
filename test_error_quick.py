from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        def handle_error(err):
            print(f"PAGE ERROR: {err}")
            
        def handle_console(msg):
            if msg.type in ["error", "warning"]:
                print(f"CONSOLE {msg.type.upper()}: {msg.text}")
                
        page.on("pageerror", handle_error)
        page.on("console", handle_console)
        
        print("Navigating to app...")
        page.goto('http://localhost:5173')
        
        # Wait a bit to let React render and log any errors
        time.sleep(5)
        
        print("Taking screenshot to see what's rendered...")
        page.screenshot(path="screenshot_debug.png")
        print("Done. Check screenshot_debug.png and the console output above.")
        
        browser.close()

if __name__ == "__main__":
    run()
