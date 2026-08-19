import os
import re

with open('src/components/Menu.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the builder's connect action
content = content.replace(
    "label: 'CentralObra Connect', color: '#8B5CF6', action: () => { toast.success('Portal do cliente ativo!'); }",
    "label: 'CentralObra Connect', color: '#8B5CF6', action: () => onMenuSelect('connect')"
)

with open('src/components/Menu.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
