import os

app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
content = open(app_path, encoding='utf-8').read()

# Add import
import_str = "import { CalculatorLibrary } from './components/calculators_library/CalculatorLibrary';\n"
if "CalculatorLibrary" not in content:
    content = content.replace("import { SmartAssistant }", import_str + "import { SmartAssistant }")

# Add route
if "case 'library': return <CalculatorLibrary />;" not in content:
    content = content.replace("case 'obras': return <Obras />;", "case 'obras': return <Obras />;\n      case 'library': return <CalculatorLibrary />;")

open(app_path, 'w', encoding='utf-8').write(content)

dash_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Dashboard.tsx"
content = open(dash_path, encoding='utf-8').read()

# I don't want to change the central banner, the central banner points to Smart Assistant ('ferramentas').
# The user wants "acesso direto pelo menu Calculadoras".
# I'll update BottomNav in App.tsx. Let's do that next.
open(dash_path, 'w', encoding='utf-8').write(content)

print("Added library route in App.tsx")
