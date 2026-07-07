import React from 'react';
import { 
  User, Sun, Moon, Shield, LogOut, RotateCcw, UserCheck, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileProps {
  currentProfile: string;
  theme: 'light' | 'dark';
  onChangeProfile: (profile: string) => void;
  onChangeTheme: (theme: 'light' | 'dark') => void;
  onResetData: () => void;
  onLogout: () => void;
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({
  currentProfile,
  theme,
  onChangeProfile,
  onChangeTheme,
  onResetData,
  onLogout,
  onBack
}) => {
  const { user, profile } = useAuth();

  const getProfileName = (prof: string) => {
    switch (prof) {
      case 'proprietario': return '🏠 Proprietário';
      case 'prestador': return '👷 Prestador de Serviço';
      case 'arquiteto': return '📐 Arquiteto / Engenheiro';
      case 'construtora': return '🏢 Construtora';
      default: return 'Desconhecido';
    }
  };

  const displayName = profile?.name || user?.displayName || 'Visitante';
  const displayEmail = user?.email || 'Faça login para salvar seus dados';

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Meu Perfil</h1>
      </div>

      <div style={{ textAlign: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-light)', marginBottom: 20 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary-light)',
          border: '2px solid var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          overflow: 'hidden'
        }}>
          {user?.photoURL ? (
            <img src={user.photoURL} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={32} className="text-primary" />
          )}
        </div>
        <h2 className="text-lg font-bold">{displayName}</h2>
        <p className="text-xs text-muted">{displayEmail}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        {/* Profile configuration */}
        <div className="card-premium">
          <h3 className="text-sm font-bold flex-row-center" style={{ gap: 8, marginBottom: 12 }}>
            <UserCheck size={18} className="text-primary" /> Perfil Ativo
          </h3>
          <p className="text-xs text-muted" style={{ marginBottom: 12 }}>
            Seu perfil atual personaliza o painel do aplicativo. Altere abaixo se desejar:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['proprietario', 'prestador', 'arquiteto', 'construtora'] as const).map(p => (
              <button 
                key={p} 
                onClick={() => onChangeProfile(p)}
                className={`btn-secondary ${currentProfile === p ? 'border-primary' : ''}`}
                style={{ 
                  justifyContent: 'flex-start', 
                  fontSize: 13, 
                  padding: '10px 12px',
                  backgroundColor: currentProfile === p ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                  borderColor: currentProfile === p ? 'var(--color-primary)' : 'var(--border-light)'
                }}
              >
                {getProfileName(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Visual appearance */}
        <div className="card-premium">
          <h3 className="text-sm font-bold flex-row-center" style={{ gap: 8, marginBottom: 12 }}>
            <Sun size={18} className="text-primary" /> Aparência e Tema
          </h3>
          
          <div className="grid-2">
            <button 
              onClick={() => onChangeTheme('light')}
              className="btn-secondary"
              style={{ 
                fontSize: 13, 
                gap: 6,
                backgroundColor: theme === 'light' ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                borderColor: theme === 'light' ? 'var(--color-primary)' : 'var(--border-light)'
              }}
            >
              <Sun size={16} /> Light Mode
            </button>
            <button 
              onClick={() => onChangeTheme('dark')}
              className="btn-secondary"
              style={{ 
                fontSize: 13, 
                gap: 6,
                backgroundColor: theme === 'dark' ? 'var(--color-primary-light)' : 'var(--bg-surface)',
                borderColor: theme === 'dark' ? 'var(--color-primary)' : 'var(--border-light)'
              }}
            >
              <Moon size={16} /> Dark Mode
            </button>
          </div>
        </div>

        {/* Security & System Actions */}
        <div className="card-premium" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 className="text-sm font-bold flex-row-center" style={{ gap: 8, marginBottom: 4 }}>
            <Shield size={18} className="text-primary" /> Sistema e Dados
          </h3>

          <button 
            onClick={onResetData} 
            className="btn-secondary"
            style={{ fontSize: 13, justifyContent: 'flex-start', gap: 10, color: '#ef4444' }}
          >
            <RotateCcw size={16} /> Resetar Dados Locais
          </button>

          <button 
            onClick={onLogout} 
            className="btn-secondary"
            style={{ fontSize: 13, justifyContent: 'flex-start', gap: 10 }}
          >
            <LogOut size={16} /> Fazer Logout / Sair
          </button>
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: 12, paddingBottom: 24 }}>
          <p className="text-xs text-muted font-bold">Central da Obra v1.0.0 (Premium)</p>
          <p className="text-xs text-muted" style={{ fontSize: 9 }}>Desenvolvido por Lucas • Pronto para Google Play & App Store</p>
        </div>
      </div>
    </div>
  );
};
