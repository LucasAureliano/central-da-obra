import { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './ui/Logo';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface RegisterProps {
  onGoToLogin: () => void;
  theme?: 'light' | 'dark';
}

export function Register({ onGoToLogin, theme = 'dark' }: RegisterProps) {
  const { loginAsGuest, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Save to firestore manually here if you want to ensure name is saved before onAuthStateChanged fires,
      // but onAuthStateChanged will handle the rest in AuthContext.
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '120%', height: '50%', background: 'radial-gradient(ellipse at top, rgba(255,107,0,0.15), transparent 70%)', pointerEvents: 'none' }} />
      
      <div className="animate-stagger-1" style={{ marginBottom: 48, transform: 'scale(1.2)' }}>
        <Logo variant="horizontal" theme={theme} />
      </div>

      <div className="glass-panel animate-stagger-2" style={{ width: '100%', maxWidth: 400, padding: 32, borderRadius: 32, border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-elevated)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Criar Conta</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Junte-se à nova era da gestão de obras.</p>
        
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <UserIcon size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Nome completo"
              className="input-premium"
              style={{ paddingLeft: 48, backgroundColor: 'var(--bg-input-glass)' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="email"
              placeholder="E-mail profissional"
              className="input-premium"
              style={{ paddingLeft: 48, backgroundColor: 'var(--bg-input-glass)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="password"
              placeholder="Crie uma senha forte"
              className="input-premium"
              style={{ paddingLeft: 48, backgroundColor: 'var(--bg-input-glass)' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary card-premium-interactive" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                Começar agora <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-subtle)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ou cadastre-se com</span>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <button 
            type="button" 
            onClick={async () => {
              try {
                setLoading(true);
                setError('');
                await signInWithGoogle();
              } catch (err: any) {
                console.error(err);
                if (err.code === 'auth/unauthorized-domain') {
                  setError('O domínio atual não está autorizado no Firebase Authentication (Painel do Firebase -> Authentication -> Settings -> Authorized domains).');
                } else if (err.code === 'auth/operation-not-allowed') {
                  setError('O provedor de login do Google não está ativado. Ative em: Authentication -> Sign-in method -> Google.');
                } else {
                  setError('Erro ao fazer login com o Google: ' + (err.message || 'Erro desconhecido.'));
                }
              } finally {
                setLoading(false);
              }
            }} 
            className="btn-secondary card-premium-interactive" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#FFF" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#FFF" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FFF" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#FFF" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>


          <button 
            type="button"
            onClick={async () => {
              try {
                setLoading(true);
                setError('');
                await loginAsGuest();
              } catch (err: any) {
                console.error(err);
                if (err.code === 'auth/operation-not-allowed') {
                  setError('O login anônimo não está ativado no Firebase. Ative em: Authentication -> Sign-in method -> Anonymous.');
                } else {
                  setError('Erro ao entrar como visitante: ' + (err.message || 'Erro desconhecido.'));
                }
              } finally {
                setLoading(false);
              }
            }}
            style={{ 
              marginTop: 8,
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 16,
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.2s',
              opacity: 0.8
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            Entrar sem se registrar
          </button>
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Já possui uma conta?{' '}
            <span style={{ fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }} onClick={onGoToLogin}>
              Fazer login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
