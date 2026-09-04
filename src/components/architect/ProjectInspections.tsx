import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Calendar, CheckCircle2, FileText, X, Check } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ProjectInspectionsProps {
  projectId: string;
}

interface Inspection {
  id: string;
  title: string;
  date: string;
  inspector: string;
  status: 'Pendente' | 'Concluída';
  type: string;
  items: { id: string; text: string; checked: boolean }[];
  notes: string;
}

const PREDEFINED_CHECKLISTS: Record<string, string[]> = {
  'Fundação': [
    'Verificar locação dos eixos e pilares',
    'Conferir dimensões das valas/sapatas',
    'Checar bitola e armação das ferragens',
    'Verificar prumo e esquadro das fôrmas',
    'Inspecionar concretagem (slump test)',
    'Verificar impermeabilização de baldrames'
  ],
  'Alvenaria e Estrutura': [
    'Conferir prumo das paredes',
    'Verificar esquadro dos cômodos',
    'Inspecionar nível das fiadas',
    'Checar amarração dos tijolos/blocos',
    'Verificar vergas e contravergas nas esquadrias',
    'Conferir chapisco e emboço'
  ],
  'Instalações Hidráulicas': [
    'Teste de estanqueidade das tubulações',
    'Conferir caimento (declividade) de esgoto',
    'Verificar posicionamento de ralos e caixas sifonadas',
    'Checar prumo dos pontos de água',
    'Inspecionar registros de gaveta e pressão'
  ],
  'Instalações Elétricas': [
    'Conferir locação de caixinhas (altura e prumo)',
    'Verificar passagem de conduítes',
    'Checar bitola da fiação conforme projeto',
    'Inspecionar quadro de distribuição (QDC)',
    'Teste de isolamento'
  ],
  'Acabamentos e Revestimentos': [
    'Checar nivelamento do contrapiso',
    'Verificar assentamento e juntas (espaçadores)',
    'Conferir recortes nos cantos e ralos',
    'Inspecionar som oco no revestimento (batida)',
    'Verificar pintura (manchas, escorrimentos, cobertura)'
  ]
};

