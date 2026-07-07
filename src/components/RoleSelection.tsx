import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, HardHat, DraftingCompass, Building2, Check } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

interface RoleSelectionProps {
  onSelect?: (role: UserRole) => void;
}

const ROLES = [
  { id: 'owner', title: 'Proprietário', icon: Home, desc: 'Acompanhe sua obra de forma simples' },
  { id: 'service', title: 'Prestador de Serviço', icon: HardHat, desc: 'Gestão de clientes, orçamentos e diário de obra' },
  { id: 'architect', title: 'Arquiteto / Engenheiro', icon: DraftingCompass, desc: 'Projetos, cronograma e acompanhamento' },
  { id: 'builder', title: 'Construtora', icon: Building2, desc: 'Dashboard executivo, financeiro e equipes' }
];



export function RoleSelection({ onSelect }: RoleSelectionProps) {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async (role: UserRole) => {
    setIsSaving(true);
    setSelectedRole(role);
    
    if (user && !user.isAnonymous) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { role });
        if (onSelect) onSelect(role);
      } catch (err) {
        console.error('Error updating role:', err);
        setIsSaving(false);
      }
    } else {
      localStorage.setItem('pendingRole', role as string);
      if (onSelect) {
        onSelect(role);
      } else {
        window.location.reload();
      }
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'var(--bg-main)',
      zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '40px 20px',
      overflowY: 'auto'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: 500, width: '100%', display: 'flex', flexDirection: 'column', gap: 24 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>
            Bem-vindo à Central da Obra
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
            Para personalizarmos sua experiência, como você utilizará a plataforma?
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ROLES.map(role => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;
            
            return (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleConfirm(role.id as UserRole)}
                disabled={isSaving}
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 20,
                  width: '100%',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 20,
                  background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-glass)',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isSelected && (
                  <motion.div
                    layoutId="role-highlight"
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'radial-gradient(circle at right, var(--color-primary-alpha), transparent)',
                      pointerEvents: 'none'
                    }}
                  />
                )}
                
                <div style={{ 
                  width: 48, height: 48, borderRadius: 16, 
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--bg-surface)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'all 0.3s'
                }}>
                  <Icon size={24} color={isSelected ? '#fff' : 'var(--color-primary)'} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
                    {role.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {role.desc}
                  </p>
                </div>
                
                <div style={{ 
                  width: 24, height: 24, borderRadius: '50%', 
                  border: isSelected ? 'none' : '2px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <Check size={14} color="#fff" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
