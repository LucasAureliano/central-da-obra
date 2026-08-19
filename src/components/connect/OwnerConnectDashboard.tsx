import React from 'react';
import { MapPin, Hammer, Bell, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function OwnerConnectDashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const mockPros = [
    { name: 'João Silva', role: 'Pedreiro', rating: 4.9, reviews: 124, location: 'São Paulo, SP', verified: true, avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Ana Costa', role: 'Arquiteta', rating: 5.0, reviews: 89, location: 'Curitiba, PR', verified: true, avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Carlos Mendes', role: 'Engenheiro Civil', rating: 4.8, reviews: 210, location: 'Rio de Janeiro, RJ', verified: true, avatar: 'https://i.pravatar.cc/150?u=3' },
  ];

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, letterSpacing: '-0.02em' }}>
          CentralObra <span style={{ color: '#3B82F6' }}>Connect</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.5 }}>
          A maior e mais segura rede de profissionais de construção do Brasil. Encontre quem você precisa em segundos.
        </p>
      </div>

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Animated Background Gradients */}
        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 50, right: -50, width: 250, height: 250, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        {/* Feature Cards Showcase (Blurred/Disabled style) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {mockPros.map((pro, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{ padding: 20, borderRadius: 24, backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 16, filter: 'grayscale(0.5)' }}
            >
              <img src={pro.avatar} alt={pro.name} style={{ width: 64, height: 64, borderRadius: 32, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{pro.name}</h3>
                  {pro.verified && <ShieldCheck size={14} color="#3B82F6" />}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>{pro.role}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B' }}>
                    <Star size={12} fill="currentColor" /> {pro.rating} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>({pro.reviews})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {pro.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating "Coming Soon" Banner Overlay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: '90%', 
            maxWidth: 400,
            padding: 32, 
            borderRadius: 32, 
            backgroundColor: 'rgba(20, 20, 20, 0.85)', 
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            textAlign: 'center',
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            zIndex: 10
          }}
        >
          <div style={{ width: 80, height: 80, borderRadius: 40, background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 10px 25px -5px rgba(59,130,246,0.5)' }}>
            <Hammer size={36} color="#FFF" />
          </div>
          
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#FFF', marginBottom: 12, letterSpacing: '-0.02em' }}>Em Breve!</h2>
          
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 32, fontWeight: 500 }}>
            Estamos finalizando a rede mais completa do mercado. Em breve você poderá buscar, avaliar e contratar os melhores profissionais verificados na sua região com 1 clique.
          </p>

          <button className="btn-primary" style={{ width: '100%', padding: '18px 24px', borderRadius: 20, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 20px rgba(59,130,246,0.3)' }}>
            <Bell size={20} />
            Me Avise no Lançamento
          </button>
        </motion.div>
      </div>
    </div>
  );
}