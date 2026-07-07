import re

path = 'src/App.tsx'
content = open(path, encoding='utf-8').read()

# Change default activeTab from 'central' to 'painel'
content = re.sub(r'const \[activeTab, setActiveTab\] = useState<.*?\(.*?\)', "const [activeTab, setActiveTab] = useState<TabType>('painel')", content)

# Remove the 'mais' case in the switch
content = re.sub(r"case 'mais':\s*return\s*<MenuMore[^>]*/>;", "", content)

# Remove the import of MenuMore
content = re.sub(r"import \{ MenuMore \} from '\./components/MenuMore';\n", "", content)

# Restore the 7-item bottom nav instead of the 5-item one
old_nav = """      <div className="bottom-nav hide-scrollbar">
        <button 
          className={`bottom-nav-item ${activeTab === 'painel' ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setActiveTab('painel')}
        >
          <BarChart3 size={20} />
          <span>Painel</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'obras' ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setActiveTab('obras')}
        >
          <Building2 size={20} />
          <span>Obras</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'calculadoras' ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setActiveTab('calculadoras')}
        >
          <Calculator size={20} />
          <span>Calc</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'financas' ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setActiveTab('financas')}
        >
          <Wallet size={20} />
          <span>Finanças</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'compras' ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setActiveTab('compras')}
        >
          <ShoppingCart size={20} />
          <span>Compras</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'equipe' ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setActiveTab('equipe')}
        >
          <Users size={20} />
          <span>Equipe</span>
        </button>
        <button 
          className={`bottom-nav-item ${activeTab === 'perfil' ? 'bottom-nav-item-active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          <User size={20} />
          <span>Perfil</span>
        </button>
      </div>"""

content = re.sub(r'<div className="bottom-nav">.*?</div>\s*</main>', old_nav + "\n      </main>", content, flags=re.DOTALL)

open(path, 'w', encoding='utf-8').write(content)
