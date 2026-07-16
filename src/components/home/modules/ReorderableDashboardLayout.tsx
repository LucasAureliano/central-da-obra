import React, { useState, useEffect } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { Settings, EyeOff, GripVertical, Plus } from 'lucide-react';

interface ReorderableDashboardLayoutProps {
  defaultOrder: string[];
  renderWidget: (id: string) => React.ReactNode;
  widgetNames: Record<string, string>; // Maps ID to readable name for the hidden list
  children?: React.ReactNode; // For fixed widgets like Insights
}

export function ReorderableDashboardLayout({ defaultOrder, renderWidget, widgetNames, children }: ReorderableDashboardLayoutProps) {
  const { profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const prefs = profile?.dashboardPrefs || { order: defaultOrder, hidden: [] };
  const savedOrder = prefs.order || defaultOrder;
  const savedHidden = prefs.hidden || [];

  // Filter out any invalid IDs
  let validOrder = savedOrder.filter((id: string) => defaultOrder.includes(id));
  let validHidden = savedHidden.filter((id: string) => defaultOrder.includes(id));

  // Ensure no widgets are lost
  defaultOrder.forEach(id => {
    if (!validOrder.includes(id) && !validHidden.includes(id)) {
      validOrder.push(id);
    }
  });

  const [localOrder, setLocalOrder] = useState<string[]>(validOrder);
  const [localHidden, setLocalHidden] = useState<string[]>(validHidden);

  useEffect(() => {
    setLocalOrder(validOrder);
    setLocalHidden(validHidden);
  }, [profile?.dashboardPrefs]);

  const savePreferences = async (newOrder: string[], newHidden: string[]) => {
    if (!profile?.uid) return;
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, {
        'dashboardPrefs.order': newOrder,
        'dashboardPrefs.hidden': newHidden
      });
    } catch (err) {
      console.error('Erro ao salvar reordenação', err);
    }
  };

  const handleReorder = (newOrder: string[]) => {
    setLocalOrder(newOrder);
    savePreferences(newOrder, localHidden);
  };

  const hideWidget = (id: string) => {
    const newOrder = localOrder.filter(w => w !== id);
    const newHidden = [...localHidden, id];
    setLocalOrder(newOrder);
    setLocalHidden(newHidden);
    savePreferences(newOrder, newHidden);
  };

  const showWidget = (id: string) => {
    const newHidden = localHidden.filter(w => w !== id);
    const newOrder = [...localOrder, id];
    setLocalOrder(newOrder);
    setLocalHidden(newHidden);
    savePreferences(newOrder, newHidden);
  };

  return (
    <div className="screen-content hide-scrollbar" style={{ paddingTop: 24, paddingLeft: 20, paddingRight: 20, paddingBottom: 120 }}>
      {children}

      <Reorder.Group axis="y" values={localOrder} onReorder={handleReorder} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <AnimatePresence>
          {localOrder.map((id: string) => {
            const widgetNode = renderWidget(id);
            if (!widgetNode) return null;
            return (
              <Reorder.Item 
                key={id} 
                value={id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                style={{ cursor: isEditing ? 'grab' : 'default', position: 'relative', marginBottom: isEditing ? 8 : 0 }} 
                whileDrag={{ scale: 1.02, cursor: 'grabbing', zIndex: 50 }}
                dragListener={isEditing}
              >
                {isEditing && (
                  <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10, display: 'flex', gap: 8 }}>
                    <button 
                      onClick={() => hideWidget(id)}
                      style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#FFF', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <EyeOff size={16} />
                    </button>
                    <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <GripVertical size={16} />
                    </div>
                  </div>
                )}
                <div style={{ opacity: isEditing ? 0.8 : 1, transition: 'opacity 0.2s', pointerEvents: isEditing ? 'none' : 'auto' }}>
                  {widgetNode}
                </div>
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      {isEditing && localHidden.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 24, padding: 16, backgroundColor: 'var(--bg-elevated)', borderRadius: 16 }}
        >
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>Adicionar Cards</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {localHidden.map(id => (
              <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: 'var(--bg-surface)', borderRadius: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{widgetNames[id] || id}</span>
                <button 
                  onClick={() => showWidget(id)}
                  style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div style={{ marginTop: 32, padding: 20, backgroundColor: 'var(--bg-glass)', borderRadius: 16, border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <Settings size={20} color="var(--color-primary)" />
          <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Personalize sua tela</h4>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.4 }}>
          Organize os cards da maneira que preferir ou oculte módulos que não utiliza com frequência. Os cards de Insights e Central de Cálculos permanecem fixos.
        </p>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? "btn-primary" : "btn-secondary"}
          style={{ width: '100%', borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 600 }}
        >
          {isEditing ? 'Concluir Edição' : 'Personalizar Painel'}
        </button>
      </div>
    </div>
  );
}
