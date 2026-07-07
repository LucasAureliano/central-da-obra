import os

path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Calculators.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_cat_render = """      {/* 1. Grid of Categories */}
      {!selectedCategory && !activeCalculator && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="card-premium card-premium-interactive flex-space-between" 
              onClick={() => setSelectedCategory(cat.id as CategoryType)}
              style={{ padding: '16px 20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {cat.name.split(' ')[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold">{cat.name.substring(cat.name.indexOf(' ') + 1)}</h3>
                  <p className="text-xs text-muted">{cat.count} calculadoras</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted" />
            </div>
          ))}
        </div>
      )}"""

new_cat_render = """      {/* 1. Grid of Categories (App Store Premium Style) */}
      {!selectedCategory && !activeCalculator && (
        <div style={{ padding: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: 20 }}>Categorias Técnicas</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {categories.map((cat, index) => {
              const icon = cat.name.split(' ')[0];
              const title = cat.name.substring(cat.name.indexOf(' ') + 1);
              const colors = [
                ['#eff6ff', '#3b82f6'], // blue
                ['#fef3c7', '#f59e0b'], // orange
                ['#ecfdf5', '#10b981'], // green
                ['#f3e8ff', '#a855f7'], // purple
                ['#fee2e2', '#ef4444'], // red
                ['#ffedd5', '#f97316'], // dark orange
                ['#e0f2fe', '#0ea5e9']  // light blue
              ];
              const colorSet = colors[index % colors.length];

              return (
                <div 
                  key={cat.id} 
                  className="glass-card"
                  onClick={() => setSelectedCategory(cat.id as CategoryType)}
                  style={{ 
                    padding: '20px 16px', borderRadius: 20, cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', gap: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
                  }}
                >
                  <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: 40, background: colorSet[0], opacity: 0.5 }} />
                  
                  <div style={{ 
                    width: 48, height: 48, borderRadius: 16, 
                    backgroundColor: colorSet[0], color: colorSet[1],
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                    position: 'relative', zIndex: 1
                  }}>
                    {icon}
                  </div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>{cat.count} ferramentas</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}"""

# Note: --text-main was fixed recently, so it's in the file.
if new_cat_render in content:
    content = content.replace(new_cat_render, old_cat_render)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Calculators REVERTED.")
else:
    print("Calculators new render not found.")
