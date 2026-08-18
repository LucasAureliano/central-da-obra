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

        print("Entering as visitor...")
        page.locator("text=Explorar a Plataforma").click()
        time.sleep(3)

        print("Clicking Menu...")
        page.locator("text=Menu").click()
        time.sleep(2)
        
        print("Clicking Planos...")
        # Menu has a button with text "Planos" or "Assinatura"
        try:
            page.locator("text=Planos").first.click()
        except:
            page.locator("text=Assinatura").first.click()
        time.sleep(3)

        page.screenshot(path='screenshot_plans.png', full_page=True)
        print("Plans screenshot saved.")
            
        browser.close()

if __name__ == "__main__":
    run()
