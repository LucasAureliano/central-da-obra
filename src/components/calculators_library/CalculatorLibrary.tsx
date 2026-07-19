import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, BrickWall, Droplet, Layers, LayoutGrid, PaintRoller, Brush, Home, Umbrella, Zap, Droplets, Sparkles, Box, X, Sun, Wind, PenTool, Lightbulb, Compass, Ruler } from 'lucide-react';
import { MasonryCalc } from './MasonryCalc';
import { ConcreteMixCalc } from './ConcreteMixCalc';
import { IsolatedFootingCalc } from './IsolatedFootingCalc';
import { FloorTileCalc } from './FloorTileCalc';
import { WallPaintCalc } from './WallPaintCalc';
import { TextureCalc } from './TextureCalc';
import { RoofingCalc } from './RoofingCalc';
import { WaterproofingCalc } from './WaterproofingCalc';
import { ElectricalCalc } from './ElectricalCalc';
import { PlumbingCalc } from './PlumbingCalc';
import { DrywallCalc } from './DrywallCalc';
import { PlasterCalc } from './PlasterCalc';
import { BlondelCalc } from './BlondelCalc';

import { LightingWizard } from './LightingWizard';
import { SpotsCalc } from './SpotsCalc';
import { LedStripCalc } from './LedStripCalc';
import { AirConditioningCalc } from './AirConditioningCalc';
import { BaseboardCalc } from './BaseboardCalc';
import { WallpaperCalc } from './WallpaperCalc';
import { PlasteringCalc } from './PlasteringCalc';
import { CountertopCalc } from './CountertopCalc';
import { WaterTankCalc } from './WaterTankCalc';
import { SolarPowerCalc } from './SolarPowerCalc';
// import { ProjectWizard } from '../interiordesign/ProjectWizard';

export type CalcId = 
  // Estrutura & Alvenaria
  | 'masonry' | 'concrete-mix' | 'isolated-footing'
  // Acabamentos
  | 'floor' | 'paint' | 'texture' | 'baseboard' | 'wallpaper' | 'countertop'
  // Cobertura & Impermeabilização
  | 'roofing' | 'waterproofing'
  // Instalações (Elétrica, Hidráulica, Clima, Solar)
  | 'electrical' | 'plumbing' | 'air-conditioning' | 'water-tank' | 'solar-power'
  // Gesso
  | 'drywall' | 'plaster' | 'plastering'
  // Arquitetura & Interiores
  | 'lighting' | 'blondel' | 'lighting-wizard' | 'spots' | 'led-strip' | 'project-wizard' 
  | null;

interface CalculatorLibraryProps {
  onNavigate: (tab: string, param?: string) => void;
}

