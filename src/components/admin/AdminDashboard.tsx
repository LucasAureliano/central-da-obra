import React, { useState, useEffect } from 'react';
import { Shield, Search, Users, Crown, AlertTriangle, ArrowLeft, RefreshCw, Filter } from 'lucide-react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { UserManagementModal } from './UserManagementModal';
import type { UserProfile } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

type FilterKey = 'all' | 'free' | 'starter' | 'premium' | 'admin';

const ROLE_COLORS: Record<string, string> = {
  owner: '#3B82F6',
  service: '#F59E0B',
  architect: '#8B5CF6',
  engineer: '#10B981',
  builder: '#64748B',
};

const ROLE_LABELS: Record<string, string> = {
  owner: 'Proprietário',
  service: 'Prestador',
  architect: 'Arquiteto',
  engineer: 'Engenheiro',
  builder: 'Construtora',
};

export const AdminDashboard: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(200));
      const snap = await getDocs(q);
      const fetched: UserProfile[] = [];
      snap.forEach(doc => {
        fetched.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(fetched);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao buscar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.isAdmin) fetchUsers();
    else setLoading(false);
  }, [profile]);

  if (!profile?.isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Shield size={40} color="#EF4444" />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>Acesso Restrito</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 340 }}>Você não tem permissão para acessar o Painel Administrativo.</p>
        <button onClick={() => onNavigate('resumo')} className="btn-primary" style={{ padding: '12px 32px', borderRadius: 16 }}>Voltar ao Início</button>
      </div>
    );
  }

  const totalUsers = users.length;
  const premiumUsers = users.filter(u => ['ACTIVE', 'COMP', 'TESTER'].includes(u.subscription?.status || '') && u.subscription?.planId !== 'free' && u.subscription?.planId !== 'starter').length;
  const starterUsers = users.filter(u => u.subscription?.planId === 'starter' && u.subscription?.status === 'ACTIVE').length;
  const freeUsers = users.filter(u => !['ACTIVE', 'COMP', 'TESTER'].includes(u.subscription?.status || '') || u.subscription?.planId === 'free').length;

  const filterFns: Record<FilterKey, (u: UserProfile) => boolean> = {
    all: () => true,
    free: u => !['ACTIVE', 'COMP', 'TESTER'].includes(u.subscription?.status || '') || u.subscription?.planId === 'free',
    starter: u => u.subscription?.planId === 'starter' && u.subscription?.status === 'ACTIVE',
    premium: u => ['ACTIVE', 'COMP', 'TESTER'].includes(u.subscription?.status || '') && u.subscription?.planId !== 'free' && u.subscription?.planId !== 'starter',
    admin: u => !!u.isAdmin,
  };

  const filteredUsers = users
    .filter(filterFns[activeFilter])
    .filter(u =>
      (u.name || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchFilter.toLowerCase())
    );

  const getPlanBadge = (u: UserProfile) => {
    const planId = u.subscription?.planId || 'free';
    const status = u.subscription?.status || 'FREE';
    const isPaid = ['ACTIVE', 'COMP', 'TESTER'].includes(status);
    if (status === 'COMP') return { label: 'CORTESIA', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' };
    if (status === 'TESTER') return { label: 'TESTER', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' };
    if (isPaid && planId !== 'free' && planId !== 'starter') return { label: 'PREMIUM', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' };
    if (isPaid && planId === 'starter') return { label: 'BÁSICO', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' };
    return { label: 'FREE', color: 'var(--text-muted)', bg: 'var(--bg-elevated)' };
  };

  const filterOptions: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'Todos', count: totalUsers },
    { key: 'free', label: 'Free', count: freeUsers },
    { key: 'starter', label: 'Básico', count: starterUsers },
    { key: 'premium', label: 'Premium', count: premiumUsers },
    { key: 'admin', label: 'Admin', count: users.filter(u => u.isAdmin).length },
  ];

  return (
    <div className="screen-content hide-scrollbar" style={{ padding: '0 0 100px 0' }}>
      <div style={{ padding: '20px 20px 0', marginBottom: 24 }}>
        <button onClick={() => onNavigate('resumo')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
          <ArrowLeft size={18} /> Voltar
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={24} color="#FFF" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Painel Admin</h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Gestão de assinaturas e permissões</p>
            </div>
          </div>
          <button onClick={fetchUsers} style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, padding: '0 20px', marginBottom: 20 }}>
        {[
          { label: 'Usuários', value: totalUsers, icon: <Users size={16} />, color: '#3B82F6' },
          { label: 'Premium', value: premiumUsers, icon: <Crown size={16} />, color: '#F59E0B' },
          { label: 'Básico', value: starterUsers, icon: <Crown size={16} />, color: '#3B82F6' },
          { label: 'Free', value: freeUsers, icon: <Users size={16} />, color: 'var(--text-muted)' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '12px 10px', borderRadius: 14, textAlign: 'center' }}>
            <div style={{ color: stat.color, marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', padding: '0 20px', marginBottom: 14 }}>
        <div style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: '12px 16px 12px 44px', color: 'var(--text-main)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 20px', marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {filterOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setActiveFilter(opt.key)}
            style={{
              flexShrink: 0,
              padding: '7px 14px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              transition: 'all 0.2s',
              background: activeFilter === opt.key ? 'var(--color-primary)' : 'var(--bg-elevated)',
              color: activeFilter === opt.key ? '#FFF' : 'var(--text-muted)',
              boxShadow: activeFilter === opt.key ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {opt.label} {opt.count > 0 && <span style={{ opacity: 0.8, fontSize: 11 }}>({opt.count})</span>}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="glass-panel animate-pulse" style={{ padding: 16, borderRadius: 18, height: 80 }} />
          ))
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <Filter size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Nenhum usuário encontrado.</p>
          </div>
        ) : filteredUsers.map(u => {
          const planBadge = getPlanBadge(u);
          const roleColor = ROLE_COLORS[u.role || 'owner'] || '#64748B';
          const roleLabel = ROLE_LABELS[u.role || 'owner'] || u.role || 'GUEST';
          return (
            <div key={u.uid} className="glass-panel" style={{ padding: '14px 16px', borderRadius: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: `${roleColor}22`, border: `2px solid ${roleColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: roleColor, flexShrink: 0 }}>
                {(u.name || u.email || '?').charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{u.name || 'Sem nome'}</span>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 700, background: `${roleColor}22`, color: roleColor }}>{roleLabel}</span>
                  {u.isAdmin && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 700, background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}>ADMIN</span>}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 10, fontWeight: 700, background: planBadge.bg, color: planBadge.color }}>{planBadge.label}</span>
                  {u.subscription?.expiresAt && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                      Exp: {(u.subscription.expiresAt as any).toDate ? (u.subscription.expiresAt as any).toDate().toLocaleDateString('pt-BR') : new Date(u.subscription.expiresAt as any).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(u)}
                style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 12, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#8B5CF6', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Gerenciar
              </button>
            </div>
          );
        })}
      </div>

      {selectedUser && (
        <UserManagementModal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          userProfile={selectedUser}
          onUpdate={() => { fetchUsers(); }}
        />
      )}
    </div>
  );
};
