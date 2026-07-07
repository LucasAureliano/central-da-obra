import os
import re

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"
app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"

# --- REFACTOR index.css ---
with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Replace the specific block of Prototype/Device classes. 
# They start with /* Shell / Layout Classes */ and end before /* Reusable Components */ or `.screen-content`.
# We can just look for `.prototype-container` and use regex.
# Since it's easier, I'll just append the overriding CSS and use find/replace for some.

new_css_layout = """
/* Responsive Layout */
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-device);
  overflow: hidden;
}

/* Sidebar for Desktop */
.desktop-sidebar {
  display: none;
  width: 250px;
  background-color: var(--bg-surface);
  border-right: 1px solid var(--border-light);
  flex-direction: column;
  padding: 24px 16px;
  flex-shrink: 0;
  z-index: 50;
}

.desktop-sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  padding: 0 8px;
}

.desktop-sidebar-logo span {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}

.desktop-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  margin-bottom: 4px;
}

.desktop-nav-item:hover {
  background-color: var(--bg-surface-hover);
  color: var(--text-main);
}

.desktop-nav-item-active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.desktop-nav-item-active:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary-hover);
}

/* Main Content Wrapper */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background-color: var(--bg-device);
}

/* Make grid responsive */
@media (min-width: 768px) {
  .desktop-sidebar {
    display: flex;
  }
  
  .bottom-nav {
    display: none !important;
  }
  
  .screen-content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px !important;
    width: 100%;
  }
  
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .prototype-controller {
    display: none !important;
  }
}

@media (max-width: 767px) {
  .grid-2, .grid-3 {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}
"""

css += new_css_layout

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)


# --- REFACTOR App.tsx ---
with open(app_path, "r", encoding="utf-8") as f:
    app_ts = f.read()

# I will replace the return block of App component
# finding everything from "return (" to the end, and injecting the new layout.

return_start = app_ts.find("  return (\n    <div className=\"prototype-container\">")
if return_start == -1:
    return_start = app_ts.find("  return (\r\n    <div className=\"prototype-container\">")

