import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface SharedHeaderProps {
  onNavigate: (tab: string) => void;
  activeWorkName?: string;
}

export function SharedHeader({ onNavigate, activeWorkName }: SharedHeaderProps) {
  const { profile } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img 
            src={profile?.photoURL || `https://ui-avatars.com/api/?name=${profile?.name || 'V'}`} 
            alt="Avatar" 
            style={{ width: 44, height: 44, borderRadius: 22, objectFit: 'cover' }}
          />
          <div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{greeting},</p>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {profile?.name ? profile.name.split(' ')[0] : 'Visitante'}
            </h2>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button style={{ background: 'none', border: 'none', position: 'relative', cursor: 'pointer' }}>
            <Bell size={24} color="var(--text-main)" />
            <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, backgroundColor: 'var(--color-primary)', borderRadius: 4 }}></span>
          </button>
        </div>
      </motion.div>

      {/* Active Work Selector */}
      {activeWorkName && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', alignSelf: 'flex-start' }}
          onClick={() => onNavigate('obras')}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>{activeWorkName}</h3>
          <ChevronDown size={16} color="var(--text-muted)" />
        </motion.div>
      )}
    </>
  );
}
