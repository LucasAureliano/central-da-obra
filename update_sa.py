import os

path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\assistant\SmartAssistant.tsx"
content = open(path, encoding='utf-8').read()

imports = """
import { MasonryWizard } from './masonry/MasonryWizard';
import { RoofWizard } from './roof/RoofWizard';
import { ConcreteWizard } from './concrete/ConcreteWizard';
import { PaintWizard } from './paint/PaintWizard';
"""

content = content.replace("import { MasonryWizard } from './masonry/MasonryWizard';", imports)

logic = """
  // Se já escolheu a categoria e o modo, renderiza o Wizard específico
  if (category === 'wall' && mode) {
    return <MasonryWizard mode={mode} onBack={() => setMode(null)} onHome={onBack} />;
  }
  if (category === 'roof' && mode) {
    return <RoofWizard mode={mode} onBack={() => setMode(null)} onHome={onBack} />;
  }
  if (category === 'concrete' && mode) {
    return <ConcreteWizard mode={mode} onBack={() => setMode(null)} onHome={onBack} />;
  }
  if (category === 'paint' && mode) {
    return <PaintWizard mode={mode} onBack={() => setMode(null)} onHome={onBack} />;
  }
"""

old_logic = """
  // Se já escolheu a categoria e o modo, renderiza o Wizard específico
  if (category === 'wall' && mode) {
    return <MasonryWizard mode={mode} onBack={() => setMode(null)} onHome={onBack} />;
  }
"""

content = content.replace(old_logic, logic)

open(path, 'w', encoding='utf-8').write(content)
print("Updated SmartAssistant.tsx")
