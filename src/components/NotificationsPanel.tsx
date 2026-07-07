import { useState, useEffect } from 'react';
import { X, Bell, Info, CheckCircle2, AlertTriangle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'message';
  read: boolean;
  createdAt: any;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  // If no user or guest, we can still show a default welcome notification
  useEffect(() => {
    if (!user || user.isAnonymous) {
      setNotifications([
        {
          id: 'welcome-guest',
          title: 'Bem-vindo à Central da Obra!',
          message: 'Crie uma conta para aproveitar o assistente com IA, salvar projetos na nuvem e calcular orçamentos precisos.',
          type: 'info',
          read: false,
          createdAt: { seconds: Date.now() / 1000 }
        }
      ]);
      setLoading(false);
      return;
    }

    // Load real notifications from Firestore
    const q = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: AppNotification[] = [];
      snapshot.forEach(doc => {
        notifs.push({ id: doc.id, ...doc.data() } as AppNotification);
      });
      setNotifications(notifs);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    if (!user || user.isAnonymous || id.includes('welcome')) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        return;
    }
    try {
      const notifRef = doc(db, 'users', user.uid, 'notifications', id);
      await updateDoc(notifRef, { read: true });
    } catch (e) {
      console.error('Error marking as read', e);
    }
  };

  const markAllAsRead = async () => {
    if (!user || user.isAnonymous) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        return;
    }
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.read).forEach(n => {
        if (!n.id.includes('welcome')) {
          const ref = doc(db, 'users', user.uid, 'notifications', n.id);
          batch.update(ref, { read: true });
        }
      });
      await batch.commit();
    } catch (e) {
      console.error('Error marking all as read', e);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} color="#10B981" />;
      case 'warning': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'message': return <MessageCircle size={20} color="#3B82F6" />;
      default: return <Info size={20} color="#3B82F6" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, display: 'flex', justifyContent: 'flex-end' }}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} 
          />
          <motion.div 
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{ 
              width: '100%', 
              maxWidth: 400, 
              height: '100%', 
              backgroundColor: 'var(--bg-main)', 
              position: 'relative', 
              zIndex: 10001,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                  <Bell size={20} />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Notificações</h2>
                  {unreadCount > 0 && <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>{unreadCount} novas</span>}
                </div>
              </div>
              <button onClick={onClose} className="btn-icon" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {unreadCount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -8 }}>
                  <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Marcar todas como lidas
                  </button>
                </div>
              )}

              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando...</div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <Bell size={48} opacity={0.2} />
                  <p>Você não tem notificações no momento.</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div 
                    key={n.id} 
                    className="card-3d"
                    onClick={() => markAsRead(n.id)}
                    style={{ 
                      padding: 16, 
                      borderRadius: 16, 
                      backgroundColor: n.read ? 'var(--bg-card)' : 'var(--bg-elevated)', 
                      border: `1px solid ${n.read ? 'var(--border-subtle)' : 'var(--color-primary-alpha)'}`,
                      display: 'flex',
                      gap: 16,
                      cursor: n.read ? 'default' : 'pointer',
                      opacity: n.read ? 0.7 : 1,
                      position: 'relative'
                    }}
                  >
                    {!n.read && <div style={{ position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: 4, backgroundColor: 'var(--color-primary)' }} />}
                    
                    <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {getIcon(n.type)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4, paddingRight: 16 }}>{n.title}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>{n.message}</p>
                      {n.createdAt && (
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, display: 'block' }}>
                          {n.createdAt.seconds ? new Date(n.createdAt.seconds * 1000).toLocaleDateString() : 'Agora'}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
