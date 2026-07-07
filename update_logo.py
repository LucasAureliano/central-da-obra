import os

logo_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\CustomLogo.tsx"
content = open(logo_path, encoding='utf-8').read()
content = content.replace("Central<span style={{ color: 'var(--color-primary)' }}>.</span>", "Central da Obra<span style={{ color: 'var(--color-primary)' }}>.</span>")
open(logo_path, 'w', encoding='utf-8').write(content)
print("Logo updated")
