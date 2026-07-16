import { ArrowLeft, CheckCircle2, AlertTriangle, ShieldAlert, BookOpen, PenTool, Layers, ExternalLink, Clock, Target, Info, Star } from 'lucide-react';
import type { TechnicalArticle } from '../../data/technicalLibrary';

interface ArticleViewProps {
  article: TechnicalArticle;
  onBack: () => void;
  onNavigateToCalc: (calcId: string) => void;
  onNavigateToArticle: (articleId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ArticleView({ article, onBack, onNavigateToCalc, onNavigateToArticle, isFavorite, onToggleFavorite }: ArticleViewProps) {
  return (
    <div className="screen-content animate-fade-in" style={{ paddingBottom: 120 }}>
      {/* Header Sticky */}
      <div style={{ padding: '20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, backgroundColor: 'rgba(var(--bg-main-rgb), 0.9)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
            <ArrowLeft size={24} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', padding: '4px 12px', backgroundColor: 'var(--color-primary-alpha)', borderRadius: 100 }}>
            {article.category}
          </span>
        </div>
        {onToggleFavorite && (
          <button 
            onClick={onToggleFavorite}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer',
              color: isFavorite ? '#F59E0B' : 'var(--text-muted)'
            }}
          >
            <Star size={24} fill={isFavorite ? '#F59E0B' : 'transparent'} />
          </button>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>{article.title}</h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 24 }}>{article.summary}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Métricas de Execução (Novo) */}
          {(article.content.averageTime || article.content.averageConsumption || article.content.averageYield) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
              {article.content.averageTime && (
                <div className="glass-panel" style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
                  <Clock size={20} color="var(--color-primary)" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Tempo Médio</span>
                  <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 700 }}>{article.content.averageTime}</span>
                </div>
              )}
              {article.content.averageYield && (
                <div className="glass-panel" style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
                  <Target size={20} color="var(--color-primary)" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Rendimento</span>
                  <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 700 }}>{article.content.averageYield}</span>
                </div>
              )}
              {article.content.averageConsumption && (
                <div className="glass-panel" style={{ padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', textAlign: 'center' }}>
                  <Layers size={20} color="var(--color-primary)" />
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Consumo</span>
                  <span style={{ fontSize: 14, color: 'var(--text-main)', fontWeight: 700 }}>{article.content.averageConsumption}</span>
                </div>
              )}
            </div>
          )}

          {/* O que é */}
          <div className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={20} color="var(--color-primary)" /> O que é
            </h3>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>{article.content.whatIsIt}</p>
          </div>

          {/* Quando e Onde Utilizar */}
          {(article.content.whereToUse.length > 0 || (article.content.whenToUse && article.content.whenToUse.length > 0)) && (
            <div className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
              {article.content.whereToUse.length > 0 && (
                <>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Layers size={20} color="var(--color-primary)" /> Onde Utilizar
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: article.content.whenToUse ? 20 : 0 }}>
                    {article.content.whereToUse.map((item, idx) => (
                      <li key={idx} style={{ color: 'var(--text-muted)', fontSize: 15, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-primary)', flexShrink: 0, marginTop: 8 }} />
                        <span style={{ lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {article.content.whenToUse && article.content.whenToUse.length > 0 && (
                <>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={20} color="var(--color-primary)" /> Quando Utilizar
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {article.content.whenToUse.map((item, idx) => (
                      <li key={idx} style={{ color: 'var(--text-muted)', fontSize: 15, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-primary)', flexShrink: 0, marginTop: 8 }} />
                        <span style={{ lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Materiais e Ferramentas */}
          {(article.content.materialsNeeded.length > 0 || article.content.toolsNeeded.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
              {article.content.materialsNeeded.length > 0 && (
                <div className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>Materiais</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {article.content.materialsNeeded.map((item, idx) => (
                      <li key={idx} style={{ color: 'var(--text-muted)', fontSize: 14 }}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {article.content.toolsNeeded.length > 0 && (
                <div className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <PenTool size={16} /> Ferramentas
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {article.content.toolsNeeded.map((item, idx) => (
                      <li key={idx} style={{ color: 'var(--text-muted)', fontSize: 14 }}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Passo a Passo */}
          {article.content.stepByStep.length > 0 && (
            <div className="glass-panel" style={{ padding: 20, borderRadius: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>Passo a Passo (Execução)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {article.content.stepByStep.map((step, idx) => (
                  <div key={idx} style={{ paddingBottom: 16, borderBottom: idx < article.content.stepByStep.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cuidados */}
          {article.content.carePrecautions && article.content.carePrecautions.length > 0 && (
            <div className="glass-panel" style={{ padding: 20, borderRadius: 24, borderLeft: '4px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={20} color="var(--color-primary)" /> Cuidados Especiais
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {article.content.carePrecautions.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-main)', fontSize: 15, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-primary)', flexShrink: 0, marginTop: 8 }} />
                    <span style={{ lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Boas Práticas (Destaque Verde) */}
          {article.content.goodPractices.length > 0 && (
            <div style={{ padding: 20, borderRadius: 24, backgroundColor: 'var(--color-success-bg)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-success)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} /> Boas Práticas
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {article.content.goodPractices.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-main)', fontSize: 15, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-success)', flexShrink: 0, marginTop: 8 }} />
                    <span style={{ lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Erros Comuns (Destaque Vermelho) */}
          {article.content.commonErrors.length > 0 && (
            <div style={{ padding: 20, borderRadius: 24, backgroundColor: 'var(--color-danger-bg)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={20} /> Erros Comuns a Evitar
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {article.content.commonErrors.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-main)', fontSize: 15, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'var(--color-danger)', flexShrink: 0, marginTop: 8 }} />
                    <span style={{ lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Segurança */}
          {article.content.safety.precautions.length > 0 && (
            <div className="glass-panel" style={{ padding: 20, borderRadius: 24, borderLeft: '4px solid #F59E0B' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={18} color="#F59E0B" /> Segurança e EPIs
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {article.content.safety.precautions.map((p, i) => (
                  <p key={i} style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{p}</p>
                ))}
                {article.content.safety.epis.length > 0 && (
                  <p style={{ fontSize: 14, color: 'var(--text-main)', marginTop: 8 }}>
                    <strong>EPIs recomendados:</strong> {article.content.safety.epis.join(', ')}
                  </p>
                )}
                {article.content.safety.nrs.length > 0 && (
                  <p style={{ fontSize: 14, color: 'var(--text-main)', marginTop: 4 }}>
                    <strong>NRs aplicáveis:</strong> {article.content.safety.nrs.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sugestões Inteligentes */}
          <div style={{ marginTop: 24, padding: 24, backgroundColor: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Você também pode gostar de:</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Calculadoras */}
              {article.related.calculators.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Calculadoras</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {article.related.calculators.map(calcId => (
                      <button 
                        key={calcId}
                        onClick={() => onNavigateToCalc(calcId)}
                        className="btn-primary" 
                        style={{ padding: '8px 16px', borderRadius: 100, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        {calcId.replace('-', ' ').toUpperCase()}
                        <ExternalLink size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Normas (Resumos) */}
              {article.related.norms && article.related.norms.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Normas Aplicáveis</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {article.related.norms.map(n => (
                      <div key={n.id} style={{ padding: 12, backgroundColor: 'var(--bg-glass)', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>{n.name}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{n.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Artigos e Problemas */}
              {article.related.articles.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Guias Técnicos Relacionados</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {article.related.articles.map(artId => (
                      <button 
                        key={artId}
                        onClick={() => onNavigateToArticle(artId)}
                        style={{ padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, backgroundColor: 'var(--bg-glass)', color: 'var(--color-primary)', border: '1px solid var(--color-primary-alpha)', cursor: 'pointer' }}
                      >
                        Ler sobre: {artId.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Problemas */}
              {article.related.problems && article.related.problems.length > 0 && (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Problemas Comuns</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {article.related.problems.map(prob => (
                      <span key={prob} style={{ padding: '6px 12px', borderRadius: 100, fontSize: 13, backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
                        {prob}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
