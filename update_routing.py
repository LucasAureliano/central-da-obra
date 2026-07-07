import os

# Update App.tsx
app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
content = open(app_path, encoding='utf-8').read()
content = content.replace("import { Calculators } from './components/Calculators';", "import { SmartAssistant } from './components/assistant/SmartAssistant';")
content = content.replace("case 'ferramentas': return <Calculators />;", "case 'ferramentas': return <SmartAssistant onBack={() => setActiveTab('inicio')} />;")
content = content.replace("case 'calculadora-materiais': return <MaterialsCalculator onBack={() => setActiveTab('inicio')} />;\n", "")
open(app_path, 'w', encoding='utf-8').write(content)

# Update Dashboard.tsx
dash_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Dashboard.tsx"
content = open(dash_path, encoding='utf-8').read()
content = content.replace("onClick={() => onNavigate('calculadora-materiais')}", "onClick={() => onNavigate('ferramentas')}")
content = content.replace(">Calculadora de Materiais<", ">Assistente Inteligente<")
content = content.replace("Calcule blocos, cimento e areia em segundos", "Seu consultor técnico digital. Calcule qualquer obra.")
open(dash_path, 'w', encoding='utf-8').write(content)

print("UI updated to point to SmartAssistant")
