import { useState } from 'react';
import { ArrowLeft, BookOpen, HardHat, Droplets, PaintBucket, Hammer, CheckCircle2, ChevronRight, ExternalLink, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TechnicalLibraryProps {
  onBack: () => void;
  onNavigateToCalc: (type: string) => void;
}

export function TechnicalLibrary({ onBack, onNavigateToCalc }: TechnicalLibraryProps) {
  const [activeTab, setActiveTab] = useState<'topics' | 'norms'>('topics');
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedNorm, setSelectedNorm] = useState<any>(null);

  const topics = [
    {
      id: 'concreto',
      title: 'Concreto',
      icon: <HardHat size={24} />,
      color: '#3B82F6',
      description: 'Guia de traços, preparo e cura.',
      content: {
        tipos: ['Concreto Magro (Contrapiso, base)', 'Concreto Estrutural (Vigas, pilares, lajes)', 'Concreto Ciclópico (Com pedras)'],
        tracos: [
          { nome: 'Fundação/Estrutura (Fck ~25MPa)', traco: '1 : 2 : 3 (Cimento : Areia : Brita)' },
          { nome: 'Contrapiso', traco: '1 : 4 (Cimento : Areia) ou 1 : 3 : 4 (com brita)' }
        ],
        normas: ['NBR 6118 (Projeto de Estruturas)', 'NBR 12655 (Preparo, controle e recebimento)'],
        calcId: 'concreto'
      }
    },
    {
      id: 'argamassa',
      title: 'Argamassas',
      icon: <Hammer size={24} />,
      color: '#F59E0B',
      description: 'Reboco, emboço e assentamento.',
      content: {
        tipos: ['Assentamento de blocos', 'Emboço (massa grossa)', 'Reboco (massa fina)'],
        tracos: [
          { nome: 'Reboco Interno', traco: '1 : 2 : 8 (Cimento : Cal : Areia)' },
          { nome: 'Assentamento de Tijolos', traco: '1 : 2 : 8 ou 1 : 0.5 : 6' }
        ],
        normas: ['NBR 13749 (Revestimento de paredes)', 'NBR 13281 (Argamassa para assentamento)'],
        calcId: 'argamassa'
      }
    },
    {
      id: 'pintura',
      title: 'Pinturas e Acabamentos',
      icon: <PaintBucket size={24} />,
      color: '#EC4899',
      description: 'Rendimento de tintas, texturas e preparo.',
      content: {
        tipos: ['Tinta Acrílica (Externa/Interna)', 'Tinta PVA (Interna)', 'Esmalte Sintético (Madeiras e Metais)'],
        tracos: [
          { nome: 'Rendimento Médio Tinta', traco: 'Aproximadamente 10 a 14 m²/L por demão.' },
          { nome: 'Massa Corrida/Acrílica', traco: 'Consumo: ~1,0 a 1,5 kg/m² por demão.' }
        ],
        normas: ['NBR 13245 (Preparação de superfícies)'],
        calcId: 'tinta'
      }
    },
    {
      id: 'hidraulica',
      title: 'Instalações Hidráulicas',
      icon: <Droplets size={24} />,
      color: '#10B981',
      description: "Tubulações, caixas d'água e esgoto.",
      content: {
        tipos: ['Água Fria (PVC marrom)', 'Esgoto (PVC branco)', 'Água Quente (PPR, CPVC)'],
        tracos: [
          { nome: "Caixa d'água (Consumo)", traco: 'Média de 150L a 200L por pessoa/dia.' },
          { nome: 'Caixa de Gordura', traco: 'Necessária antes de ir para a rede pública.' }
        ],
        normas: ['NBR 5626 (Instalação predial de água fria)', 'NBR 8160 (Sistemas prediais de esgoto sanitário)'],
        calcId: ''
      }
    }
  ];

  const abntNorms = [
    { 
      id: 'NBR 6118', 
      title: 'Projeto de estruturas de concreto', 
      desc: 'Procedimento padrão para projetos estruturais de concreto no Brasil.',
      details: [
        'Define critérios de projeto para garantir segurança, durabilidade e desempenho estrutural.',
        'Estabelece a relação Água/Cimento máxima permitida e o cobrimento nominal das armaduras.',
        'Detalha as classes de agressividade ambiental (CAA) que impactam a qualidade do concreto.',
        'Ponto prático: Em áreas litorâneas (alta agressividade), o Fck mínimo exigido é de 30 MPa.'
      ]
    },
    { 
      id: 'NBR 9050', 
      title: 'Acessibilidade a edificações', 
      desc: 'Mobiliário, espaços e equipamentos urbanos.',
      details: [
        'Regras para dimensionamento de rampas, portas, banheiros e circulações para garantir acesso universal.',
        'A inclinação de rampas para cadeirantes idealmente não deve ultrapassar 8,33%.',
        'Vãos de portas devem ter largura livre mínima de 80 cm.',
        'Ponto prático: Banheiros PCD exigem barras de apoio e diâmetro de giro livre de 1,50 m.'
      ]
    },
    { 
      id: 'NBR 15575', 
      title: 'Edificações Habitacionais - Desempenho', 
      desc: 'Estabelece requisitos mínimos de desempenho para habitações.',
      details: [
        'Conhecida como a Norma de Desempenho, divide o prédio em sistemas (estrutural, vedações, coberturas).',
        'Define os critérios mínimos de isolamento acústico, térmico e durabilidade.',
        'Foca na experiência do usuário final, não apenas em como construir, mas em como o prédio deve se comportar.',
        'Ponto prático: Construtores agora são legalmente responsáveis pelo isolamento acústico entre apartamentos.'
      ]
    },
    { 
      id: 'NBR 5410', 
      title: 'Instalações elétricas de baixa tensão', 
      desc: 'Garante segurança e funcionamento adequado.',
      details: [
        'Pilar das instalações elétricas seguras. Previne choques, curtos e incêndios.',
        'Exige obrigatoriedade do uso de DR (Dispositivo Residual) em áreas molhadas (banheiros, cozinhas, áreas externas).',
        'Define dimensionamento de disjuntores, bitolas de fios e divisão de circuitos.',
        'Ponto prático: Nunca instale disjuntores para proteger o equipamento; o disjuntor deve proteger o cabo contra aquecimento.'
      ]
    },
    { 
      id: 'NBR 16280', 
      title: 'Reforma em edificações', 
      desc: 'Sistema de gestão de reformas e requisitos técnicos.',
      details: [
        'Estabelece a necessidade de laudo e ART/RRT para qualquer obra dentro de condomínios verticaais.',
        'Garante que alterações não prejudiquem a estabilidade da edificação.',
        'Impede a quebra de alvenaria estrutural e lajes sem validação técnica.',
        'Ponto prático: Se vai alterar hidraúlica, elétrica pesada ou derrubar paredes, você precisa entregar um Plano de Reforma ao síndico.'
      ]
    },
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)', zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>Biblioteca Técnica</h2>
      </div>

      <div style={{ padding: 20 }}>
        {!selectedTopic ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 15 }}>
              Acesse guias práticos, traços de materiais e normas técnicas (ABNT) focadas em construção civil.
            </p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: '1px solid var(--border-subtle)' }}>
              <button 
                onClick={() => setActiveTab('topics')}
                style={{ padding: '0 0 12px 0', background: 'none', border: 'none', color: activeTab === 'topics' ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: activeTab === 'topics' ? 700 : 600, borderBottom: activeTab === 'topics' ? '2px solid var(--color-primary)' : 'none', cursor: 'pointer', fontSize: 15 }}
              >
                Guias Práticos
              </button>
              <button 
                onClick={() => setActiveTab('norms')}
                style={{ padding: '0 0 12px 0', background: 'none', border: 'none', color: activeTab === 'norms' ? 'var(--color-primary)' : 'var(--text-muted)', fontWeight: activeTab === 'norms' ? 700 : 600, borderBottom: activeTab === 'norms' ? '2px solid var(--color-primary)' : 'none', cursor: 'pointer', fontSize: 15 }}
              >
                Normas ABNT
              </button>
            </div>

            {/* Content List */}
            {activeTab === 'topics' && (
              <div style={{ display: 'grid', gap: 16 }}>
                {topics.map(topic => (
                  <div key={topic.id} onClick={() => setSelectedTopic(topic)} className="glass-panel card-premium-interactive" style={{ padding: 20, borderRadius: 20, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: `${topic.color}15`, color: topic.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {topic.icon}
                      </div>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{topic.title}</h3>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{topic.description}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} color="var(--text-muted)" style={{ marginTop: 14 }} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'norms' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {abntNorms.map(norm => (
                  <div 
                    key={norm.id} 
                    className="glass-panel card-premium-interactive" 
                    onClick={() => setSelectedNorm(norm)}
                    style={{ padding: 20, borderRadius: 20, borderLeft: '4px solid var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>{norm.id}</h3>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>{norm.title}</h4>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{norm.desc}</p>
                    </div>
                    <FileText size={20} color="var(--color-primary)" />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Topic Details View */
          <div className="animate-fade-in">
            <button onClick={() => setSelectedTopic(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-primary)', background: 'none', border: 'none', fontWeight: 600, marginBottom: 24, cursor: 'pointer' }}>
              <ArrowLeft size={16} /> Voltar para lista
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: `${selectedTopic.color}15`, color: selectedTopic.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedTopic.icon}
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>{selectedTopic.title}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>{selectedTopic.description}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Tipos */}
              <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={18} color="var(--color-success)" /> Tipos Comuns
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selectedTopic.content.tipos.map((tipo: string, idx: number) => (
                    <li key={idx} style={{ color: 'var(--text-muted)', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--text-muted)' }} />
                      {tipo}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Traços */}
              <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={18} color="var(--color-primary)" /> Referência de Traços
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {selectedTopic.content.tracos.map((traco: any, idx: number) => (
                    <div key={idx} style={{ paddingBottom: 16, borderBottom: idx < selectedTopic.content.tracos.length -1 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>{traco.nome}</h4>
                      <p style={{ fontSize: 14, color: 'var(--color-primary)', fontWeight: 600 }}>{traco.traco}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Normas Relacionadas */}
              <div className="glass-panel" style={{ padding: 20, borderRadius: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>Normas Relacionadas</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedTopic.content.normas.map((norma: string, idx: number) => (
                    <div key={idx} style={{ padding: 12, backgroundColor: 'var(--bg-main)', borderRadius: 12, fontSize: 14, color: 'var(--text-main)', fontWeight: 600 }}>
                      {norma}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              {selectedTopic.content.calcId && (
                <button 
                  onClick={() => onNavigateToCalc(selectedTopic.content.calcId)}
                  className="btn-primary" 
                  style={{ padding: 16, borderRadius: 16, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}
                >
                  Abrir Calculadora de {selectedTopic.title}
                  <ExternalLink size={20} />
                </button>
              )}

            </div>
          </div>
        )}
      </div>
      
      {/* Norm Detail Modal */}
      <AnimatePresence>
        {selectedNorm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ width: '100%', maxWidth: 600, backgroundColor: 'var(--bg-main)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: '24px 24px 40px', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)', borderTop: '1px solid var(--border-subtle)', maxHeight: '85vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <FileText size={20} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)' }}>{selectedNorm.id}</h3>
                </div>
                <button onClick={() => setSelectedNorm(null)} style={{ background: 'var(--bg-glass)', border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}>
                  <X size={16} />
                </button>
              </div>

              <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{selectedNorm.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 24, lineHeight: 1.5 }}>
                {selectedNorm.desc}
              </p>

              <div style={{ backgroundColor: 'var(--bg-glass)', borderRadius: 16, padding: 20, border: '1px solid var(--border-subtle)' }}>
                <h5 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={18} color="var(--color-success)" />
                  Resumo Prático (Dia a dia)
                </h5>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {selectedNorm.details.map((detail: string, i: number) => (
                    <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-primary)', marginTop: 8, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.6 }}>
                        {detail.includes('Ponto prático:') ? (
                          <>
                            <strong style={{ color: 'var(--color-primary)' }}>Ponto prático:</strong>
                            {detail.replace('Ponto prático:', '')}
                          </>
                        ) : detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
