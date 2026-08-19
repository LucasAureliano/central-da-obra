import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Lock, LayoutDashboard, Clock, ChevronRight } from 'lucide-react';
import { CustomLogo } from '../CustomLogo';
import { PortalDashboard } from './PortalDashboard';
import { PortalTimeline } from './PortalTimeline';
import { AnimatePresence, motion } from 'framer-motion';

export function ClientPortal({ token, theme }: { token: string; theme: 'light' | 'dark' }) {
  const [work, setWork] = useState<any>(null);
  const [linkData, setLinkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'timeline'>('dashboard');

  useEffect(() => {
    async function fetchLink() {
      try {
        const q = query(collection(db, 'shared_links'), where('token', '==', token));
        const snap = await getDocs(q);
        
        if (snap.empty) {
          setErrorMsg('Link de acompanhamento não encontrado ou inválido.');
          setLoading(false);
          return;
        }
        
        const data = snap.docs[0].data();
        
        // Check if active
        if (data.active === false) {
          setErrorMsg('Este link foi desativado pelo administrador.');
          setLoading(false);
          return;
        }

        // Check if expired
        if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
          setErrorMsg('Este link expirou.');
          setLoading(false);
          return;
        }

        setLinkData(data);
        
        if (!data.password) {
          setIsAuthenticated(true);
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMsg('Erro ao acessar o portal.');
        setLoading(false);
      }
    }
    fetchLink();
  }, [token]);

  useEffect(() => {
    async function fetchWork() {
      if (isAuthenticated && linkData?.workId) {
        try {
          const docRef = doc(db, 'works', linkData.workId);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setWork({ id: docSnap.id, ...docSnap.data() });
          } else {
            setErrorMsg('Obra não encontrada.');
          }
        } catch (err) {
          console.error(err);
          setErrorMsg('Erro ao carregar dados da obra.');
        }
      }
    }
    fetchWork();
  }, [isAuthenticated, linkData]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === linkData?.password) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ color: 'var(--color-primary)' }}>Conectando ao Portal...</div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-main)', padding: 24, textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <CustomLogo theme={theme} />
        </div>
        <div style={{ padding: 24, background: 'var(--bg-elevated)', borderRadius: 16, border: '1px solid var(--border-subtle)', maxWidth: 400, width: '100%' }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--color-danger-alpha)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={24} />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Acesso Negado</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--bg-base)', 
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Elements */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', width: 300, height: 300, background: 'var(--color-primary)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: 250, height: 250, background: 'var(--color-secondary)', filter: 'blur(100px)', opacity: 0.1, borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 400, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
            <CustomLogo theme={theme} />
          </div>
          
          <div className="glass-panel" style={{ padding: 32, borderRadius: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Lock size={32} />
            </div>
            
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, textAlign: 'center' }}>Portal do Cliente</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', marginBottom: 32 }}>
              Este acompanhamento é protegido por senha. Insira sua credencial para acessar.
            </p>
            
            <form onSubmit={handlePasswordSubmit} style={{ width: '100%' }}>
              <div style={{ marginBottom: 20 }}>
                <input
                  type="password"
                  placeholder="Senha de Acesso"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: 12,
                    border: `1px solid ${passwordError ? 'var(--color-danger)' : 'var(--border-subtle)'}`,
                    backgroundColor: 'var(--bg-base)',
                    color: 'var(--text-main)',
                    fontSize: 16,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
                <AnimatePresence>
                  {passwordError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      style={{ color: 'var(--color-danger)', fontSize: 12, marginTop: 8 }}
                    >
                      Senha incorreta. Tente novamente.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
              >
                Acessar Portal <ChevronRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ color: 'var(--color-primary)' }}>Carregando dados da obra...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Top Header */}
      <header className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border-subtle)' }}>
        <CustomLogo theme={theme} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 600px)': { display: 'block' } } as any}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>Portal do Cliente</div>
            <div style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 600 }}>{work.client || 'Acompanhamento'}</div>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
            {(work.client || 'C')[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main style={{ flex: 1, paddingBottom: 80, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            style={{ height: '100%' }}
          >
            {activeTab === 'dashboard' ? (
              <PortalDashboard work={work} />
            ) : (
              <PortalTimeline workId={work.id} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="glass-panel" style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: 'env(safe-area-inset-bottom, 12px) 20px 12px',
        display: 'flex', 
        justifyContent: 'center', 
        gap: 8,
        borderTop: '1px solid var(--border-subtle)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', maxWidth: 400, width: '100%', gap: 8 }}>
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 4,
              padding: '8px 0',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'dashboard' ? 'var(--color-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              padding: '6px 16px', 
              borderRadius: 16, 
              backgroundColor: activeTab === 'dashboard' ? 'var(--color-primary-alpha)' : 'transparent',
              transition: 'all 0.2s'
            }}>
              <LayoutDashboard size={22} />
            </div>
            <span style={{ fontSize: 11, fontWeight: activeTab === 'dashboard' ? 600 : 500 }}>Visão Geral</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('timeline')}
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 4,
              padding: '8px 0',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'timeline' ? 'var(--color-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              padding: '6px 16px', 
              borderRadius: 16, 
              backgroundColor: activeTab === 'timeline' ? 'var(--color-primary-alpha)' : 'transparent',
              transition: 'all 0.2s'
            }}>
              <Clock size={22} />
            </div>
            <span style={{ fontSize: 11, fontWeight: activeTab === 'timeline' ? 600 : 500 }}>Linha do Tempo</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
