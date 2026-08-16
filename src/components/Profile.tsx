import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Settings, Shield, LogOut, Package, HardHat, Home, Building2, DraftingCompass, MessageSquare, X, Camera, Phone, MapPin, Edit2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

import { BusinessProfileModal } from './provider/BusinessProfileModal';
import { formatDate } from '../utils/formatters';


export function Profile() {
  const { user, profile, signOut, isGuest } = useAuth();
  const prof = profile as any;
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  
  // Profile Edit State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [name, setName] = useState(prof?.name || user?.displayName || '');
  const [phone, setPhone] = useState(prof?.phone || '(11) 99887-6655');
  const [city, setCity] = useState(prof?.city || 'São Paulo - SP');
  const [company, setCompany] = useState(prof?.companyName || 'Estúdio de Engenharia');
  const [specialty, setSpecialty] = useState(prof?.specialty || 'Construção Residencial');
  const [photoUrl, setPhotoUrl] = useState(prof?.photoUrl || prof?.photoURL || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, autoSave = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const newPhotoUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPhotoUrl(newPhotoUrl);

        if (autoSave && user && !isGuest) {
          try {
            await updateDoc(doc(db, 'users', user.uid), { photoUrl: newPhotoUrl });
            toast.success('Foto de perfil atualizada!');
          } catch (err) {
            console.error(err);
            toast.error('Erro ao salvar foto.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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

  const handleConfirmLogout = async () => {
    await signOut();
    window.location.reload();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isGuest) {
      toast.success('Perfil atualizado temporariamente (Modo Visitante)!');
      setShowEditModal(false);
      return;
    }

    setSavingProfile(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name,
        phone,
        city,
        companyName: company,
        specialty,
        photoUrl
      });
      toast.success('Perfil atualizado com sucesso!');
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)' }}>Meu Perfil</h1>
        <button 
          onClick={() => setShowEditModal(true)}
          className="btn-secondary"
          style={{ padding: '8px 16px', borderRadius: 14, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Edit2 size={16} /> Editar
        </button>
      </div>

      {/* Header Card */}
      <div className="glass-panel animate-slide-up" style={{ padding: 24, borderRadius: 24, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        
        {/* Photo Avatar with Edit Button */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <div style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--color-primary)' }}>
            {photoUrl ? (
              <img src={photoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={44} />
            )}
          </div>
          <label 
            style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: 'var(--color-primary)', color: '#FFF', border: '2px solid var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Camera size={14} />
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} style={{ display: 'none' }} />
          </label>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
          {profile?.name || name || (isGuest ? 'Visitante' : 'Usuário')}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
          {user?.email || 'Acesso Anônimo'}
        </p>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--bg-surface)', borderRadius: 20, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
          <Shield size={16} color="var(--color-primary)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
            Perfil: {getRoleName(profile?.role)}
          </span>
        </div>

        {/* Professional Business Card CTA for non-owners */}
        {profile?.role !== 'owner' && (
          <button
            onClick={() => setShowBusinessModal(true)}
            className="btn-primary"
            style={{ width: '100%', padding: '12px 16px', borderRadius: 14, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}
          >
            <Building2 size={18} /> Editar Identidade Profissional (Logo, PIX, CNPJ)
          </button>
        )}
      </div>

      <BusinessProfileModal isOpen={showBusinessModal} onClose={() => setShowBusinessModal(false)} />

      {/* Info List */}
      <div className="glass-panel animate-slide-up animate-stagger-1" style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-subtle)' }}>
          <Mail size={20} color="var(--text-muted)" />
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Email</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{user?.email || 'Não informado'}</p>
          </div>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-subtle)' }}>
          <Phone size={20} color="var(--text-muted)" />
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Telefone / WhatsApp</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{phone}</p>
          </div>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-subtle)' }}>
          <MapPin size={20} color="var(--text-muted)" />
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Cidade / Estado</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{city}</p>
          </div>
        </div>
        
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border-subtle)' }}>
          <Package size={20} color="var(--text-muted)" />
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Plano Atual</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', textTransform: 'capitalize' }}>
              {profile?.plan || 'Pro (Vitalício)'}
            </p>
          </div>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          {getRoleIcon(profile?.role)}
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Membro desde</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
              {profile?.createdAt?.toDate ? formatDate(profile.createdAt.toDate()) : formatDate()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="animate-slide-up animate-stagger-2" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button 
          className="btn-primary" 
          onClick={() => {
            window.location.href = 'mailto:suporte@centralobra.com.br?subject=Feedback%20CentralObra';
          }}
          style={{ width: '100%', height: 52, borderRadius: 16, backgroundColor: 'var(--color-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}
        >
          <MessageSquare size={20} />
          <span>Enviar Feedback por E-mail</span>
        </button>

        <button onClick={() => setShowEditModal(true)} className="btn-secondary" style={{ width: '100%', height: 52, borderRadius: 16 }}>
          <Settings size={20} />
          <span>Editar Perfil & Configurações</span>
        </button>
        
        <button 
          className="btn-secondary" 
          onClick={() => setShowLogoutConfirm(true)}
          style={{ width: '100%', height: 52, borderRadius: 16, color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: 'none' }}
        >
          <LogOut size={20} />
          <span>Sair da Conta</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', flexDirection: 'column', padding: 20, overflowY: 'auto' }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: 360, borderRadius: 28, padding: 24, textAlign: 'center', margin: 'auto' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>Confirmar Saída</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Você precisará fazer login novamente para acessar suas obras salvas. Deseja continuar?</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-secondary" style={{ flex: 1, padding: 12, borderRadius: 14 }}>Cancelar</button>
              <button onClick={handleConfirmLogout} className="btn-primary" style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: '#EF4444' }}>Sair</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', flexDirection: 'column', padding: 20, overflowY: 'auto' }}>
          <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: 440, borderRadius: 28, padding: 24, position: 'relative', margin: 'auto' }}>
            <button onClick={() => setShowEditModal(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 20 }}>Editar Meu Perfil</h2>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Foto do Perfil (Upload ou URL)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" placeholder="https://exemplo.com/foto.jpg" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} className="input-field" style={{ flex: 1, height: 44, borderRadius: 12, fontSize: 13 }} />
                  <label className="btn-secondary" style={{ width: 44, height: 44, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, cursor: 'pointer', flexShrink: 0 }}>
                    <Camera size={20} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Nome Completo</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Telefone / WhatsApp</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Cidade / Estado</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Empresa / Escritório</label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13 }} />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Especialidade / Foco</label>
                <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="input-field" style={{ height: 44, borderRadius: 12, fontSize: 13, width: '100%', padding: '0 12px' }}>
                  <option value="Eletricista">Eletricista</option>
                  <option value="Encanador">Encanador</option>
                  <option value="Pedreiro">Pedreiro</option>
                  <option value="Pintor">Pintor</option>
                  <option value="Gesseiro">Gesseiro</option>
                  <option value="Marceneiro">Marceneiro</option>
                  <option value="Serralheiro">Serralheiro</option>
                  <option value="Vidraceiro">Vidraceiro</option>
                  <option value="Empreiteiro Geral">Empreiteiro Geral</option>
                  <option value="Construção Residencial">Construção Residencial</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary" style={{ flex: 1, padding: 12, borderRadius: 14 }}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={savingProfile} style={{ flex: 1, padding: 12, borderRadius: 14 }}>
                  {savingProfile ? 'Salvando...' : 'Salvar Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
