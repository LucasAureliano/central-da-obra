import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BookOpen, ArrowRight, Home, ChevronLeft } from 'lucide-react';

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
      <div className="app-container" data-theme={theme} style={{ minHeight: '100vh', paddingBottom: 80, backgroundColor: 'var(--bg-main)' }}>
        <Helmet>
          <title>{post.title} | Blog CentralObra</title>
          <meta name="description" content={post.excerpt} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:image" content={post.image} />
        </Helmet>

        <header style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
            <ChevronLeft size={20} /> Voltar
          </button>
        </header>

        <main style={{ padding: '0 20px' }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: 240, objectFit: 'cover', borderRadius: 24, marginBottom: 24 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
            <span>{post.date}</span>
            <span>•</span>
            <span>Leitura: {post.readTime}</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.3 }}>
            {post.title}
          </h1>

          <div style={{ color: 'var(--text-main)', fontSize: 16, lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-muted)' }}>
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
            marginTop: 40, padding: 24, borderRadius: 24, 
            background: 'linear-gradient(135deg, var(--color-primary), #8B5CF6)',
            textAlign: 'center', color: '#fff'
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
              Calcule tudo isso automaticamente
            </h3>
            <p style={{ fontSize: 15, marginBottom: 24, opacity: 0.9, lineHeight: 1.5 }}>
              Use nosso App gratuito para calcular materiais, orçamentos e gerenciar seus cronogramas com inteligência artificial.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ width: '100%', padding: 16, borderRadius: 16, fontSize: 16, fontWeight: 800, background: '#fff', color: 'var(--color-primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
            >
              Criar Conta no App <ArrowRight size={20} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Blog Listing
  return (
    <div className="app-container" data-theme={theme} style={{ minHeight: '100vh', paddingBottom: 80, backgroundColor: 'var(--bg-main)' }}>
      <Helmet>
        <title>Blog de Engenharia e Gestão de Obras | CentralObra</title>
        <meta name="description" content="Artigos, dicas e guias completos sobre construção civil, gestão de obras, orçamentos e materiais." />
      </Helmet>

      <header style={{ 
        padding: '32px 20px', 
        background: 'linear-gradient(145deg, var(--bg-panel) 0%, var(--bg-elevated) 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="var(--color-primary)" />
          </div>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 12px' }}>
          Portal do Construtor
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
          Dicas técnicas, guias de materiais e inovação para sua obra.
        </p>
      </header>

      <main style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {MOCK_POSTS.map(post => (
          <div key={post.id} onClick={() => window.location.href = `/?blog=${post.id}`} className="glass-panel" style={{ borderRadius: 24, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}>
            <img src={post.image} alt={post.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            <div style={{ padding: 20 }}>
              <div style={{ color: 'var(--color-primary)', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                {post.date}
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.4 }}>
                {post.title}
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.excerpt}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
