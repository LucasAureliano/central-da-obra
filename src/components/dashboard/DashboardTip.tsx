import { Sparkles, GripVertical } from 'lucide-react';

export function DashboardTip() {
  return (
    <div className="glass-panel" style={{ padding: 24, borderRadius: 24, position: 'relative' }}>
      <div className="drag-handle" style={{ position: 'absolute', top: 16, right: 16, cursor: 'grab', color: 'var(--text-muted)' }}>
        <GripVertical size={20} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#8B5CF620', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={16} color="#8B5CF6" />
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: 1 }}>Dica Funcional (3D)</span>
      </div>
      <p style={{ fontSize: 15, color: 'var(--text-main)', fontWeight: 600, marginBottom: 8 }}>O tempo de cura do concreto</p>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>Lembre-se que o concreto leva cerca de 28 dias para atingir sua resistência máxima (Fck). Mantenha a cura úmida nos primeiros 7 dias para evitar fissuras.</p>
    </div>
  );
}
