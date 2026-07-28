import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, UserPlus, X, Share2, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Member {
  email: string;
  role: 'Visualizador' | 'Editor' | 'Co-proprietário';
}

interface ShareWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  workName: string;
}

export function ShareWorkModal({ isOpen, onClose, workName }: ShareWorkModalProps) {
  const [copied, setCopied] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Visualizador' | 'Editor' | 'Co-proprietário'>('Visualizador');
  const [members, setMembers] = useState<Member[]>([
    { email: 'arquitetura@estudio.com.br', role: 'Editor' },
    { email: 'mestre.obra@construtora.com', role: 'Visualizador' }
  ]);

  const [permissions, setPermissions] = useState({
    finance: true,
    photos: true,
    schedule: true,
    documents: true
  });

  if (!isOpen) return null;

  const generatedLink = `https://centralobra-black.vercel.app/connect/${encodeURIComponent(workName.toLowerCase().replace(/\s+/g, '-'))}?share=true`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success('Link de compartilhamento copiado!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      toast.error('Informe um e-mail válido!');
      return;
    }
    setMembers(prev => [...prev, { email: newEmail, role: newRole }]);
    setNewEmail('');
    toast.success(`Membro ${newEmail} convidado como ${newRole}!`);
  };

  const handleRemoveMember = (index: number) => {
    setMembers(prev => prev.filter((_, i) => i !== index));
    toast.success('Membro removido');
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="glass-panel"
          style={{ width: '100%', maxWidth: 520, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '24px 20px 32px', position: 'relative', zIndex: 1, maxHeight: '90vh', overflowY: 'auto' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 34, height: 34, borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Compartilhar Obra</h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>{workName}</p>
            </div>
          </div>

          {/* Copy Link Section */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>LINK DE ACESSO RÁPIDO</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input 
                type="text" 
                readOnly 
                value={generatedLink}
                style={{ flex: 1, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 12px', fontSize: 12, color: 'var(--text-main)' }}
              />
              <button 
                onClick={handleCopyLink}
                className="btn-primary"
                style={{ padding: '0 16px', height: 40, borderRadius: 12, fontSize: 13 }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Invite Member Section */}
          <form onSubmit={handleAddMember} style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>CONVIDAR MEMBRO OU ENGENHEIRO</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input 
                type="email"
                placeholder="email@exemplo.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                style={{ flex: 1, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 12px', height: 44, fontSize: 13, color: 'var(--text-main)' }}
              />
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value as any)}
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '0 8px', height: 44, fontSize: 12, color: 'var(--text-main)' }}
              >
                <option value="Visualizador">Visualizador</option>
                <option value="Editor">Editor</option>
                <option value="Co-proprietário">Co-proprietário</option>
              </select>
              <button type="submit" className="btn-primary" style={{ padding: '0 16px', height: 44, borderRadius: 12 }}>
                <UserPlus size={18} />
              </button>
            </div>
          </form>

          {/* Members List */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Membros com Acesso</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {members.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: 'var(--bg-surface)', borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>{m.email}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 700 }}>{m.role}</span>
                  </div>
                  <button onClick={() => handleRemoveMember(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: 4 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions Settings */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Permissões Granulares</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { key: 'finance', label: 'Financeiro' },
                { key: 'photos', label: 'Diário & Fotos' },
                { key: 'schedule', label: 'Cronograma' },
                { key: 'documents', label: 'Documentos' },
              ].map(p => (
                <div 
                  key={p.key}
                  onClick={() => setPermissions(prev => ({ ...prev, [p.key as keyof typeof permissions]: !prev[p.key as keyof typeof permissions] }))}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 12, borderRadius: 12, border: '1px solid var(--border-subtle)',
                    backgroundColor: permissions[p.key as keyof typeof permissions] ? 'var(--color-primary-alpha)' : 'var(--bg-surface)',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)' }}>{p.label}</span>
                  <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: permissions[p.key as keyof typeof permissions] ? 'var(--color-primary)' : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                    {permissions[p.key as keyof typeof permissions] && <Check size={12} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
