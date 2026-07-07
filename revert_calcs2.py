import re

path = 'src/components/Calculators.tsx'
content = open(path, encoding='utf-8').read()

new_content = re.sub(r'\{/\* 1\. Grid of Categories.*?(?=\{/\* 2\. Recent Calcs \*/\})', """{/* 1. Grid of Categories */}
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
      )}

      """, content, flags=re.DOTALL)

open(path, 'w', encoding='utf-8').write(new_content)
