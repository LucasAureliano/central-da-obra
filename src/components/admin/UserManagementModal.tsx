import React, { useState } from 'react';
import { X, Save, Calendar, Shield, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import type { UserProfile, SubscriptionData, SubscriptionStatus, SubscriptionSource, UserRole } from '../../contexts/AuthContext';
import { PLANS_CONFIG } from '../../config/plans';

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
        expiresAt: expiresAtVal,
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg glass-panel rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-subtle)] flex flex-col max-h-[90vh] text-[var(--text-main)]"
        >
          {/* Header */}
          <div className="p-5 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-elevated)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-[var(--text-main)] leading-tight">Gerenciar Conta</h2>
                <p className="text-xs text-[var(--text-muted)]">Ajuste de permissões e assinaturas</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[var(--text-muted)]">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            {/* User Card Info */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-lg">
                {userProfile.name?.charAt(0) || userProfile.email?.charAt(0) || '?'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-[var(--text-main)] truncate text-base">{userProfile.name || 'Sem Nome'}</h3>
                <p className="text-xs text-[var(--text-muted)] truncate">{userProfile.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase">
                    {userRole}
                  </span>
                  {userProfile.isAdmin && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      ADMIN
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              {/* Role Select */}
              <div>
                <label className="block text-xs font-extrabold text-[var(--text-main)] uppercase tracking-wider mb-2">Perfil / Role</label>
                <select 
                  value={userRole || 'owner'} 
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-blue-500 transition-all"
                >
                  <option value="owner">Proprietário (Owner)</option>
                  <option value="service">Prestador de Serviço (Service)</option>
                  <option value="architect">Arquiteto (Architect)</option>
                  <option value="engineer">Engenheiro (Engineer)</option>
                  <option value="builder">Construtora (Builder)</option>
                </select>
              </div>

              {/* Status Select */}
              <div>
                <label className="block text-xs font-extrabold text-[var(--text-main)] uppercase tracking-wider mb-2">Status da Assinatura</label>
                <select 
                  value={subStatus} 
                  onChange={(e) => setSubStatus(e.target.value as SubscriptionStatus)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-blue-500 transition-all"
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

              {/* Plan Select */}
              <div>
                <label className="block text-xs font-extrabold text-[var(--text-main)] uppercase tracking-wider mb-2">Plano Concedido</label>
                <select 
                  value={subPlan} 
                  onChange={(e) => setSubPlan(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-blue-500 transition-all"
                >
                  <option value="free">Gratuito (R$ 0,00)</option>
                  <option value="starter">Básico (R$ 29,99/mês)</option>
                  <option value="pro">PRO (R$ 49,99/mês)</option>
                  <option value="business">Business / Enterprise (R$ 99,99/mês)</option>
                </select>
              </div>

              {/* Concession Source */}
              <div>
                <label className="block text-xs font-extrabold text-[var(--text-main)] uppercase tracking-wider mb-2">Origem da Concessão</label>
                <select 
                  value={subSource || ''} 
                  onChange={(e) => setSubSource(e.target.value as SubscriptionSource || null)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-3 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">Nenhuma</option>
                  <option value="subscription">Assinatura (Gateway MP)</option>
                  <option value="admin_grant">Concessão Administrativa</option>
                  <option value="trial">Período de Teste (Trial)</option>
                  <option value="promo">Promoção / Cupom</option>
                </select>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-xs font-extrabold text-[var(--text-main)] uppercase tracking-wider mb-2">Data de Expiração</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Calendar size={18} />
                  </div>
                  <input 
                    type="date" 
                    value={expiresAtStr}
                    onChange={(e) => setExpiresAtStr(e.target.value)}
                    className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl p-3 pl-10 text-sm font-semibold text-[var(--text-main)] outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">Deixe em branco para acesso sem expiração definida.</p>
              </div>

              {/* Admin Access Switch */}
              <div className="pt-3 border-t border-[var(--border-subtle)]">
                <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-base)] transition-colors border border-[var(--border-subtle)]">
                  <input 
                    type="checkbox" 
                    checked={isAdminFlag}
                    onChange={(e) => setIsAdminFlag(e.target.checked)}
                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                  />
                  <div>
                    <span className="block font-bold text-sm text-[var(--text-main)]">Permissão de Administrador</span>
                    <span className="text-xs text-[var(--text-muted)]">Garante acesso ao painel de administração geral do aplicativo.</span>
                  </div>
                </label>
              </div>

              {/* Danger Zone: Delete User */}
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                {!showConfirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="w-full py-3 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={16} /> Excluir Conta do Usuário
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/40 text-center space-y-3">
                    <p className="text-xs font-bold text-red-300">Tem certeza que deseja excluir permanentemente esta conta?</p>
                    <div className="flex gap-2 justify-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmDelete(false)}
                        className="px-4 py-2 rounded-lg bg-[var(--bg-base)] text-xs font-semibold text-[var(--text-muted)]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteUser}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-black flex items-center gap-1"
                      >
                        {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 font-bold text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg"
            >
              {isSaving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
