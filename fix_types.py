import os

files = [
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\calculators_library\BaianoWallCalc.tsx",
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\calculators_library\ConcreteMixCalc.tsx",
    r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\calculators_library\IsolatedFootingCalc.tsx"
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("import { BaseCalculatorLayout, CalcResultItem, CalcMaterial }", "import { BaseCalculatorLayout, type CalcResultItem, type CalcMaterial }")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed imports")
