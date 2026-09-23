import sys
import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_viewport_size({'width': 1280, 'height': 800})
    
    print('Navigating to Assistant...')
    # Mocking auth state might be hard, but let's just go to /?tab=assistente if it relies on URL parameters, but it's a SPA.
    # Actually, we can just render the assistant standalone by editing App.tsx temporarily if needed.
    # Let's try to capture errors first.
    
    errors = []
    page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
    
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    time.sleep(2)
    
    # Try to click the "assistente" button if we can find it. But we are not logged in!
    # If not logged in, we are on LandingPage.
    print(errors)
    
    browser.close()
