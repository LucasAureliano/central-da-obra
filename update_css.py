import os

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"
content = open(css_path, encoding='utf-8').read()

# Add to dark theme
if "--bg-input-glass:" not in content:
    dark_vars = """  --bg-input-glass: rgba(255, 255, 255, 0.03);
  --bg-input-glass-hover: rgba(255, 255, 255, 0.06);
  --bg-card-glass: rgba(255, 255, 255, 0.01);
  --bg-card-glass-hover: rgba(255, 255, 255, 0.04);
  
  --shadow-elevated: 0 8px 30px rgba(0, 0, 0, 0.5);"""
    
    content = content.replace("  --shadow-elevated: 0 8px 30px rgba(0, 0, 0, 0.5);", dark_vars)
    
    light_vars = """  --bg-input-glass: rgba(0, 0, 0, 0.03);
  --bg-input-glass-hover: rgba(0, 0, 0, 0.06);
  --bg-card-glass: rgba(0, 0, 0, 0.01);
  --bg-card-glass-hover: rgba(0, 0, 0, 0.04);
  
  --shadow-elevated: 0 4px 24px rgba(0, 0, 0, 0.06);"""
    
    content = content.replace("  --shadow-elevated: 0 4px 24px rgba(0, 0, 0, 0.06);", light_vars)

open(css_path, 'w', encoding='utf-8').write(content)
print("CSS variables updated")
