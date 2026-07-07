import os

works_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Works.tsx"
content = open(works_path, encoding='utf-8').read()

# Make the works list staggered
# The map function generates a list of cards. I will add a staggered animation class dynamically to each card.
content = content.replace(
    'className="card-premium card-premium-interactive"',
    'className={`card-premium card-premium-interactive animate-stagger-${Math.min((index + 1), 5)}`}'
)
# Add 'index' to the map callback
content = content.replace(
    '{works.map(work => (',
    '{works.map((work, index) => ('
)

# Enhance the gradient overlay on Works
content = content.replace(
    'background: \'linear-gradient(to top, rgba(0,0,0,0.8), transparent)\'',
    'background: \'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)\''
)

open(works_path, 'w', encoding='utf-8').write(content)
print("Works updated")

menu_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Menu.tsx"
content = open(menu_path, encoding='utf-8').read()

# Add staggers to menu items
content = content.replace(
    '<div key={idx}>',
    '<div key={idx} className={`animate-stagger-${Math.min((idx + 1), 5)}`}>'
)
# Make menu header staggered too
content = content.replace(
    '<div style={{ display: \'flex\', alignItems: \'center\', gap: 16, marginBottom: 32 }}>',
    '<div className="animate-stagger-1" style={{ display: \'flex\', alignItems: \'center\', gap: 16, marginBottom: 32 }}>'
)
content = content.replace(
    '<div style={{ display: \'flex\', flexDirection: \'column\', gap: 24 }}>',
    '<div style={{ display: \'flex\', flexDirection: \'column\', gap: 24 }}>'
)

open(menu_path, 'w', encoding='utf-8').write(content)
print("Menu updated")
