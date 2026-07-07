import os

dash_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Dashboard.tsx"
content = open(dash_path, encoding='utf-8').read()

# 1. Update KPI Card to use mesh gradient
content = content.replace(
    'className="card-premium" style={{ backgroundColor: \'var(--color-primary)\'', 
    'className="card-premium card-mesh-gradient animate-stagger-1" style={{ backgroundColor: \'var(--color-primary)\''
)

# 2. Update Quick Actions to stagger 2
content = content.replace(
    '<h3 style={{ fontSize: 16, fontWeight: 700, color: \'var(--text-main)\', marginBottom: 16 }}>Acesso Rápido</h3>',
    '<h3 className="animate-stagger-2" style={{ fontSize: 16, fontWeight: 700, color: \'var(--text-main)\', marginBottom: 16 }}>Acesso Rápido</h3>'
)
content = content.replace(
    '<div style={{ display: \'grid\', gridTemplateColumns: \'repeat(4, 1fr)\', gap: 12 }}>',
    '<div className="animate-stagger-2" style={{ display: \'grid\', gridTemplateColumns: \'repeat(4, 1fr)\', gap: 12 }}>'
)
# Add interactive scale to action buttons
content = content.replace(
    '<div style={{ display: \'flex\', flexDirection: \'column\', alignItems: \'center\', gap: 8, cursor: \'pointer\' }}',
    '<div className="card-premium-interactive" style={{ display: \'flex\', flexDirection: \'column\', alignItems: \'center\', gap: 8, cursor: \'pointer\', padding: \'4px\', borderRadius: \'24px\' }}'
)

# 3. Update Obras em Destaque to Horizontal Scroll and stagger 3
content = content.replace(
    '<div style={{ display: \'flex\', justifyContent: \'space-between\', alignItems: \'center\', marginBottom: 16 }}>',
    '<div className="animate-stagger-3" style={{ display: \'flex\', justifyContent: \'space-between\', alignItems: \'center\', marginBottom: 16 }}>'
)
# Instead of replacing the card entirely, let's wrap it in horizontal-scroll
old_obra = """<div className="card-premium card-premium-interactive" onClick={() => onNavigate('obras')}>"""
new_obra = """<div className="horizontal-scroll animate-stagger-3">
        <div className="card-premium card-premium-interactive" style={{ width: '85vw' }} onClick={() => onNavigate('obras')}>"""
content = content.replace(old_obra, new_obra)

# We need to close the horizontal-scroll div. The card ends with </div></div></div> (card, progress, progress bar)
# Let's just find the Agenda section and insert a closing div before it.
content = content.replace(
    '      {/* Upcoming Agenda / Tasks */}',
    '        </div>\n      </div>\n\n      {/* Upcoming Agenda / Tasks */}'
)

# 4. Update Agenda to stagger 4
content = content.replace(
    '<h3 style={{ fontSize: 16, fontWeight: 700, color: \'var(--text-main)\', marginBottom: 16 }}>Agenda de Hoje</h3>',
    '<h3 className="animate-stagger-4" style={{ fontSize: 16, fontWeight: 700, color: \'var(--text-main)\', marginBottom: 16 }}>Agenda de Hoje</h3>'
)
content = content.replace(
    '<div style={{ display: \'flex\', flexDirection: \'column\', gap: 12 }}>',
    '<div className="animate-stagger-4" style={{ display: \'flex\', flexDirection: \'column\', gap: 12 }}>'
)
# Add interactivity to agenda cards
content = content.replace(
    '<div className="card-premium" style={{ padding: \'16px 20px\'',
    '<div className="card-premium card-premium-interactive" style={{ padding: \'16px 20px\''
)

open(dash_path, 'w', encoding='utf-8').write(content)
print("Dashboard updated")
