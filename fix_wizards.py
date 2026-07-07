import os

files = [
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\concrete\ConcreteResult.tsx",
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\concrete\ConcreteWizard.tsx",
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\paint\PaintResult.tsx",
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\paint\PaintWizard.tsx",
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\roof\RoofResult.tsx",
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\roof\RoofWizard.tsx"
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix import path
    content = content.replace("from '../../SmartAssistant';", "from '../SmartAssistant';")
    
    # Fix unused imports
    content = content.replace("CheckCircle2, Download, ListChecks", "CheckCircle2, ListChecks")
    content = content.replace("ArrowLeft, ChevronRight, Check", "ArrowLeft, Check")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed imports")
