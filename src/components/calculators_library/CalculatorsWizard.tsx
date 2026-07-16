import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, BrickWall, Droplet, Layers, LayoutGrid, PaintRoller, Brush, Home, Umbrella, Zap, Droplets, Sparkles, Box, X, Calculator, Lightbulb, Ruler } from 'lucide-react';
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

type CalcId = 'masonry' | 'concrete-mix' | 'isolated-footing' | 'floor' | 'paint' | 'texture' | 'roofing' | 'waterproofing' | 'electrical' | 'plumbing' | 'drywall' | 'plaster' | 'lighting' | 'blondel' | null;

interface CalculatorsWizardProps {
  onNavigate: (tab: string, param?: string) => void;
  initialQuery?: string;
}

export function CalculatorsWizard({ onNavigate, initialQuery }: CalculatorsWizardProps) {
  const [activeCalc, setActiveCalc] = useState<CalcId>(null);
  const [search, setSearch] = useState(initialQuery || '');

  const db = [
    { id: 'paint', title: 'Pintura', desc: 'Paredes, tetos e fachadas', icon: <PaintRoller size={24} color="#EC4899" />, cat: 'Acabamentos' },
    { id: 'floor', title: 'Piso e Porcelanato', desc: 'Revestimentos cerâmicos', icon: <LayoutGrid size={24} color="#10B981" />, cat: 'Acabamentos' },
    { id: 'concrete-mix', title: 'Traço de Concreto', desc: 'Cimento, areia e brita', icon: <Droplet size={24} color="#3B82F6" />, cat: 'Estrutura' },
    { id: 'masonry', title: 'Alvenaria', desc: 'Blocos e tijolos', icon: <BrickWall size={24} color="#F59E0B" />, cat: 'Alvenaria' },
    { id: 'isolated-footing', title: 'Fundação / Sapata', desc: 'Cálculo de base', icon: <Box size={24} color="#8B5CF6" />, cat: 'Estrutura' },
    { id: 'roofing', title: 'Cobertura', desc: 'Telhas e estrutura', icon: <Home size={24} color="#EAB308" />, cat: 'Cobertura' },
    { id: 'drywall', title: 'Drywall', desc: 'Chapas e perfis', icon: <Layers size={24} color="#64748B" />, cat: 'Gesso' },
    { id: 'plaster', title: 'Gesso', desc: 'Plaquinhas e sanca', icon: <Sparkles size={24} color="#94A3B8" />, cat: 'Gesso' },
    { id: 'waterproofing', title: 'Impermeabilização', desc: 'Áreas molhadas', icon: <Umbrella size={24} color="#06B6D4" />, cat: 'Impermeabilização' },
    { id: 'electrical', title: 'Elétrica', desc: 'Fios e conduítes', icon: <Zap size={24} color="#F59E0B" />, cat: 'Instalações' },
    { id: 'plumbing', title: 'Hidráulica', desc: 'Água e esgoto', icon: <Droplets size={24} color="#0EA5E9" />, cat: 'Instalações' },
    { id: 'texture', title: 'Textura e Grafiato', desc: 'Acabamentos', icon: <Brush size={24} color="#F43F5E" />, cat: 'Acabamentos' },
    { id: 'lighting', title: 'Iluminação', desc: 'Cálculo luminotécnico', icon: <Lightbulb size={24} color="#F59E0B" />, cat: 'Arquitetura' },
    { id: 'blondel', title: 'Escada (Blondel)', desc: 'Degraus e pisada', icon: <Ruler size={24} color="#8B5CF6" />, cat: 'Arquitetura' }
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

  const filtered = db.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.cat.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* Fake Wizard Header to make it feel like Step 0 */}
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, backgroundColor: 'var(--bg-base)', zIndex: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Calculator size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>Assistente de Cálculos</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>O que você deseja calcular?</p>
        </div>
      </div>

      <div style={{ padding: 24, paddingBottom: 100, flex: 1 }}>
        <div className="glass-panel" style={{ padding: '12px 20px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, border: '1px solid var(--border-subtle)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Search size={20} color="var(--color-primary)" />
          <input 
            type="text" 
            placeholder="Pesquise: Pintura, Piso, Concreto..." 
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {filtered.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                onClick={() => setActiveCalc(item.id)}
                className="glass-panel"
                style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 20,
                  border: '1px solid var(--border-subtle)', cursor: 'pointer', textAlign: 'left',
                  backgroundColor: 'var(--bg-glass)'
                }}
                whileHover={{ scale: 1.01, backgroundColor: 'var(--bg-surface)' }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: 100, backgroundColor: 'var(--bg-elevated)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                  {item.cat}
                </div>
              </motion.button>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Calculator size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: 16 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Nenhum cálculo encontrado para "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
