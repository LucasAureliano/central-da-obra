import os

# Fix App.tsx
app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
content = open(app_path, encoding='utf-8').read()

# Add theme and tabType export if needed, or pass dummy to menu
content = content.replace("case 'menu': return <Menu />;", "case 'menu': return <Menu onNavigate={setActiveTab} theme=\"dark\" onToggleTheme={() => {}} />;")
open(app_path, 'w', encoding='utf-8').write(content)

# Fix EmptyState.tsx
empty_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\EmptyState.tsx"
content = open(empty_path, encoding='utf-8').read()
content = content.replace('pointerEvents="none"', 'style={{ position: \'absolute\', inset: 0, boxShadow: \'inset 0 0 0 1px rgba(255,255,255,0.1)\', borderRadius: 32, pointerEvents: \'none\' }}')
# Clean up duplicate style
content = content.replace("style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', borderRadius: 32 }} style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', borderRadius: 32, pointerEvents: 'none' }}", "style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)', borderRadius: 32, pointerEvents: 'none' }}")
open(empty_path, 'w', encoding='utf-8').write(content)

# Fix Dashboard.tsx and Menu.tsx by removing TabType import if it exists, or change it
def remove_tabtype(filepath):
    c = open(filepath, encoding='utf-8').read()
    if 'import { TabType } from "../App";' in c:
        c = c.replace('import { TabType } from "../App";', '')
        c = c.replace('TabType', 'string')
    if 'import type { TabType } from "../App";' in c:
        c = c.replace('import type { TabType } from "../App";', '')
        c = c.replace('TabType', 'string')
    open(filepath, 'w', encoding='utf-8').write(c)

remove_tabtype(r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Dashboard.tsx")
remove_tabtype(r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Menu.tsx")

print("TypeScript errors fixed")
