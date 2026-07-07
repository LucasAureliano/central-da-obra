import os

app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
content = open(app_path, encoding='utf-8').read()
content = content.replace("import { MaterialsCalculator } from './components/MaterialsCalculator';\n", "")
open(app_path, 'w', encoding='utf-8').write(content)

result_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\masonry\MasonryResult.tsx"
content = open(result_path, encoding='utf-8').read()
content = content.replace("import type { AssistantMode } from '../../SmartAssistant';", "import type { AssistantMode } from '../SmartAssistant';")
open(result_path, 'w', encoding='utf-8').write(content)

wizard_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\masonry\MasonryWizard.tsx"
content = open(wizard_path, encoding='utf-8').read()
content = content.replace("import { ArrowLeft, ChevronRight, Check } from 'lucide-react';", "import { ArrowLeft, ChevronRight, Check, Sparkles } from 'lucide-react';")
open(wizard_path, 'w', encoding='utf-8').write(content)

print("TS errors fixed")
