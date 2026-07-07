import os
import glob

# Hardcoded rgba to CSS variables
replacements = {
    "backgroundColor: 'rgba(255,255,255,0.03)'": "backgroundColor: 'var(--bg-input-glass)'",
    "backgroundColor: 'rgba(255,255,255,0.01)'": "backgroundColor: 'var(--bg-card-glass)'"
}

files = glob.glob(r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\*.tsx")
for f in files:
    content = open(f, encoding='utf-8').read()
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
    
    # CustomLogo needs to take theme
    if "CustomLogo.tsx" in f:
        new_content = new_content.replace("export function CustomLogo() {", "export function CustomLogo({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {")
        new_content = new_content.replace("logo_3d.jpg", "{theme === 'dark' ? 'logo_3d.jpg' : 'logo_light_3d.jpg'}")
        # Need to fix the img src string interpolation
        new_content = new_content.replace('src="/assets/{theme === \'dark\' ? \'logo_3d.jpg\' : \'logo_light_3d.jpg\'}"', 'src={`/assets/${theme === \'dark\' ? \'logo_3d.jpg\' : \'logo_light_3d.jpg\'}`}')

    if content != new_content:
        open(f, 'w', encoding='utf-8').write(new_content)
        print(f"Updated {f}")

print("Hardcoded colors fixed")
