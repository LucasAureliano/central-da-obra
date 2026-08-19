import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export function ConnectProfileForm() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    city: '',
    state: '',
    bio: '',
    experienceYears: '',
    phone: '',
    email: '',
    instagram: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const docSnap = await getDoc(doc(db, 'users', user!.uid, 'public_profile', 'info'));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || profile?.name || '',
          specialty: data.specialty || '',
          city: data.city || '',
          state: data.state || '',
          bio: data.bio || '',
          experienceYears: data.experienceYears || '',
          phone: data.phone || '' || '',
          email: data.email || profile?.email || '',
          instagram: data.instagram || '',
          website: data.website || ''
        });
      } else {
        setFormData({
          ...formData,
          name: profile?.name || '',
          phone: '',
          email: profile?.email || ''
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid, 'public_profile', 'info'), {
        ...formData,
        id: user.uid,
        updatedAt: new Date().toISOString(),
        experienceYears: Number(formData.experienceYears) || 0,
        rating: 0,
        reviewCount: 0,
        completedWorksCount: 0,
        isVerified: false
      }, { merge: true });
      toast.success('Perfil público atualizado!');
    } catch (e) {
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Informações Públicas</h2>
      
      <div className="input-group">
        <label>Nome ou Empresa</label>
        <input type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div className="input-group" style={{ flex: 2 }}>
          <label>Especialidade Principal</label>
          <input type="text" className="input-field" placeholder="Ex: Empreiteiro, Arquiteto, Eletricista" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} required />
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Anos de Experiência</label>
          <input type="number" className="input-field" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} />
        </div>
      </div>

      <div className="input-group">
        <label>Sobre você (Bio)</label>
        <textarea className="input-field" rows={4} placeholder="Conte um pouco sobre sua trajetória, diferenciais e como você trabalha..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div className="input-group" style={{ flex: 2 }}>
          <label>Cidade de Atuação</label>
          <input type="text" className="input-field" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Estado (UF)</label>
          <input type="text" className="input-field" maxLength={2} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value.toUpperCase()})} required />
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginTop: 16, marginBottom: 8 }}>Contatos Públicos</h3>
      
      <div style={{ display: 'flex', gap: 16 }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label>WhatsApp</label>
          <input type="tel" className="input-field" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label>E-mail</label>
          <input type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Instagram</label>
          <input type="text" className="input-field" placeholder="@seuinstagram" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
        </div>
        <div className="input-group" style={{ flex: 1 }}>
          <label>Site</label>
          <input type="url" className="input-field" placeholder="https://" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
        </div>
      </div>

      <button type="submit" className="btn-primary" style={{ padding: 16, borderRadius: 16, fontWeight: 800, marginTop: 16 }} disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar Perfil Público'}
      </button>
    </form>
  );
}
