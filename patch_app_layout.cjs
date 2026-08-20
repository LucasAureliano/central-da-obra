const fs = require('fs');

let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

const importTarget = `import { Home, Briefcase, Sparkles, Calculator, Calendar, Menu as MenuIcon } from 'lucide-react';`;
const importReplacement = `import { Home, Briefcase, Sparkles, Calculator, Calendar, Menu as MenuIcon, Globe, Wallet, ClipboardCheck, BookOpen, Building2 } from 'lucide-react';`;
code = code.replace(importTarget, importReplacement);

const sidebarTargetRegex = /<aside className="sidebar-nav glass-panel">[\s\S]*?<\/aside>/;
const sidebarReplacement = `<aside className="sidebar-nav glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 16 }}>
          <CustomLogo theme={theme} />
        </div>
        
        <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}>
          
          {/* GRUPO PRINCIPAL */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 12, marginBottom: 8, display: 'block' }}>Geral</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
               <button className={\`nav-item-desktop \${activeTab === 'inicio' ? 'active' : ''}\`} onClick={() => setActiveTab('inicio')}>
                  <Home size={20} /><span>Início</span>
               </button>
               <button className={\`nav-item-desktop \${activeTab === 'obras' ? 'active' : ''}\`} onClick={() => setActiveTab('obras')}>
                  <Briefcase size={20} /><span>{(activeRole === 'architect' || activeRole === 'engineer') ? 'Projetos' : 'Obras'}</span>
               </button>
               <button className={\`nav-item-desktop \${activeTab === 'assistente' ? 'active' : ''}\`} onClick={() => setActiveTab('assistente')}>
                  <Sparkles size={20} /><span>Assistente IA</span>
               </button>
               <button className={\`nav-item-desktop \${activeTab === 'connect' ? 'active' : ''}\`} onClick={() => setActiveTab('connect')}>
                  <Globe size={20} /><span>Connect</span>
               </button>
            </div>
          </div>

          {/* GRUPO FERRAMENTAS */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: 12, marginBottom: 8, display: 'block' }}>Ferramentas</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button className={\`nav-item-desktop \${activeTab === 'calculos' || activeTab === 'Calculadoras' ? 'active' : ''}\`} onClick={() => setActiveTab('calculos')}>
                  <Calculator size={20} /><span>Calculadoras</span>
              </button>
              {(activeRole === 'architect' || activeRole === 'engineer' || activeRole === 'service') && (
                <button className={\`nav-item-desktop \${activeTab === 'agenda-completa' || activeTab === 'Agenda' ? 'active' : ''}\`} onClick={() => setActiveTab('agenda-completa')}>
                    <Calendar size={20} /><span>Agenda</span>
                </button>
              )}
              {(activeRole === 'owner' || activeRole === 'builder') && (
                <button className={\`nav-item-desktop \${activeTab === 'Financeiro' ? 'active' : ''}\`} onClick={() => setActiveTab('Financeiro')}>
                    <Wallet size={20} /><span>Financeiro</span>
                </button>
              )}
              {(activeRole === 'builder') && (
                <button className={\`nav-item-desktop \${activeTab === 'Centro de Operações' ? 'active' : ''}\`} onClick={() => setActiveTab('Centro de Operações')}>
                    <Building2 size={20} /><span>Operações</span>
                </button>
              )}
              {(activeRole === 'owner' || activeRole === 'architect' || activeRole === 'engineer') && (
                <button className={\`nav-item-desktop \${activeTab === 'notas' ? 'active' : ''}\`} onClick={() => setActiveTab('notas')}>
                    <ClipboardCheck size={20} /><span>Notas da Obra</span>
                </button>
              )}
              <button className={\`nav-item-desktop \${activeTab === 'Biblioteca & Normas' ? 'active' : ''}\`} onClick={() => setActiveTab('Biblioteca & Normas')}>
                  <BookOpen size={20} /><span>Biblioteca Téc.</span>
              </button>
            </div>
          </div>
          
          {/* CONFIGURAÇÕES */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button className={\`nav-item-desktop \${activeTab === 'menu' ? 'active' : ''}\`} onClick={() => setActiveTab('menu')}>
                  <MenuIcon size={20} /><span>Menu Completo</span>
              </button>
            </div>
          </div>

        </div>

        <div style={{ padding: 20, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 16, 
            backgroundColor: user ? 'var(--color-primary)' : 'var(--bg-glass)',
            color: user ? '#FFF' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 14,
            border: '1px solid var(--border-subtle)'
          }}>
            {user && user.email ? user.email[0].toUpperCase() : 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{user ? 'Minha Conta' : 'Visitante'}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user ? user.email : 'Faça login'}</span>
          </div>
        </div>
      </aside>`;

code = code.replace(sidebarTargetRegex, sidebarReplacement);

fs.writeFileSync('src/components/layout/AppLayout.tsx', code, 'utf8');
