import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Calendar, Shield, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import type { UserProfile, SubscriptionData, SubscriptionStatus, SubscriptionSource, UserRole } from '../../contexts/AuthContext';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdate: () => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({ isOpen, onClose, userProfile, onUpdate }) => {
  const [userRole, setUserRole] = useState<UserRole>(userProfile.role || 'owner');
  const [subStatus, setSubStatus] = useState<SubscriptionStatus>(userProfile.subscription?.status || 'FREE');
  const [subPlan, setSubPlan] = useState<string>(userProfile.subscription?.planId || 'free');
  const [subSource, setSubSource] = useState<SubscriptionSource>(userProfile.subscription?.source || null);
  
  const getInitialDate = () => {
    if (!userProfile.subscription?.expiresAt) return '';
    const date = userProfile.subscription.expiresAt.toDate ? userProfile.subscription.expiresAt.toDate() : new Date(userProfile.subscription.expiresAt);
    return date.toISOString().split('T')[0];
  };
  const [expiresAtStr, setExpiresAtStr] = useState<string>(getInitialDate());

  const [isAdminFlag, setIsAdminFlag] = useState<boolean>(userProfile.isAdmin || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      
      let expiresAtVal: Date | null = null;
      if (expiresAtStr) {
        expiresAtVal = new Date(expiresAtStr);
      }

      const updatedSub: SubscriptionData = {
        ...userProfile.subscription,
        planId: subPlan,
        status: subStatus,
        source: subSource || 'admin_grant',
        autoRenew: userProfile.subscription?.autoRenew || false,
        expiresAt: expiresAtVal as any,
      };

      await updateDoc(userRef, {
        role: userRole,
        subscription: updatedSub,
        isAdmin: isAdminFlag
      });

      toast.success('Perfil do usuário atualizado!');
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar usuário.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await deleteDoc(userRef);
      toast.success('Usuário excluído com sucesso.');
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao excluir usuário.');
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel"
          style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: 480, 
            borderRadius: 24, 
            overflow: 'hidden', 
            border: '1px solid var(--border-subtle)', 
            backgroundColor: 'var(--bg-panel)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ padding: '24px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} color="#8B5CF6" />
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Gerenciar Usuário</h2>
            </div>
            <button
              onClick={onClose}
              style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} color="var(--text-muted)" />
            </button>
          </div>

          <div style={{ padding: 24, maxHeight: '60vh', overflowY: 'auto' }}>
            <div style={{ marginBottom: 24, padding: 16, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>
                {userProfile.name || 'Sem Nome'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{userProfile.email}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>ID: <span style={{ fontFamily: 'monospace', opacity: 0.7 }}>{userProfile.uid}</span></p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Perfil (Role)</label>
                <select 
                  value={userRole || 'owner'} 
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, color: 'var(--text-main)', outline: 'none' }}
                >
                  <option value="owner">Proprietário (Owner)</option>
                  <option value="service">Prestador de Serviço (Service)</option>
                  <option value="architect">Arquiteto (Architect)</option>
                  <option value="engineer">Engenheiro (Engineer)</option>
                  <option value="builder">Construtora (Builder)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Status da Assinatura</label>
                <select 
                  value={subStatus} 
                  onChange={(e) => setSubStatus(e.target.value as SubscriptionStatus)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, color: 'var(--text-main)', outline: 'none' }}
                >
                  <option value="FREE">FREE</option>
                  <option value="ACTIVE">ACTIVE (Ativo)</option>
                  <option value="TRIAL">TRIAL (Em Teste)</option>
                  <option value="COMP">COMP (Cortesia Administrador)</option>
                  <option value="TESTER">TESTER (Beta Tester)</option>
                  <option value="PAST_DUE">PAST_DUE (Pagamento Pendente)</option>
                  <option value="CANCELED">CANCELED (Cancelado)</option>
                  <option value="EXPIRED">EXPIRED (Expirado)</option>
                  <option value="REVOKED">REVOKED (Revogado)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Plano Concedido</label>
                <select 
                  value={subPlan} 
                  onChange={(e) => setSubPlan(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, color: 'var(--text-main)', outline: 'none' }}
                >
                  <option value="free">Gratuito (R$ 0,00)</option>
                  <option value="starter">Básico (R$ 29,90/mês)</option>
                  <option value="pro">PRO (R$ 49,90/mês)</option>
                  <option value="business">Business / Enterprise (R$ 79,90/mês)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Origem da Concessão</label>
                <select 
                  value={subSource || ''} 
                  onChange={(e) => setSubSource(e.target.value as SubscriptionSource || null)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600, color: 'var(--text-main)', outline: 'none' }}
                >
                  <option value="">Nenhuma</option>
                  <option value="subscription">Assinatura (Gateway MP)</option>
                  <option value="admin_grant">Concessão Administrativa</option>
                  <option value="trial">Período de Teste (Trial)</option>
                  <option value="promo">Promoção / Cupom</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Data de Expiração</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 12, left: 12, pointerEvents: 'none', color: 'var(--text-muted)' }}>
                    <Calendar size={18} />
                  </div>
                  <input 
                    type="date" 
                    value={expiresAtStr}
                    onChange={(e) => setExpiresAtStr(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '12px 12px 12px 40px', fontSize: 14, fontWeight: 600, color: 'var(--text-main)', outline: 'none' }}
                  />
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Deixe em branco para acesso sem expiração definida.</p>
              </div>

              <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: 12, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-subtle)' }}>
                  <input 
                    type="checkbox" 
                    checked={isAdminFlag}
                    onChange={(e) => setIsAdminFlag(e.target.checked)}
                    style={{ width: 20, height: 20, accentColor: '#8B5CF6', borderRadius: 4, cursor: 'pointer' }}
                  />
                  <div>
                    <span style={{ display: 'block', fontWeight: 800, fontSize: 14, color: 'var(--text-main)' }}>Permissão de Administrador</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Garante acesso ao painel de administração geral.</span>
                  </div>
                </label>
              </div>

              <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                {!showConfirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.1)', color: '#F87171', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
                  >
                    <Trash2 size={16} /> Excluir Conta do Usuário
                  </button>
                ) : (
                  <div style={{ padding: 16, borderRadius: 16, backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', textAlign: 'center' }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: '#FCA5A5', marginBottom: 12 }}>Tem certeza que deseja excluir permanentemente esta conta?</p>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setShowConfirmDelete(false)}
                        style={{ padding: '8px 16px', borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.2)', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteUser}
                        disabled={isDeleting}
                        style={{ padding: '8px 16px', borderRadius: 8, backgroundColor: '#DC2626', color: '#FFF', fontSize: 12, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4, border: 'none', cursor: 'pointer' }}
                      >
                        {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ padding: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button 
              type="button"
              onClick={onClose}
              style={{ padding: '10px 16px', fontWeight: 800, fontSize: 14, color: 'var(--text-muted)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary"
              style={{ padding: '10px 24px', borderRadius: 12, fontWeight: 900, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {isSaving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
