import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Settings, Shield, LogOut, Package, HardHat, Home, Building2, DraftingCompass, MessageSquare, X, Send } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function Profile() {
  const { user, profile, signOut, isGuest } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Feedback States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('Sugestão');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const getRoleIcon = (role?: string | null) => {
    switch(role) {
      case 'owner': return <Home size={20} />;
      case 'service': return <HardHat size={20} />;
      case 'architect': return <DraftingCompass size={20} />;
      case 'builder': return <Building2 size={20} />;
      default: return <User size={20} />;
    }
  };

  const getRoleName = (role?: string | null) => {
    switch(role) {
      case 'owner': return 'Proprietário';
      case 'service': return 'Prestador de Serviço';
      case 'architect': return 'Arquiteto / Engenheiro';
      case 'builder': return 'Construtora';
      default: return 'Visitante';
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedbacks'), {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        role: profile?.role || 'unknown',
        type: feedbackType,
        message: feedbackMessage,
        createdAt: serverTimestamp()
      });
      setFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackSuccess(false);
        setFeedbackMessage('');
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>Meu Perfil</h1>

      {/* Header Card */}
      <div className="glass-panel animate-slide-up" style={{ padding: 24, borderRadius: 24, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <User size={40} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
          {profile?.name || (isGuest ? 'Visitante' : 'Usuário')}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 16 }}>
          {user?.email || 'Acesso Anônimo'}
        </p>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--bg-main)', borderRadius: 20, border: '1px solid var(--border-subtle)' }}>
          <Shield size={16} color="var(--color-primary)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
            Perfil: {getRoleName(profile?.role)}
          </span>
        </div>
      </div>

      {/* Info List */}
      <div className="glass-panel animate-slide-up animate-stagger-1" style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-subtle)' }}>
          <Mail size={20} color="var(--text-muted)" />
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Email</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-main)' }}>{user?.email || 'Não informado'}</p>
          </div>
        </div>
        
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-subtle)' }}>
          <Package size={20} color="var(--text-muted)" />
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Plano Atual</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-main)', textTransform: 'capitalize' }}>
              {profile?.plan || 'Free'}
            </p>
          </div>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          {getRoleIcon(profile?.role)}
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Membro desde</p>
            <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-main)' }}>
              {profile?.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="animate-slide-up animate-stagger-2" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        <button 
          className="btn-primary" 
          onClick={() => setShowFeedbackModal(true)}
          style={{ width: '100%', height: 56, borderRadius: 16, backgroundColor: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
        >
          <MessageSquare size={20} />
          <span>Enviar Feedback</span>
        </button>

        <button className="btn-secondary" style={{ width: '100%', height: 56, borderRadius: 16 }}>
          <Settings size={20} />
          <span>Configurações da Conta</span>
        </button>
        
        <button 
          className="btn-secondary" 
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{ width: '100%', height: 56, borderRadius: 16, color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'transparent' }}
        >
          <LogOut size={20} />
          <span>{isLoggingOut ? 'Saindo...' : 'Sair da Conta'}</span>
        </button>
      </div>

      {/* Modal Feedback */}
      {showFeedbackModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px calc(24px + env(safe-area-inset-bottom, 0px)) 24px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, color: 'var(--text-main)' }}>Enviar Feedback</h2>
              <button onClick={() => setShowFeedbackModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            {feedbackSuccess ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Send size={32} />
                </div>
                <h3 style={{ fontSize: 18, color: 'var(--text-main)', marginBottom: 8 }}>Feedback Enviado!</h3>
                <p style={{ color: 'var(--text-muted)' }}>Muito obrigado por ajudar a melhorar o CentralObra.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Qual o tipo do feedback?</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['Bug', 'Sugestão', 'Ideia', 'Dificuldade'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFeedbackType(type)}
                        style={{
                          padding: '12px',
                          borderRadius: 12,
                          border: `1.5px solid ${feedbackType === type ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                          backgroundColor: feedbackType === type ? 'var(--color-primary-alpha)' : 'transparent',
                          color: feedbackType === type ? 'var(--color-primary)' : 'var(--text-main)',
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Sua mensagem</label>
                  <textarea 
                    required
                    value={feedbackMessage}
                    onChange={e => setFeedbackMessage(e.target.value)}
                    placeholder="Ex: Achei difícil usar a calculadora de telhado porque..."
                    className="input-premium"
                    style={{ height: 120, paddingTop: 16, resize: 'none' }}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                  style={{ width: '100%', marginTop: 8 }}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
