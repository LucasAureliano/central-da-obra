from playwright.sync_api import sync_playwright
import time
import os

def test_visitor_mode():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # We need a browser context with localStorage support
        context = browser.new_context()
        page = context.new_page()
        
        print("[TEST] Navigating to http://localhost:5173")
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        
        print("[TEST] Clicking 'Entrar' on landing page")
        page.locator('button:has-text("Entrar")').first.click()
        time.sleep(1)
        
        print("[TEST] Clicking 'Entrar sem se registrar'")
        page.locator('button:has-text("Entrar sem se registrar")').click()
        
        print("[TEST] Waiting for Splash Screen to disappear...")
        try:
            page.wait_for_selector('text="CARREGANDO"', state='hidden', timeout=10000)
        except Exception:
            pass # might have already disappeared

        print("[TEST] Selecting role 'Proprietário'...")
        page.locator('button:has-text("Proprietário")').first.click()
        time.sleep(1)

        print("[TEST] Skipping Onboarding Demo...")
        # The 'Pular' button is in the OnboardingEngine
        pular_btn = page.locator('button:has-text("Pular")')
        if pular_btn.is_visible():
            pular_btn.click()
            time.sleep(1)
        
        print("[TEST] Completing Onboarding Conclusion...")
        entrar_app_btn = page.locator('button:has-text("Entrar no Aplicativo")')
        if entrar_app_btn.is_visible():
            entrar_app_btn.click()
            time.sleep(1)

        page.screenshot(path='visitor_dashboard.png', full_page=True)
        print("[TEST] Screenshot saved to visitor_dashboard.png")

        # 1. Visitor Mode detection
        print("[TEST] Expecting Visitor Mode to be active without login...")
        new_work_btn = page.locator('button:has-text("Criar Minha Obra")')
        if new_work_btn.first.is_visible():
            print("[PASS] Visitor Mode: 'Criar Minha Obra' is accessible on Dashboard.")
            # Click the one on dashboard to navigate to Works tab
            new_work_btn.first.click()
            time.sleep(1)
            
            # Now on Works tab, click it again to open the modal
            print("[TEST] Clicking 'Criar Minha Obra' on Works tab...")
            page.locator('button:has-text("Criar Minha Obra")').last.click()
            time.sleep(1)
            
            # Fill the modal
            print("[TEST] Filling new work modal as visitor...")
            # We must handle the modal inputs
            page.locator('input[placeholder="Ex: Residencial Alphaville"]').fill('Obra Teste Playwright')
            page.locator('button:has-text("Próxima Etapa")').click()
            time.sleep(1)
            page.locator('button:has-text("Concluir e Criar")').click()
            time.sleep(2)
        else:
            print("[FAIL] Visitor Mode: Work creation failed or not visible.")

        # We assume there is a sidebar or bottom navigation.
        print("[TEST] Looking for Cálculos...")
        calc_link = page.locator('text="Cálculos"').last
        if calc_link.is_visible():
            calc_link.click()
            time.sleep(1)
            print("[PASS] Visitor Mode: Calculators accessible.")
        else:
            print("[WARN] Could not find Cálculos link, skipping.")

        browser.close()

if __name__ == '__main__':
    test_visitor_mode()
