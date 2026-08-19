import React, { useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import type { PublicProfile } from '../../../types/connect';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function RequestQuoteModal({ uid, profile, onClose }: { uid: string, profile: PublicProfile, onClose: () => void }) {
  const [formData, setFormData] = useState({
    requesterName: '',
    requesterPhone: '',
    serviceNeeded: '',
    city: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requesterName || !formData.requesterPhone || !formData.serviceNeeded) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const requestId = 'req_' + Date.now().toString();
      await setDoc(doc(db, 'connect_requests', requestId), {
        ...formData,
        id: requestId,
        professionalId: uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao enviar solicitação.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', backgroundColor: 'var(--bg-base)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, padding: 8, backgroundColor: 'var(--bg-surface)', borderRadius: '50%', color: 'var(--text-main)' }}>
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Solicitação Enviada!</h2>
            <p style={{ color: 'var(--text-muted)' }}>{profile.name} recebeu sua solicitação e entrará em contato em breve pelo número informado.</p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: 32, width: '100%', padding: 16 }}>Voltar ao Perfil</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>Solicitar Orçamento</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Para {profile.name}</p>
            </div>

            <div className="input-group">
              <label>Seu Nome *</label>
              <input type="text" className="input-field" value={formData.requesterName} onChange={e => setFormData({...formData, requesterName: e.target.value})} required />
            </div>

            <div className="input-group">
              <label>Seu Telefone/WhatsApp *</label>
              <input type="tel" className="input-field" value={formData.requesterPhone} onChange={e => setFormData({...formData, requesterPhone: e.target.value})} placeholder="(00) 00000-0000" required />
            </div>

            <div className="input-group">
              <label>Serviço Desejado *</label>
              <input type="text" className="input-field" value={formData.serviceNeeded} onChange={e => setFormData({...formData, serviceNeeded: e.target.value})} placeholder="Ex: Reforma da cozinha, Projeto elétrico..." required />
            </div>

            <div className="input-group">
              <label>Sua Cidade/Região</label>
              <input type="text" className="input-field" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>

            <div className="input-group">
              <label>Mais detalhes (Opcional)</label>
              <textarea className="input-field" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Descreva brevemente o que você precisa..." />
            </div>

            <button type="submit" className="btn-primary" disabled={saving} style={{ padding: 16, borderRadius: 16, fontWeight: 800, marginTop: 8 }}>
              {saving ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
