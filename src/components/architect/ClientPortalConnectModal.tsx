import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Eye, Lock, Globe, X, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ClientPortalConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  clientName: string;
}

export function ClientPortalConnectModal({ isOpen, onClose, projectName, clientName }: ClientPortalConnectModalProps) {
  const [copied, setCopied] = useState(false);
  const [permissions, setPermissions] = useState({
    photos: true,
    videos: true,
    timeline: true,
    progress: true,
    reports: true,
    pdfs: true,
    pendencies: false,
    journal: true,
    releasedFiles: true,
    notes: false,
  });

  if (!isOpen) return null;

  const generatedLink = `https://centralobra.com/connect/${encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-'))}?client=${encodeURIComponent(clientName)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success('Link do CentralObra Connect copiado!');
    setTimeout(() => setCopied(false), 2500);
  };

  const togglePerm = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
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
          style={{ width: '100%', maxWidth: 500, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: '28px 20px 40px', position: 'relative', zIndex: 1, maxHeight: '88vh', overflowY: 'auto' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--bg-elevated)', border: 'none', width: 34, height: 34, borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Globe size={30} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>CentralObra Connect</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Portal transparente de acompanhamento para o cliente</p>
          </div>

          {/* Generated Link Box */}
          <div className="glass-panel" style={{ padding: 14, borderRadius: 16, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>Link Exclusivo do Cliente ({clientName})</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#3B82F6' }}>{generatedLink}</span>
            </div>
            <button onClick={handleCopyLink} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          {/* Permissions Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <ShieldCheck size={16} color="#10B981" />
            <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>O que o cliente poderá visualizar?</h3>
          </div>

          {/* Checkbox list */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {[
              { key: 'photos', label: '📷 Fotos da Obra' },
              { key: 'videos', label: '🎥 Vídeos de Evolução' },
              { key: 'timeline', label: '📅 Cronograma & Etapas' },
              { key: 'progress', label: '📊 Percentual % Concluído' },
              { key: 'reports', label: '📄 Relatórios Técnicos' },
              { key: 'pdfs', label: '📁 PDFs & Projetos' },
              { key: 'journal', label: '📖 Diário Técnico' },
              { key: 'releasedFiles', label: '📦 Arquivos Liberados' },
              { key: 'pendencies', label: '⚠️ Pendências de Campo' },
              { key: 'notes', label: '📝 Anotações Internas' },
            ].map(item => {
              const active = permissions[item.key as keyof typeof permissions];
              return (
                <div
                  key={item.key}
                  onClick={() => togglePerm(item.key as any)}
                  style={{
                    padding: '10px 12px', borderRadius: 12, cursor: 'pointer',
                    backgroundColor: active ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-elevated)',
                    border: active ? '1.5px solid #10B981' : '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, fontWeight: 700, color: active ? 'var(--text-main)' : 'var(--text-muted)'
                  }}
                >
                  <span>{item.label}</span>
                  {active ? <Eye size={14} color="#10B981" /> : <Lock size={14} color="var(--text-muted)" />}
                </div>
              );
            })}
          </div>

          <button onClick={onClose} className="btn-primary" style={{ width: '100%', padding: 14, borderRadius: 14, fontSize: 14 }}>
            Salvar Permissões do Portal
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
