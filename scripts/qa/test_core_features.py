from playwright.sync_api import sync_playwright
import time
import os

def test_core_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        print("[TEST] Navigating to http://localhost:5173")
        page.goto('http://localhost:5173')
        page.wait_for_load_state('networkidle')
        
        # 1. Login as Visitor
        print("[TEST] Logging in as Visitor")
        page.locator('button:has-text("Entrar")').first.click()
        time.sleep(1)
        page.locator('button:has-text("Entrar sem se registrar")').click()
        
        try:
            page.wait_for_selector('text="CARREGANDO"', state='hidden', timeout=10000)
        except Exception:
            pass
            
        page.locator('button:has-text("Proprietário")').first.click()
        time.sleep(1)
        
        pular_btn = page.locator('button:has-text("Pular")')
        if pular_btn.is_visible():
            pular_btn.click()
            time.sleep(1)
            
        entrar_app_btn = page.locator('button:has-text("Entrar no Aplicativo")')
        if entrar_app_btn.is_visible():
            entrar_app_btn.click()
            time.sleep(1)
            
        # 2. Create a Work
        print("[TEST] Creating a new Work for core features testing...")
        new_work_btn = page.locator('button:has-text("Criar Minha Obra")')
        if new_work_btn.first.is_visible():
            new_work_btn.first.click()
            time.sleep(1)
            page.locator('button:has-text("Criar Minha Obra")').last.click()
            time.sleep(1)
            page.locator('input[placeholder="Ex: Residencial Alphaville"]').fill('Obra Core Features')
            page.locator('button:has-text("Próxima Etapa")').click()
            time.sleep(1)
            page.locator('button:has-text("Concluir e Criar")').click()
            time.sleep(2)
        else:
            print("[FAIL] Cannot create work, cannot proceed with core tests.")
            browser.close()
            return
            
        # 3. Open Work Details
        print("[TEST] Opening Work Details...")
        page.screenshot(path='visitor_works_list.png', full_page=True)
        page.locator('text="Obra Core Features"').first.click()
        time.sleep(1)

        # 4. Test Empty States
        print("[TEST] Testing Empty States in Finanças...")
        page.locator('button:has-text("Finanças")').click()
        time.sleep(1)
        if page.locator('text="Nenhum registro encontrado"').is_visible() or page.locator('text="Nenhuma movimentação"').is_visible() or page.locator('text="Nenhum lançamento financeiro"').is_visible():
            print("[PASS] Empty State visible in Financeiro.")
        else:
            print("[WARN] Empty State not verified in Financeiro.")
            
        # 5. Test Financeiro (Create Expense)
        print("[TEST] Testing Financeiro (Create Expense)...")
        # Try finding a button to add an expense
        add_expense_btn = page.locator('button:has-text("Lançar Despesa")').first
        if not add_expense_btn.is_visible():
            add_expense_btn = page.locator('button:has-text("Novo")').first
            
        if add_expense_btn.is_visible():
            add_expense_btn.click()
            time.sleep(1)
            # Find title input
            page.locator('input[placeholder="Ex: Cimento 50kg"]').fill('Cimento Teste')
            page.locator('button:has-text("Salvar Lançamento")').click()
            time.sleep(1)
            if page.locator('text="Cimento Teste"').is_visible():
                print("[PASS] Expense created successfully.")
            else:
                print("[FAIL] Expense creation failed.")
        else:
            print("[WARN] Could not find button to create expense.")
            
        # 6. Test Agenda/Cronograma
        print("[TEST] Testing Agenda...")
        page.locator('button:has-text("Cronograma")').click()
        time.sleep(1)
        
        add_stage_btn = page.locator('button.btn-primary').first
        if add_stage_btn.is_visible():
            add_stage_btn.click()
            time.sleep(1)
            page.locator('input[placeholder="Ex: Vistoria da Obra"]').fill('Fundação Teste')
            page.locator('button:has-text("Salvar Agendamento")').click()
            time.sleep(1)
            if page.locator('text="Fundação Teste"').is_visible():
                print("[PASS] Agenda event created successfully.")
            else:
                print("[FAIL] Agenda event creation failed.")
        else:
            print("[WARN] Could not find button to create Agenda event.")

        print("[TEST] Core features flow completed.")
        browser.close()

if __name__ == '__main__':
    test_core_features()