export function ProjectInspections({ projectId }: ProjectInspectionsProps) {
  const { user, isGuest } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Fundação',
    date: new Date().toISOString().split('T')[0],
    inspector: '',
    notes: '',
  });
  
  const [checklistItems, setChecklistItems] = useState<{id: string, text: string, checked: boolean}[]>([]);

  // Quando mudar o tipo, popula o checklist se for um tipo predefinido
  useEffect(() => {
    if (isModalOpen && formData.type && formData.type !== 'Personalizada') {
      const predefined = PREDEFINED_CHECKLISTS[formData.type];
      if (predefined) {
        setChecklistItems(predefined.map(text => ({ id: crypto.randomUUID(), text, checked: false })));
        if (!formData.title) {
           setFormData(f => ({ ...f, title: `Vistoria de ${formData.type}` }));
        }
      }
    }
  }, [formData.type, isModalOpen]);

  useEffect(() => {
    if (user && !isGuest) {
      loadInspections();
    } else {
      try {
        const local = localStorage.getItem(`co_inspections_${projectId}`);
        if (local) setInspections(JSON.parse(local));
        else setInspections([]);
      } catch (e) {
        setInspections([]);
      }
      setLoading(false);
    }
  }, [projectId, user, isGuest]);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'works', projectId, 'inspections'), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const data: Inspection[] = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as Inspection);
      });
      setInspections(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar vistorias.');
    } finally {
      setLoading(false);
    }
  };

  const saveInspection = async () => {
    if (!formData.title) {
      toast.error('Informe o título da vistoria.');
      return;
    }

    const items = checklistItems.filter(i => i.text.trim().length > 0);

    try {
      const newEntry = {
        ...formData,
        status: 'Pendente',
        items,
        createdAt: serverTimestamp()
      };

      if (user && !isGuest) {
        await addDoc(collection(db, 'works', projectId, 'inspections'), newEntry);
        loadInspections();
        toast.success('Vistoria agendada!');
      } else {
        const updated = [{ id: crypto.randomUUID(), ...newEntry } as any, ...inspections];
        setInspections(updated);
        localStorage.setItem(`co_inspections_${projectId}`, JSON.stringify(updated));
        toast.success('Salvo localmente (Visitante).');
      }
      setIsModalOpen(false);
      setFormData({ title: '', type: 'Fundação', date: new Date().toISOString().split('T')[0], inspector: '', notes: '' });
      setChecklistItems([]);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar vistoria.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>Vistorias Técnicas</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>Checklists e laudos de vistoria de campo vinculados.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ padding: '8px 14px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Nova Vistoria
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : inspections.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', backgroundColor: 'var(--bg-elevated)', borderRadius: 16 }}>
          <ClipboardList size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Nenhuma vistoria agendada.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {inspections.map(insp => (
            <div key={insp.id} style={{ backgroundColor: 'var(--bg-elevated)', padding: 16, borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>{insp.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span style={{ backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>{insp.type || 'Geral'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                    <Calendar size={12} /> {insp.date} â€¢ {insp.inspector}
                  </div>
                </div>
                <span className={`status-chip ${insp.status === 'Concluída' ? 'status-active' : ''}`}>{insp.status}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {insp.items?.slice(0, 3).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-main)' }}>
                    {item.checked ? <CheckCircle2 size={14} color="#10B981" /> : <div style={{ width: 14, height: 14, borderRadius: 7, border: '1px solid var(--border-subtle)' }} />}
                    {item.text}
                  </div>
                ))}
                {insp.items?.length > 3 && (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>+ {insp.items.length - 3} itens</span>
                )}
              </div>

              <button className="btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <FileText size={14} /> Gerar Laudo PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: 20 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: 500, borderRadius: 24, padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Agendar Vistoria</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="input-group">
                  <label>Tipo / Etapa da Obra</label>
                  <select className="input-field" style={{ padding: '0 16px', height: 44 }} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    {Object.keys(PREDEFINED_CHECKLISTS).map(t => <option key={t} value={t}>{t}</option>)}
                    <option value="Personalizada">Personalizada / Outra</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Título da Vistoria</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px', height: 44 }} placeholder="Ex: Conferência de armação" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="input-group">
                  <label>Data</label>
                  <input type="date" className="input-field" style={{ padding: '0 16px' }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Inspetor</label>
                  <input type="text" className="input-field" style={{ padding: '0 16px' }} placeholder="Nome" value={formData.inspector} onChange={e => setFormData({...formData, inspector: e.target.value})} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Checklist de Verificação</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {checklistItems.map((item, idx) => (
                    <div key={item.id} style={{ display: 'flex', gap: 8 }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        style={{ padding: '0 12px', flex: 1, fontSize: 13 }} 
                        placeholder="Item a verificar..." 
                        value={item.text} 
                        onChange={e => {
                          const newItems = [...checklistItems];
                          newItems[idx].text = e.target.value;
                          setChecklistItems(newItems);
                        }} 
                      />
                      <button className="btn-icon" onClick={() => setChecklistItems(checklistItems.filter((_, i) => i !== idx))}><X size={16} /></button>
                    </div>
                  ))}
                  <button onClick={() => setChecklistItems([...checklistItems, { id: crypto.randomUUID(), text: '', checked: false }])} style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: 13, fontWeight: 700, textAlign: 'left', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                    <Plus size={14} /> Adicionar Item
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>Observações Prévias</label>
                <textarea className="input-field" style={{ padding: '12px 16px', minHeight: 60 }} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Instruções para a vistoria..." />
              </div>
            </div>

            <button className="btn-primary" onClick={saveInspection} style={{ width: '100%', padding: 14, borderRadius: 14, marginTop: 20, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Check size={18} /> Agendar Vistoria
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
