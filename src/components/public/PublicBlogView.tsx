import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, ArrowRight, Home, ChevronLeft } from 'lucide-react';
import { LandingNavbar } from '../landing/LandingNavbar';
import { InstitutionalFooter } from '../landing/InstitutionalFooter';

const MOCK_POSTS = [
  {
    id: 'como-calcular-tijolos',
    title: 'Como calcular tijolos por metro quadrado (m²)?',
    excerpt: 'Aprenda a fórmula exata para não errar na compra de blocos e tijolos baianos. Evite sobras e falta de material no meio da obra.',
    date: '19/08/2026',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'orcamento-obra-residencial',
    title: 'Guia Completo para Orçamento de Obra Residencial',
    excerpt: 'Tudo o que você precisa considerar na hora de precificar ou planejar financeiramente a construção de uma casa do zero.',
    date: '15/08/2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'melhores-marcas-cimento',
    title: 'As Melhores Marcas de Cimento para Estrutura',
    excerpt: 'Analisamos o CP-II, CP-III e CP-IV para você entender qual utilizar em fundações, vigas e lajes.',
    date: '10/08/2026',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1621689255874-95484cdbdf38?q=80&w=800&auto=format&fit=crop'
  }
];

export function PublicBlogView({ theme, postId }: { theme: string, postId: string | null }) {
  
  if (postId) {
    const post = MOCK_POSTS.find(p => p.id === postId) || MOCK_POSTS[0];
    
    return (
      <div className="landing-body" data-theme={theme} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: 'var(--bg-base)' }}>
        <Helmet>
          <title>{post.title} | Blog CentralObra</title>
          <meta name="description" content={post.excerpt} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:image" content={post.image} />
        </Helmet>

        <LandingNavbar 
          theme={theme as 'light' | 'dark'} 
          onLogin={() => window.location.href = '/'} 
          onRegister={() => window.location.href = '/'} 
          scrolled={true} 
        />

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '120px 20px 80px', boxSizing: 'border-box', width: '100%' }}>
          <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600, marginBottom: 24, padding: 0 }}>
            <ChevronLeft size={20} /> Voltar para o Blog
          </button>

          <img src={post.image} alt={post.title} style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 24, marginBottom: 32 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, color: 'var(--text-muted)', fontSize: 14, fontWeight: 600 }}>
            <span>{post.date}</span>
            <span>•</span>
            <span>Tempo de Leitura: {post.readTime}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 32, lineHeight: 1.2 }}>
            {post.title}
          </h1>

          <div style={{ color: 'var(--text-main)', fontSize: 18, lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <p style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-muted)' }}>
              {post.excerpt}
            </p>
            <p>
              O planejamento de compras na construção civil é uma das etapas mais críticas. Muitas vezes o proprietário gasta até 30% a mais do que deveria apenas pela falta de estimativa correta.
            </p>
            <p>
              Com o CentralObra, você tem na palma da mão um verdadeiro sistema ERP que te ajuda a evitar desperdícios e fazer a gestão inteligente de todos os recursos da sua obra, desde a fundação até o acabamento.
            </p>
          </div>

          {/* CTA App */}
          <div style={{ 
            marginTop: 64, padding: 40, borderRadius: 32, 
            background: 'linear-gradient(135deg, var(--color-primary), #8B5CF6)',
            textAlign: 'center', color: '#fff'
          }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
              Calcule tudo isso automaticamente
            </h3>
            <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.9, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 32px' }}>
              Use nosso App gratuito para calcular materiais, orçamentos e gerenciar seus cronogramas com inteligência artificial.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ padding: '16px 32px', borderRadius: 999, fontSize: 18, fontWeight: 800, background: '#fff', color: 'var(--color-primary)', border: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', transition: 'transform 0.2s' }}
            >
              Criar Conta Grátis <ArrowRight size={20} />
            </button>
          </div>
        </main>
        
        <InstitutionalFooter 
          theme={theme as 'light' | 'dark'} 
          onLogin={() => window.location.href = '/'}
          onNavigate={() => {}}
        />
      </div>
    );
  }

  // Blog Listing
  return (
    <div className="landing-body" data-theme={theme} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: 'var(--bg-base)' }}>
      <Helmet>
        <title>Blog de Engenharia e Gestão de Obras | CentralObra</title>
        <meta name="description" content="Artigos, dicas e guias completos sobre construção civil, gestão de obras, orçamentos e materiais." />
      </Helmet>

      <LandingNavbar 
        theme={theme as 'light' | 'dark'} 
        onLogin={() => window.location.href = '/'} 
        onRegister={() => window.location.href = '/'} 
        scrolled={true} 
      />

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '120px 20px 80px', boxSizing: 'border-box', width: '100%' }}>
        <header style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={24} color="var(--color-primary)" />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>CentralObra <span style={{ color: 'var(--color-primary)' }}>Blog</span></h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600, margin: 0 }}>
            Dicas práticas, guias de planejamento e tutoriais para arquitetos, engenheiros e proprietários gerenciarem obras com inteligência.
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {MOCK_POSTS.map(post => (
            <a 
              key={post.id} 
              href={`/?blog=${post.id}`}
              className="card-premium-interactive"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 24, textDecoration: 'none', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', transition: 'all 0.2s' }}
            >
              <img src={post.image} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12, lineHeight: 1.3 }}>{post.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </main>

      <InstitutionalFooter 
        theme={theme as 'light' | 'dark'} 
        onLogin={() => window.location.href = '/'}
        onNavigate={() => {}}
      />
    </div>
  );
}
