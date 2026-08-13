from playwright.sync_api import sync_playwright, expect
import time

def test_builder_dashboard():
    with sync_playwright() as p:
        print("Launching Chromium...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        print("Navigating to local server...")
        page.goto('http://127.0.0.1:5173')
        
        print("Logging in as Guest...")
        try:
            page.locator('button:has-text("Entrar")').first.click(timeout=15000)
            page.locator('text=Entrar sem se registrar').click(timeout=15000)
        except Exception as e:
            page.screenshot(path="screenshot.png")
            raise e
        
        # We need to click on the "Sou Construtora" button to enter the dashboard
        # Let's wait for it to be visible. The button has text containing "Construtora" or "Sou Construtora"
        print("Selecting 'Construtora' profile...")
        try:
            builder_btn = page.locator('text=Construtora').first
            builder_btn.click(timeout=5000)
        except Exception:
            # Maybe the text is slightly different, let's just click the first role card
            page.locator('.glass-panel').nth(0).click(timeout=5000)

        # Wait for the dashboard to appear
        print("Checking Dashboard...")
        
        try:
            print("Skipping Onboarding...")
            page.locator('button:has-text("Pular")').click(timeout=3000)
        except Exception:
            pass # No onboarding
            
        expect(page.locator("text=Centro de Opera").first).to_be_visible(timeout=5000)
        
        # Navigate through the bottom nav tabs or side nav to verify they don't crash
        print("Clicking on 'Projetos/Obras' tab...")
        page.locator("text=Obras").first.click(timeout=5000)
        expect(page.locator("text=Obras Corporativas").first).to_be_visible(timeout=5000)

        print("Clicking on 'Menu' tab...")
        page.locator("text=Menu").first.click(timeout=5000)
        
        print("Clicking on 'Financeiro Corporativo' tab...")
        page.locator("text=Financeiro Corporativo").first.click(timeout=5000)
        expect(page.locator("text=Financeiro Corporativo").first).to_be_visible(timeout=5000)

        print("Clicking on 'Menu' tab...")
        page.locator("text=Menu").first.click(timeout=5000)

        print("Clicking on 'Centro de Materiais' tab...")
        page.locator("text=Centro de Materiais").first.click(timeout=5000)
        expect(page.locator("text=Centro de Compras").first).to_be_visible(timeout=5000)

        print("Test passed successfully!")
        
        browser.close()

if __name__ == '__main__':
    test_builder_dashboard()
