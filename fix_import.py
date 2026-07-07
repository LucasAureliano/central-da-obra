import os

path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

if "import { MenuMore }" not in content:
    content = content.replace(
        "import { Calculations } from './components/Calculations';",
        "import { Calculations } from './components/Calculations';\nimport { MenuMore } from './components/MenuMore';"
    )

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("MenuMore imported")
