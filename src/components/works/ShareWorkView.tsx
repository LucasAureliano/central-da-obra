import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Share2, QrCode, Power, Plus, Copy, MessageCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface ShareWorkViewProps {
  workId: string;
}

export function ShareWorkView({ workId }: ShareWorkViewProps) {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [role, setRole] = useState('Cliente');
  
  const [qrModalToken, setQrModalToken] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'shared_links'), where('workId', '==', workId));
    const unsub = onSnapshot(q, (snap) => {
      const data: any[] = [];
      snap.forEach(document => data.push({ id: document.id, ...document.data() }));
      // Sort by createdAt desc
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

  const handleCreateLink = async () => {
    setIsCreating(true);
    try {
      const token = crypto.randomUUID();
      await addDoc(collection(db, 'shared_links'), {
        token,
        workId,
        role,
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

  return (
    <div className="animate-fade-in" style={{ padding: 20 }}>
      {/* Create new link area */}
      <div className="glass-panel" style={{ padding: 24, borderRadius: 16, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Share2 size={20} color="var(--color-primary)" />
          Gerar Novo Acesso
        </h3>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
              Tipo de Perfil
            </label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="input-premium"
              style={{ width: '100%', appearance: 'auto' }}
            >
              <option value="Cliente">Cliente</option>
              <option value="Investidor">Investidor</option>
              <option value="Fornecedor">Fornecedor</option>
              <option value="Visitante">Visitante</option>
            </select>
          </div>
          
          <button 
            onClick={handleCreateLink}
            disabled={isCreating}
            className="btn-primary"
            style={{ padding: '0 24px', height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
          >
            {isCreating ? 'Gerando...' : <><Plus size={18} /> Gerar Link</>}
          </button>
        </div>
      </div>

      {/* List of links */}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Links de Acesso ({links.length})</h3>
      
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Carregando links...</p>
      ) : links.length === 0 ? (
        <div className="glass-panel" style={{ padding: 32, borderRadius: 16, textAlign: 'center' }}>
          <Share2 size={40} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: 16 }} />
          <p style={{ color: 'var(--text-muted)' }}>Nenhum link gerado para esta obra.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {links.map((link) => {

            const isActive = link.active !== false; // Default to true if not present
            
            return (
              <div key={link.id} className="glass-panel" style={{ padding: 16, borderRadius: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', opacity: isActive ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Perfil: {link.role || 'Visitante'}</span>
                    <span className={`status-chip ${isActive ? 'status-active' : 'status-danger'}`}>
                      {isActive ? 'Ativo' : 'Revogado'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Criado em: {link.createdAt?.toDate ? link.createdAt.toDate().toLocaleDateString('pt-BR') : new Date(link.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => copyToClipboard(link.token)}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    title="Copiar Link"
                  >
                    <Copy size={16} /> <span style={{ fontSize: 13, fontWeight: 500 }}>Copiar</span>
                  </button>
                  
                  <button 
                    onClick={() => setQrModalToken(link.token)}
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    title="Ver QR Code"
                  >
                    <QrCode size={16} /> <span style={{ fontSize: 13, fontWeight: 500 }}>QR Code</span>
                  </button>

                  <button 
                    onClick={() => shareViaWhatsApp(link.token, link.role)}
                    style={{ background: '#25D366', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#FFF', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    title="Compartilhar via WhatsApp"
                  >
                    <MessageCircle size={16} /> <span style={{ fontSize: 13, fontWeight: 500 }}>WhatsApp</span>
                  </button>

                  <button 
                    onClick={() => handleToggleActive(link.id, isActive)}
                    style={{ background: isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)', border: 'none', borderRadius: 8, padding: '8px 12px', color: isActive ? '#EF4444' : '#22C55E', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    title={isActive ? "Revogar Acesso" : "Reativar Acesso"}
                  >
                    <Power size={16} /> <span style={{ fontSize: 13, fontWeight: 500 }}>{isActive ? 'Revogar' : 'Reativar'}</span>
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
                style={{ width: '100%', padding: 16, borderRadius: 12, fontWeight: 600 }}
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
