from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_viewport_size({'width': 1280, 'height': 800})
    
    # We will just capture the initial render of the page.
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='C:/Users/Lucas/.gemini/antigravity/brain/d64109d4-793e-47eb-83ed-0f80ce20ee0d/qa_landing.png', full_page=True)
    
    # Try to execute a script to set window.localStorage to bypass login and show dashboard/assistant?
    # Actually, we can just click "Entrar" if we can.
    
    browser.close()
