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

        print("Navigating to app...")
        page.goto('http://localhost:5173')
        time.sleep(2)

        # Login manually by setting local storage if we can't find the modal, or just find it
        try:
            page.evaluate("window.localStorage.setItem('co_guest_mode', 'true')")
            page.evaluate("window.localStorage.setItem('pendingRole', 'architect')")
            print("Set guest mode and role to architect")
            page.reload()
            time.sleep(2)
        except Exception as e:
            print("Failed to set guest mode", e)

        print("Clicking Controle de Projetos / Projetos...")
        try:
            page.click('text="Controle de Projetos"', timeout=3000)
        except:
            try:
                page.click('button:has-text("Projetos")', timeout=3000)
            except Exception as e:
                print("Could not find projects button", e)

        time.sleep(2)

        print("Creating a project since guest mode might be empty...")
        try:
            page.click('button:has-text("+ Criar Novo Projeto")', timeout=3000)
            time.sleep(1)
            page.fill('input[placeholder="Ex: Residência Alpha"]', "Teste Projeto")
            page.fill('input[placeholder="Ex: Família Souza"]', "Cliente Teste")
            page.click('button:has-text("Salvar Projeto")')
            time.sleep(2)
        except Exception as e:
            print("Failed to create project", e)

        print("Clicking the project...")
        try:
            page.click('text="Teste Projeto"', timeout=3000)
        except Exception as e:
            print("Could not click project", e)

        time.sleep(2)

        print("Errors caught:")
        for e in errors:
            print(e)

        browser.close()

if __name__ == "__main__":
    run()
