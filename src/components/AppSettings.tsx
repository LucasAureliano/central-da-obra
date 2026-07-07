import { useState } from 'react';
import { ArrowLeft, Bell, Shield, Database, Smartphone, Info, ChevronRight, Check } from 'lucide-react';

export function AppSettings({ onBack }: { onBack: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Ajustes do App</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Geral */}
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Geral</h2>
          <div className="glass-panel" style={{ borderRadius: 20, overflow: 'hidden' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={18} />
                </div>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>Notificações Push</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Lembretes e alertas de obras</span>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  backgroundColor: notifications ? 'var(--color-primary)' : 'var(--bg-elevated)',
                  position: 'relative', transition: '0.3s'
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF',
                  position: 'absolute', top: 2, left: notifications ? 22 : 2, transition: '0.3s'
                }} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={18} />
                </div>
                <div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>Modo Offline (Beta)</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Salvar dados localmente</span>
                </div>
              </div>
              <button 
                onClick={() => setOfflineMode(!offlineMode)}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  backgroundColor: offlineMode ? 'var(--color-primary)' : 'var(--bg-elevated)',
                  position: 'relative', transition: '0.3s'
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFF',
                  position: 'absolute', top: 2, left: offlineMode ? 22 : 2, transition: '0.3s'
                }} />
              </button>
            </div>

          </div>
        </section>

        {/* Dados e Privacidade */}
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Privacidade e Dados</h2>
          <div className="glass-panel" style={{ borderRadius: 20, overflow: 'hidden' }}>
            
            <button className="card-premium-interactive" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid var(--border-subtle)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={18} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)' }}>Exportar Meus Dados (CSV)</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </button>

            <button className="card-premium-interactive" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)' }}>Política de Privacidade</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </button>

          </div>
        </section>

        {/* Sobre */}
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>Sobre o App</h2>
          <div className="glass-panel" style={{ borderRadius: 20, padding: 24, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}>
              <Info size={32} color="#FFF" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>Central da Obra</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Versão 1.0.0 Premium</p>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              <Check size={14} /> Sistema Atualizado
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
