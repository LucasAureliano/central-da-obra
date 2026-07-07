import React, { useState, useEffect } from 'react';
import { HardHat, ArrowRight, Mail, Lock, User, KeyRound, CheckCircle2 } from 'lucide-react';

interface OnboardingProps {
  onFinishOnboarding: (profile: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onFinishOnboarding }) => {
  const [step, setStep] = useState<'splash' | 'login' | 'register' | 'recovery' | 'profile-select'>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showRecoverySuccess, setShowRecoverySuccess] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Auto transition from Splash
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('login');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'splash') {
    return (
      <div className="screen-content-no-nav flex-row-center animate-fade-in" style={{ 
        justifyContent: 'center', 
        height: '100%', 
        background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-device) 100%)',
        textAlign: 'center',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '24px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(249, 115, 22, 0.3)',
            transform: 'rotate(-5deg)'
          }}>
            <HardHat size={44} color="#FFF" />
          </div>
          <h1 className="text-3xl font-black" style={{ marginTop: 8 }}>
            Central da <span className="text-primary">Obra</span>
          </h1>
          <p className="text-base text-muted font-medium" style={{ letterSpacing: '0.05em' }}>
            Sua obra do início ao fim.
          </p>
          
          <div className="animate-pulse" style={{ marginTop: 40, width: 32, height: 4, borderRadius: 2, backgroundColor: 'var(--color-primary)' }}></div>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className="screen-content-no-nav animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '20px 0 30px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            backgroundColor: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HardHat size={28} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Bem-vindo de volta</h2>
          <p className="text-sm text-muted">Acesse seu painel da Central da Obra</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep('profile-select'); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-group">
            <span className="input-label">E-mail</span>
            <div className="input-field-wrapper">
              <span className="input-icon-left"><Mail size={18} /></span>
              <input 
                type="email" 
                placeholder="exemplo@email.com" 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="flex-space-between">
              <span className="input-label">Senha</span>
              <button 
                type="button" 
                onClick={() => setStep('recovery')} 
                className="text-xs text-primary font-semibold"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Esqueceu a senha?
              </button>
            </div>
            <div className="input-field-wrapper">
              <span className="input-icon-left"><Lock size={18} /></span>
              <input 
                type="password" 
                placeholder="Sua senha" 
                className="input-field" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 12 }}>
            Entrar com E-mail <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-light)' }}></div>
          <span className="text-xs text-muted font-medium">OU ENTRE COM</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-light)' }}></div>
        </div>

        <div className="grid-2" style={{ gap: 12 }}>
          <button 
            type="button" 
            onClick={() => setStep('profile-select')} 
            className="btn-secondary"
            style={{ fontSize: 13, gap: 6 }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.483 0-6.312-2.83-6.312-6.314s2.83-6.312 6.312-6.312c1.614 0 3.082.614 4.194 1.616l3.03-3.03C19.167 2.378 15.937 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.787 0 10.427-4.103 10.427-10.428 0-.663-.07-1.3-.2-1.767H12.24z"/>
            </svg>
            Google
          </button>
          <button 
            type="button" 
            onClick={() => setStep('profile-select')} 
            className="btn-secondary"
            style={{ fontSize: 13, gap: 6 }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 3 .15.11.27.17.39.17 1.01 0 2.21-.61 2.61-1.62z"/>
            </svg>
            Apple
          </button>
        </div>

        <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: 10 }}>
          <p className="text-sm text-muted">
            Novo na plataforma?{' '}
            <button 
              onClick={() => setStep('register')} 
              className="text-primary font-bold"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Criar conta
            </button>
          </p>
          
          <button 
            onClick={() => setStep('profile-select')} 
            className="text-xs text-muted font-semibold"
            style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 12, textDecoration: 'underline' }}
          >
            Continuar sem conta (Modo Demo)
          </button>
        </div>
      </div>
    );
  }

  if (step === 'register') {
    return (
      <div className="screen-content-no-nav animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '20px 0 20px' }}>
          <h2 className="text-2xl font-bold">Criar sua Conta</h2>
          <p className="text-sm text-muted">Comece a gerenciar suas obras</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setStep('profile-select'); }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="input-group">
            <span className="input-label">Nome Completo</span>
            <div className="input-field-wrapper">
              <span className="input-icon-left"><User size={18} /></span>
              <input 
                type="text" 
                placeholder="Seu nome" 
                className="input-field" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <span className="input-label">E-mail</span>
            <div className="input-field-wrapper">
              <span className="input-icon-left"><Mail size={18} /></span>
              <input 
                type="email" 
                placeholder="exemplo@email.com" 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <span className="input-label">Senha</span>
            <div className="input-field-wrapper">
              <span className="input-icon-left"><Lock size={18} /></span>
              <input 
                type="password" 
                placeholder="Mínimo 6 caracteres" 
                className="input-field" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 12 }}>
            Cadastrar e Continuar <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: 10 }}>
          <p className="text-sm text-muted">
            Já tem uma conta?{' '}
            <button 
              onClick={() => setStep('login')} 
              className="text-primary font-bold"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Fazer Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (step === 'recovery') {
    return (
      <div className="screen-content-no-nav animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, margin: '20px 0 30px' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            backgroundColor: 'var(--color-primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <KeyRound size={28} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Recuperar Senha</h2>
          <p className="text-sm text-muted">Insira seu e-mail para recuperar o acesso</p>
        </div>

        {showRecoverySuccess ? (
          <div className="card-premium animate-fade-in" style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <CheckCircle2 size={44} className="text-primary" style={{ color: '#22c55e' }} />
            <h3 className="text-lg font-bold">E-mail Enviado!</h3>
            <p className="text-sm text-muted">Enviamos as instruções para recuperação no e-mail fornecido. Por favor, verifique sua caixa de entrada e spam.</p>
            <button onClick={() => { setShowRecoverySuccess(false); setStep('login'); }} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>
              Voltar ao Login
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setShowRecoverySuccess(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="input-group">
              <span className="input-label">E-mail de Cadastro</span>
              <div className="input-field-wrapper">
                <span className="input-icon-left"><Mail size={18} /></span>
                <input 
                  type="email" 
                  placeholder="exemplo@email.com" 
                  className="input-field" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: 12 }}>
              Enviar Instruções
            </button>
            
            <button 
              type="button" 
              onClick={() => setStep('login')} 
              className="btn-secondary"
            >
              Cancelar
            </button>
          </form>
        )}
      </div>
    );
  }

  // Profile Selector
  const profiles = [
    { id: 'proprietario', title: '🏠 Proprietário', desc: 'Acompanhe sua obra, gastos e relatórios de forma simples.' },
    { id: 'prestador', title: '👷 Prestador de Serviço', desc: 'Gerencie diários, tarefas, clientes e cálculos rápidos.' },
    { id: 'arquiteto', title: '📐 Arquiteto / Eng.', desc: 'Gerencie projetos, orçamentos, relatórios e calculadoras.' },
    { id: 'construtora', title: '🏢 Construtora', desc: 'Controle multiobras, relatórios avançados, compras e estoque.' },
  ];

  return (
    <div className="screen-content-no-nav animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, margin: '10px 0 20px', textAlign: 'center' }}>
        <h2 className="text-2xl font-bold">Escolha seu Perfil</h2>
        <p className="text-sm text-muted">Qual perfil melhor representa você?</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {profiles.map((p) => (
          <div 
            key={p.id} 
            onClick={() => setSelectedProfile(p.id)}
            className={`card-premium card-premium-interactive ${selectedProfile === p.id ? 'border-primary' : ''}`}
            style={{ 
              border: selectedProfile === p.id ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
              backgroundColor: selectedProfile === p.id ? 'var(--color-primary-light)' : 'var(--bg-surface)',
              padding: '14px 16px'
            }}
          >
            <h3 className="text-base font-bold" style={{ marginBottom: 4 }}>{p.title}</h3>
            <p className="text-xs text-muted" style={{ color: selectedProfile === p.id ? 'var(--text-main)' : 'var(--text-muted)' }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <button 
        onClick={() => {
          if (selectedProfile) {
            onFinishOnboarding(selectedProfile);
          }
        }} 
        disabled={!selectedProfile}
        className="btn-primary" 
        style={{ marginTop: 'auto', opacity: selectedProfile ? 1 : 0.6 }}
      >
        Acessar Painel <ArrowRight size={18} />
      </button>
    </div>
  );
};
