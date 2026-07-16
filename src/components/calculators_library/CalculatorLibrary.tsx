import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Search, ChevronRight, BrickWall, Droplet, Layers, LayoutGrid, PaintRoller, Brush, Home, Umbrella, Zap, Droplets, Sparkles, Box, X } from 'lucide-react';
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
import { LightingCalc } from './LightingCalc';
import { BlondelCalc } from './BlondelCalc';
import { Lightbulb, Ruler } from 'lucide-react';

type CalcId = 'masonry' | 'concrete-mix' | 'isolated-footing' | 'floor' | 'paint' | 'texture' | 'roofing' | 'waterproofing' | 'electrical' | 'plumbing' | 'drywall' | 'plaster' | 'lighting' | 'blondel' | null;

interface CalculatorLibraryProps {
  onNavigate: (tab: string, param?: string) => void;
}

export function CalculatorLibrary({ onNavigate }: CalculatorLibraryProps) {
  const [activeCalc, setActiveCalc] = useState<CalcId>(null);
  const [search, setSearch] = useState('');

  const db = [
    { id: 'masonry', title: 'Alvenaria (Blocos e Tijolos)', desc: 'Cálculo de blocos e argamassa', icon: <BrickWall size={24} color="#F59E0B" />, cat: 'Alvenaria' },
    { id: 'concrete-mix', title: 'Traço de Concreto', desc: 'Cimento, Areia, Brita', icon: <Droplet size={24} color="#3B82F6" />, cat: 'Estrutura' },
    { id: 'isolated-footing', title: 'Sapata Isolada', desc: 'Fundação direta', icon: <Box size={24} color="#8B5CF6" />, cat: 'Estrutura' },
    { id: 'floor', title: 'Porcelanato e Cerâmica', desc: 'Pisos e Revestimentos', icon: <LayoutGrid size={24} color="#10B981" />, cat: 'Acabamentos' },
    { id: 'paint', title: 'Pintura de Parede', desc: 'Látex, Epóxi, Esmalte', icon: <PaintRoller size={24} color="#EC4899" />, cat: 'Acabamentos' },
    { id: 'texture', title: 'Texturas e Grafiato', desc: 'Revestimento texturizado', icon: <Brush size={24} color="#F43F5E" />, cat: 'Acabamentos' },
    { id: 'roofing', title: 'Cobertura Completa', desc: 'Telhas e Estrutura', icon: <Home size={24} color="#EAB308" />, cat: 'Cobertura' },
    { id: 'waterproofing', title: 'Impermeabilização', desc: 'Lajes e Áreas Molhadas', icon: <Umbrella size={24} color="#06B6D4" />, cat: 'Impermeabilização' },
    { id: 'electrical', title: 'Elétrica', desc: 'Pontos, Eletrodutos e Cabos', icon: <Zap size={24} color="#F59E0B" />, cat: 'Instalações' },
    { id: 'plumbing', title: 'Hidrossanitário', desc: 'Água Fria, Quente e Esgoto', icon: <Droplets size={24} color="#0EA5E9" />, cat: 'Instalações' },
    { id: 'drywall', title: 'Drywall', desc: 'Chapas e Perfis', icon: <Layers size={24} color="#64748B" />, cat: 'Gesso' },
    { id: 'plaster', title: 'Gesso', desc: 'Plaquinhas e Acabamento', icon: <Sparkles size={24} color="#94A3B8" />, cat: 'Gesso' },
    { id: 'lighting', title: 'Cálculo Luminotécnico', desc: 'NBR ISO 8995-1', icon: <Lightbulb size={24} color="#F59E0B" />, cat: 'Arquitetura & Interiores' },
    { id: 'blondel', title: 'Fórmula de Blondel', desc: 'Dimensionamento de Escadas', icon: <Ruler size={24} color="#8B5CF6" />, cat: 'Arquitetura & Interiores' }
  ] as const;

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
  if (activeCalc === 'lighting') return <LightingCalc onBack={() => setActiveCalc(null)} />;
  if (activeCalc === 'blondel') return <BlondelCalc onBack={() => setActiveCalc(null)} />;

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
    else if (spec.includes('pedreiro')) priorityCat = 'Alvenaria';
    else if (spec.includes('mestre de obras')) priorityCat = 'Estrutura';
    
    if (priorityCat) {
      categories = [priorityCat, ...categories.filter(c => c !== priorityCat)];
    }
  }

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '0 20px', paddingTop: 24, paddingBottom: 100 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>Assistentes Técnicos</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Escolha um assistente específico.</p>

      <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, border: '1px solid var(--border-subtle)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Search size={20} color="var(--color-primary)" />
        <input 
          type="text" 
          placeholder="Buscar por parede, concreto, piso..." 
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {categories.map(cat => {
          const items = filtered.filter(c => c.cat === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>{cat}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {items.map(item => {
                  const inDevelopment = item.id === 'lighting' || item.id === 'blondel';
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id} 
                      className={`glass-panel animate-fade-in ${inDevelopment ? '' : 'card-premium-interactive'}`} 
                      onClick={() => !inDevelopment && setActiveCalc(item.id)}
                      whileHover={inDevelopment ? {} : { scale: 1.02 }}
                      whileTap={inDevelopment ? {} : { scale: 0.98 }}
                      style={{ 
                        padding: 16, 
                        borderRadius: 20, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        opacity: inDevelopment ? 0.6 : 1,
                        cursor: inDevelopment ? 'not-allowed' : 'pointer'
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
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma calculadora encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}
