import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Home } from 'lucide-react';
import { useWorks } from '../../contexts/WorksContext';

interface PrimaryWorkSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrimaryWorkSelector({ isOpen, onClose }: PrimaryWorkSelectorProps) {
  const { works, primaryWork, setPrimaryWork } = useWorks();

  const handleSelect = async (workId: string) => {
    await setPrimaryWork(workId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: 500,
              maxHeight: '70vh',
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: '24px 20px 40px',
              position: 'relative',
              zIndex: 1,
              overflowY: 'auto'
            }}
          >
            {/* Handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'var(--border-subtle)', margin: '0 auto 20px' }} />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Selecionar Obra Principal</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>Escolha a obra que deseja acompanhar</p>
              </div>
              <button
                onClick={onClose}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'var(--bg-elevated)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Works List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {works.map((work) => {
                const isPrimary = primaryWork?.id === work.id;
                return (
                  <motion.button
                    key={work.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(work.id)}
                    style={{
                      width: '100%',
                      padding: 16,
                      borderRadius: 16,
                      border: isPrimary ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: isPrimary ? 'var(--color-primary-alpha)' : 'var(--bg-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s'
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, overflow: 'hidden', flexShrink: 0,
                      backgroundColor: work.colorTheme || 'var(--color-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {work.image ? (
                        <img src={work.image} alt={work.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Home size={22} color="rgba(255,255,255,0.8)" />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {work.name}
                        </span>
                        {isPrimary && <Star size={14} color="var(--color-primary)" fill="var(--color-primary)" />}
                      </div>
                      {work.address && (
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          <MapPin size={11} /> {work.address}
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: isPrimary ? 'var(--color-primary)' : 'var(--text-main)' }}>
                        {work.progress || 0}%
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
