import os

path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("Home,", "Home,\n  Sparkles,")
content = content.replace("InÃ­cio", "Início")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed App.tsx")
