import sys
import time
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.set_viewport_size({'width': 1280, 'height': 800})
    
    print('Navigating to landing page...')
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    time.sleep(2)
    page.screenshot(path='C:/Users/Lucas/.gemini/antigravity/brain/d64109d4-793e-47eb-83ed-0f80ce20ee0d/qa_landing.png', full_page=True)
    
    print('Navigating to calculators hub...')
    page.goto('http://localhost:5173/?calc=wallpaint')
    page.wait_for_load_state('networkidle')
    time.sleep(2)
    page.screenshot(path='C:/Users/Lucas/.gemini/antigravity/brain/d64109d4-793e-47eb-83ed-0f80ce20ee0d/qa_calculators.png', full_page=True)
    
    print('Navigating to Assistant...')
    page.goto('http://localhost:5173/assistente') # Will redirect to login since not auth, but just to check
    page.wait_for_load_state('networkidle')
    time.sleep(2)
    page.screenshot(path='C:/Users/Lucas/.gemini/antigravity/brain/d64109d4-793e-47eb-83ed-0f80ce20ee0d/qa_assistant.png', full_page=True)
        
    browser.close()