export function CalculatorLibrary({ onNavigate }: CalculatorLibraryProps) {
  const [activeCalc, setActiveCalc] = useState<CalcId>(null);
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const db = [
    // Estrutura & Alvenaria
    { id: 'masonry', title: 'Alvenaria (Blocos e Tijolos)', desc: 'Cálculo de blocos e argamassa', icon: <BrickWall size={24} color="#F59E0B" />, cat: 'Estrutura & Alvenaria' },
    { id: 'concrete-mix', title: 'Traço de Concreto', desc: 'Cimento, Areia, Brita', icon: <Droplet size={24} color="#3B82F6" />, cat: 'Estrutura & Alvenaria' },
    { id: 'isolated-footing', title: 'Sapata Isolada', desc: 'Fundação direta', icon: <Box size={24} color="#8B5CF6" />, cat: 'Estrutura & Alvenaria' },
    
    // Acabamentos
    { id: 'floor', title: 'Porcelanato e Cerâmica', desc: 'Pisos e Revestimentos', icon: <LayoutGrid size={24} color="#10B981" />, cat: 'Acabamentos' },
    { id: 'paint', title: 'Pintura de Parede', desc: 'Látex, Epóxi, Esmalte', icon: <PaintRoller size={24} color="#EC4899" />, cat: 'Acabamentos' },
    { id: 'texture', title: 'Texturas e Grafiato', desc: 'Revestimento texturizado', icon: <Brush size={24} color="#F43F5E" />, cat: 'Acabamentos' },
    { id: 'baseboard', title: 'Rodapés', desc: 'Metros lineares e barras', icon: <Layers size={24} color="#F59E0B" />, cat: 'Acabamentos' },
    { id: 'wallpaper', title: 'Papel de Parede', desc: 'Rolos e descontos de vãos', icon: <Layers size={24} color="#8B5CF6" />, cat: 'Acabamentos' },
    { id: 'countertop', title: 'Bancadas', desc: 'Granito, Quartzo, Porcelanato', icon: <LayoutGrid size={24} color="#0EA5E9" />, cat: 'Acabamentos' },

    // Cobertura & Impermeabilização
    { id: 'roofing', title: 'Cobertura Completa', desc: 'Telhas e Estrutura', icon: <Home size={24} color="#EAB308" />, cat: 'Cobertura & Impermeabilização' },
    { id: 'waterproofing', title: 'Impermeabilização', desc: 'Lajes e Áreas Molhadas', icon: <Umbrella size={24} color="#06B6D4" />, cat: 'Cobertura & Impermeabilização' },

    // Instalações
    { id: 'electrical', title: 'Elétrica Básica', desc: 'Pontos, Eletrodutos e Cabos', icon: <Zap size={24} color="#F59E0B" />, cat: 'Instalações' },
    { id: 'plumbing', title: 'Hidrossanitário', desc: 'Água Fria, Quente e Esgoto', icon: <Droplets size={24} color="#0EA5E9" />, cat: 'Instalações' },
    { id: 'air-conditioning', title: 'Ar Condicionado (BTUs)', desc: 'Dimensionamento térmico', icon: <Wind size={24} color="#3B82F6" />, cat: 'Instalações' },
    { id: 'water-tank', title: 'Caixa d\'Água', desc: 'Volume e reserva', icon: <Droplet size={24} color="#0EA5E9" />, cat: 'Instalações' },
    { id: 'solar-power', title: 'Energia Solar', desc: 'Placas e Economia', icon: <Sun size={24} color="#F59E0B" />, cat: 'Instalações' },

    // Gesso
    { id: 'drywall', title: 'Drywall', desc: 'Chapas e Perfis', icon: <Layers size={24} color="#64748B" />, cat: 'Gesso' },
    { id: 'plaster', title: 'Gesso (Plaquinhas)', desc: 'Plaquinhas e Acabamento', icon: <Sparkles size={24} color="#94A3B8" />, cat: 'Gesso' },
    { id: 'plastering', title: 'Forros, Sancas e Tabicas', desc: 'Cálculo de molduras', icon: <PenTool size={24} color="#8B5CF6" />, cat: 'Gesso' },

    // Arquitetura & Interiores
    { id: 'lighting-wizard', title: 'Assistente de Iluminação', desc: 'Dimensionamento Luminotécnico', icon: <Lightbulb size={24} color="#F59E0B" />, cat: 'Design de Interiores' },
    { id: 'spots', title: 'Calculadora de Spots', desc: 'Espaçamento e Distribuição', icon: <Zap size={24} color="#EAB308" />, cat: 'Design de Interiores' },
    { id: 'led-strip', title: 'Fita LED', desc: 'Fonte, Driver e Potência', icon: <Sparkles size={24} color="#F43F5E" />, cat: 'Design de Interiores' },
    { id: 'project-wizard', title: 'Assistente de Projeto', desc: 'Geração de Ficha Técnica', icon: <Compass size={24} color="#8B5CF6" />, cat: 'Design de Interiores' },
    { id: 'blondel', title: 'Fórmula de Blondel', desc: 'Dimensionamento de Escadas', icon: <Ruler size={24} color="#10B981" />, cat: 'Design de Interiores' }
  ] as const;

  // Active Calculator Routing
  if (activeCalc === 'masonry') return <MasonryCalc onBack={() => setActiveCalc(null)} onNavigate={onNavigate} />;
  if (activeCalc === 'concrete-mix') return <ConcreteMixCalc onBack={() => setActiveCalc(null)} onNavigate={onNavigate} />;
  if (activeCalc === 'isolated-footing') return <IsolatedFootingCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'floor') return <FloorTileCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'paint') return <WallPaintCalc onBack={() => setActiveCalc(null)} onNavigate={onNavigate} />;
  if (activeCalc === 'texture') return <TextureCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'roofing') return <RoofingCalc onBack={() => setActiveCalc(null)} onNavigate={onNavigate} />;
  if (activeCalc === 'waterproofing') return <WaterproofingCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'electrical') return <ElectricalCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'plumbing') return <PlumbingCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'drywall') return <DrywallCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'plaster') return <PlasterCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'blondel') return <BlondelCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'lighting-wizard') return <LightingWizard onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'spots') return <SpotsCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'led-strip') return <LedStripCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'air-conditioning') return <AirConditioningCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'baseboard') return <BaseboardCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'wallpaper') return <WallpaperCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'plastering') return <PlasteringCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'countertop') return <CountertopCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'water-tank') return <WaterTankCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'solar-power') return <SolarPowerCalc onBack={() => setActiveCalc(null)} />;

  // Temporarily block new calculators
  const isNew = (id: string) => ['project-wizard'].includes(id);

  const { profile } = useAuth();
  const filtered = db.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.cat.toLowerCase().includes(search.toLowerCase()));

  let categories: string[] = Array.from(new Set(db.map(c => c.cat)));
  
  if (profile?.specialty) {
    const spec = profile.specialty.toLowerCase();
    let priorityCat = '';
    if (spec.includes('pintor')) priorityCat = 'Acabamentos';
    else if (spec.includes('eletricista')) priorityCat = 'Instalações';
    else if (spec.includes('encanador')) priorityCat = 'Instalações';
    else if (spec.includes('gesseiro') || spec.includes('drywall')) priorityCat = 'Gesso';
    else if (spec.includes('pedreiro')) priorityCat = 'Estrutura & Alvenaria';
    else if (spec.includes('mestre de obras')) priorityCat = 'Estrutura & Alvenaria';
    
    if (priorityCat && categories.includes(priorityCat)) {
      categories = [priorityCat, ...categories.filter(c => c !== priorityCat)];
    }
  }

  // Se houver busca, abre todas as categorias para mostrar os resultados
  const shouldExpand = (cat: string) => search.length > 0 || expandedCategory === cat;

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Central Técnica</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Selecione um assistente ou calculadora.</p>

      <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, border: '1px solid var(--border-subtle)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Search size={20} color="var(--color-primary)" />
        <input 
          type="text" 
          placeholder="Buscar por rodapé, ar condicionado, pintura..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', flex: 1, fontSize: 16 }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ background: 'var(--bg-elevated)', border: 'none', width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {categories.map(cat => {
          const items = filtered.filter(c => c.cat === cat);
          if (items.length === 0) return null;

          const isExpanded = shouldExpand(cat);

          return (
            <div key={cat} className="glass-panel" style={{ borderRadius: 20, overflow: 'hidden' }}>
              <button 
                onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                style={{ 
                  width: '100%', 
                  padding: 20, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{cat}</h2>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </motion.div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {items.map(item => {
                        const inDevelopment = isNew(item.id);
                        return (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={item.id} 
                            className={`glass-panel animate-fade-in ${inDevelopment ? '' : 'card-premium-interactive'}`} 
                            onClick={() => !inDevelopment && setActiveCalc(item.id)}
                            whileHover={inDevelopment ? {} : { scale: 1.02 }}
                            whileTap={inDevelopment ? {} : { scale: 0.98 }}
                            style={{ 
                              padding: 16, 
                              borderRadius: 16, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              opacity: inDevelopment ? 0.6 : 1,
                              cursor: inDevelopment ? 'not-allowed' : 'pointer',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--bg-input-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.icon}
                              </div>
                              <div>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)' }}>
                                  {item.title} {inDevelopment && <span style={{ fontSize: 10, padding: '2px 6px', background: 'var(--color-primary-alpha)', color: 'var(--color-primary)', borderRadius: 8, marginLeft: 8, verticalAlign: 'middle' }}>Em Breve</span>}
                                </h3>
                                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</p>
                              </div>
                            </div>
                            {!inDevelopment && <ChevronRight size={20} color="var(--text-muted)" />}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: 'var(--text-muted)' }}>Nenhum assistente encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
