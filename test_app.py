from playwright.sync_api import sync_playwright

def test_homepage():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        print("Acessando a aplicacao...")
        page.goto('http://localhost:5173')
        
        page.wait_for_load_state('networkidle')
        
        title = page.title()
        print(f"Title is: {title}")
        
        page.screenshot(path='landing_page_playwright.png', full_page=True)
        print("Screenshot salvo.")
        
        create_btn = page.locator('button:has-text("Criar Minha Central")')
        if create_btn.count() > 0:
            print("Botao encontrado!")
        else:
            print("Botao NAO encontrado!")
            
        print("Testes finalizados!")
        browser.close()

if __name__ == '__main__':
    test_homepage()
