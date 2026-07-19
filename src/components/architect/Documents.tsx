import { useState } from 'react';
import { FileSignature, Plus, Search, FileText, ShieldCheck, FileCheck } from 'lucide-react';

export function Documents() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="screen-content animate-fade-in" style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 24, paddingBottom: 100 }}>
      {/* Header */}
      <div className="animate-stagger-1" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, letterSpacing: '-0.5px' }}>
          Documentos Técnicos
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)' }}>
          Gestão de ART/RRT, aprovações, alvarás e projetos complementares.
        </p>
      </div>

      {/* Actions */}
      <div className="animate-stagger-2" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 14 }} />
          <input 
            type="text" 
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: 16, border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)', fontSize: 15 }}
          />
        </div>
        <button className="btn-primary" style={{ padding: '14px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 600 }}>
          <Plus size={20} />
          Anexar Documento
        </button>
      </div>

      {/* Categories Grid */}
      <div className="animate-stagger-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { icon: <FileSignature size={24} color="#8B5CF6" />, label: 'ART / RRT', count: 0 },
          { icon: <ShieldCheck size={24} color="#10B981" />, label: 'Alvarás', count: 0 },
          { icon: <FileCheck size={24} color="#3B82F6" />, label: 'Aprovações', count: 0 },
          { icon: <FileText size={24} color="#F59E0B" />, label: 'Projetos', count: 0 },
        ].map((cat, i) => (
          <div key={i} className="card-premium-interactive" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              {cat.icon}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>{cat.label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{cat.count} anexos</div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      <div className="animate-stagger-4 card-premium" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <FileText size={32} color="var(--text-muted)" />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>
          Repositório Vazio
        </h3>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 300, lineHeight: 1.5 }}>
          Centralize toda a documentação legal e projetos da obra neste espaço seguro.
        </p>
      </div>
    </div>
  );
}
