import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Share2, QrCode, Power, Plus, Copy, MessageCircle, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface ShareWorkViewProps {
  workId: string;
}

const ROLES = [
  'Cônjuge / Esposa(o)',
  'Filho(a) / Familiar',
  'Arquiteto(a)',
  'Engenheiro(a)',
  'Prestador de Serviço',
  'Administrador',
  'Cliente',
  'Investidor'
];

const PERMISSIONS = [
  { id: 'visualizar', label: 'Visualizar Obra' },
  { id: 'editar', label: 'Editar Informações' },
  { id: 'financeiro', label: 'Ver Financeiro' },
  { id: 'cronograma', label: 'Ver Cronograma' },
  { id: 'compras', label: 'Ver Compras' },
  { id: 'diario', label: 'Ver Diário' }
];

export function ShareWorkView({ workId }: ShareWorkViewProps) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [role, setRole] = useState(ROLES[0]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['visualizar', 'cronograma', 'compras']);
  const [qrModalToken, setQrModalToken] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'shared_links'), where('workId', '==', workId));
    const unsub = onSnapshot(q, (snap) => {
      const data: any[] = [];
      snap.forEach(document => data.push({ id: document.id, ...document.data() }));
      data.sort((a, b) => {
        const d1 = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (new Date(a.createdAt).getTime() || 0);
        const d2 = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (new Date(b.createdAt).getTime() || 0);
        return d2 - d1;
      });
      setLinks(data);
      setLoading(false);
    });
    return () => unsub();
  }, [workId]);

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleCreateLink = async () => {
    setIsCreating(true);
    try {
      const token = crypto.randomUUID();
      await addDoc(collection(db, 'shared_links'), {
        token,
        workId,
        role,
        permissions: selectedPermissions,
        active: true,
        createdAt: serverTimestamp(),
      });
      toast.success('Link de acesso gerado com sucesso!');
    } catch (err) {
      toast.error('Erro ao gerar link.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'shared_links', id), { active: !currentStatus });
      toast.success(currentStatus ? 'Link revogado!' : 'Link reativado!');
    } catch (err) {
      toast.error('Erro ao atualizar status do link.');
    }
  };

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/?shared=${token}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };

  const shareViaWhatsApp = (token: string, role: string) => {
    const url = `${window.location.origin}/?shared=${token}`;
    const text = `Olá! Segue o link de acesso (${role}) para acompanhamento da obra: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = async (token: string, role: string) => {
    const url = `${window.location.origin}/?shared=${token}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Convite CentralObra: ${role}`,
          text: `Acesse o acompanhamento da obra:`,
          url
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      copyToClipboard(token);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: 20 }}>
      {/* Create new link area */}
      <div className="glass-panel" style={{ padding: 24, borderRadius: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Share2 size={20} color="var(--color-primary)" />
          Gerar Novo Convite
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
              Perfil do Convidado
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-premium"
              style={{ width: '100%', appearance: 'auto', height: 44 }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>
              Permissões do Acesso
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
              {PERMISSIONS.map(p => {
                const isSelected = selectedPermissions.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePermission(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10,
                      border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--color-primary-alpha)' : 'var(--bg-elevated)',
                      color: isSelected ? 'var(--color-primary)' : 'var(--text-muted)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left'
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--border-subtle)'}`, backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <Check size={10} color="#FFF" />}
                    </div>
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleCreateLink}
            disabled={isCreating}
            className="btn-primary"
            style={{ width: '100%', height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}
          >
            {isCreating ? 'Gerando...' : <><Plus size={18} /> Gerar Link de Convite</>}
          </button>
        </div>
      </div>

      {/* List of links */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Convites Ativos ({links.length})</h3>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Carregando convites...</p>
      ) : links.length === 0 ? (
        <div className="glass-panel" style={{ padding: 32, borderRadius: 20, textAlign: 'center' }}>
          <Share2 size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: 16 }} />
          <p style={{ color: 'var(--text-muted)' }}>Nenhum convite gerado para esta obra.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {links.map((link) => {
            const isActive = link.active !== false;
            const linkPerms: string[] = link.permissions || [];

            return (
              <div key={link.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 12, opacity: isActive ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: 15 }}>{link.role || 'Convidado'}</span>
                      <span className={`status-chip ${isActive ? 'status-active' : 'status-danger'}`}>
                        {isActive ? 'Ativo' : 'Revogado'}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
                      Criado em: {link.createdAt?.toDate ? link.createdAt.toDate().toLocaleDateString('pt-BR') : new Date(link.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Permissions tags */}
                {linkPerms.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {linkPerms.map(pid => {
                      const pObj = PERMISSIONS.find(p => p.id === pid);
                      return (
                        <span key={pid} style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 6, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)' }}>
                          {pObj?.label || pid}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => copyToClipboard(link.token)}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}
                  >
                    <Copy size={14} /> Copiar
                  </button>

                  <button
                    onClick={() => setQrModalToken(link.token)}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}
                  >
                    <QrCode size={14} /> QR Code
                  </button>

                  <button
                    onClick={() => handleNativeShare(link.token, link.role)}
                    style={{ background: 'var(--color-primary-alpha)', border: 'none', borderRadius: 8, padding: '8px 12px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}
                  >
                    <Share2 size={14} /> Compartilhar
                  </button>

                  <button
                    onClick={() => shareViaWhatsApp(link.token, link.role)}
                    style={{ background: '#25D366', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#FFF', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </button>

                  <button
                    onClick={() => handleToggleActive(link.id, isActive)}
                    style={{ background: isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', border: 'none', borderRadius: 8, padding: '8px 12px', color: isActive ? '#EF4444' : '#22C55E', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 12 }}
                  >
                    <Power size={14} /> {isActive ? 'Revogar' : 'Reativar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrModalToken && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setQrModalToken(null)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: 360, borderRadius: 24, padding: 32, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-main)' }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 24 }}>QR Code de Acesso</h2>

              <div style={{ background: '#FFF', padding: 16, borderRadius: 16, marginBottom: 24 }}>
                <QRCodeSVG value={`${window.location.origin}/?shared=${qrModalToken}`} size={200} />
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 24 }}>
                Escaneie este código para acessar as informações da obra.
              </p>

              <button
                onClick={() => setQrModalToken(null)}
                className="btn-primary"
                style={{ width: '100%', padding: 14, borderRadius: 12, fontWeight: 600 }}
              >
                Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