if return_start != -1:
    before_return = app_ts[:return_start]
    
    new_return = """  return (
    <div className="app-layout">
      
      {/* 1. Desktop Sidebar */}
      {onboardingFinished && (
        <nav className="desktop-sidebar">
          <div className="desktop-sidebar-logo">
            <div style={{ width: 32, height: 32, backgroundColor: 'var(--color-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardHat size={20} color="#FFF" />
            </div>
            <span>Central da Obra</span>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <button onClick={() => { setActiveTab('inicio'); setActiveWorkId('work-1'); }} className={`desktop-nav-item ${activeTab === 'inicio' ? 'desktop-nav-item-active' : ''}`}>
              <Home size={20} /> Início
            </button>
            <button onClick={() => { setActiveTab('obras'); }} className={`desktop-nav-item ${activeTab === 'obras' ? 'desktop-nav-item-active' : ''}`}>
              <HardHat size={20} /> Obras
            </button>
            <button onClick={() => setActiveTab('team')} className={`desktop-nav-item ${activeTab === 'team' ? 'desktop-nav-item-active' : ''}`}>
              <User size={20} /> Equipe
            </button>
            <button onClick={() => setActiveTab('quotes')} className={`desktop-nav-item ${activeTab === 'quotes' ? 'desktop-nav-item-active' : ''}`}>
              <FileText size={20} /> Orçamentos
            </button>
            <button onClick={() => setActiveTab('agenda')} className={`desktop-nav-item ${activeTab === 'agenda' ? 'desktop-nav-item-active' : ''}`}>
              <Calendar size={20} /> Agenda
            </button>
          </div>
          
          <div style={{ marginTop: 'auto' }}>
            <button onClick={() => setActiveTab('perfil')} className={`desktop-nav-item ${activeTab === 'perfil' ? 'desktop-nav-item-active' : ''}`}>
              <User size={20} /> Perfil
            </button>
          </div>
        </nav>
      )}

      {/* 2. Main Content Area */}
      <main className="main-content">
        {onboardingFinished ? (
          <>
            {/* Screen Render */}
            {renderScreenContent()}

            {/* Bottom Nav Bar - Mobile Only */}
            <div className="bottom-nav hide-scrollbar" style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '0 8px', justifyContent: 'flex-start', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
              <button onClick={() => { setActiveTab('inicio'); setActiveWorkId('work-1'); }} className={`bottom-nav-item ${activeTab === 'inicio' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Home size={20} /> Início
              </button>
              <button onClick={() => { setActiveTab('obras'); }} className={`bottom-nav-item ${activeTab === 'obras' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <HardHat size={20} /> Obras
              </button>
              <button onClick={() => setActiveTab('team')} className={`bottom-nav-item ${activeTab === 'team' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <User size={20} /> Equipe
              </button>
              <button onClick={() => setActiveTab('quotes')} className={`bottom-nav-item ${activeTab === 'quotes' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <FileText size={20} /> Orçamentos
              </button>
              <button onClick={() => setActiveTab('agenda')} className={`bottom-nav-item ${activeTab === 'agenda' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <Calendar size={20} /> Agenda
              </button>
              <button onClick={() => setActiveTab('perfil')} className={`bottom-nav-item ${activeTab === 'perfil' ? 'bottom-nav-item-active' : ''}`} style={{ minWidth: 70 }}>
                <User size={20} /> Perfil
              </button>
            </div>
          </>
        ) : (
          <Onboarding onFinishOnboarding={handleFinishOnboarding} />
        )}

        {/* Simulated Quick Transaction Modal */}
        {showQuickTransactionModal && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 210,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16
          }} className="animate-fade-in">
            <form onSubmit={handleQuickTxSubmit} className="card-premium" style={{ width: '100%', maxWidth: 400, backgroundColor: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h3 className="text-sm font-bold text-primary">Lançamento Rápido</h3>
              
              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Descrição</span>
                <input type="text" placeholder="Ex: Diária de Mão de Obra" value={quickTxDesc} onChange={(e) => setQuickTxDesc(e.target.value)} className="input-field" style={{ paddingLeft: 12 }} required />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Valor (R$)</span>
                <input type="number" step="0.01" placeholder="R$ 150.00" value={quickTxAmount} onChange={(e) => setQuickTxAmount(e.target.value)} className="input-field" style={{ paddingLeft: 12 }} required />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Tipo</span>
                <select value={quickTxType} onChange={(e) => setQuickTxType(e.target.value as any)} className="input-field" style={{ paddingLeft: 12 }}>
                  <option value="despesa">Despesa (Saída)</option>
                  <option value="receita">Receita (Aporte)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: 8, fontSize: 12 }}>Confirmar</button>
                <button type="button" onClick={() => setShowQuickTransactionModal(false)} className="btn-secondary" style={{ flex: 1, padding: 8, fontSize: 12 }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Floating Prototype Controller (Only on Desktop) */}
      <div className="prototype-controller" style={{ position: 'fixed', bottom: 20, right: 20, width: 300, zIndex: 1000, boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Sparkles size={16} className="text-primary" />
          <h2 className="text-sm font-bold">Painel Mock</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={triggerSimulatedLoading} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 11, justifyContent: 'flex-start', gap: 6 }}>
            <RefreshCw size={12} className="text-primary" /> Loading
          </button>
          <button onClick={() => setSimulatedError(!simulatedError)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 11, justifyContent: 'flex-start', gap: 6, backgroundColor: simulatedError ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)' }}>
            <WifiOff size={12} className="text-primary" /> Erro de Rede
          </button>
          <button onClick={() => setTempEmptyStates(!tempEmptyStates)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: 11, justifyContent: 'flex-start', gap: 6, backgroundColor: tempEmptyStates ? 'rgba(249, 115, 22, 0.1)' : 'var(--bg-surface)' }}>
            <Database size={12} className="text-primary" /> Estado Vazio
          </button>
        </div>
      </div>
    </div>
  );
}
"""
    app_ts = before_return + new_return

    with open(app_path, "w", encoding="utf-8") as f:
        f.write(app_ts)

print("Layout refactored.")
