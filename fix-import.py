import os

with open('src/components/connect/public/PublicProfileView.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace("import { Logo } from '../../../ui/Logo';", "import { Logo } from '../../ui/Logo';")

with open('src/components/connect/public/PublicProfileView.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Fixed import")
