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
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
    content: [
      "Calcular a quantidade exata de tijolos ou blocos para uma parede é uma das etapas mais importantes no planejamento da sua obra. Comprar a menos significa paralisar o trabalho do pedreiro e pagar fretes extras. Comprar a mais gera desperdício de dinheiro e acúmulo de entulho no canteiro de obras.",
      "A fórmula base para o cálculo de tijolos por metro quadrado (m²) depende diretamente das dimensões do bloco escolhido e da espessura do rejunte (argamassa de assentamento). O tijolo baiano mais comum no Brasil tem dimensões de 9x19x19cm (largura x altura x comprimento).",
      "Para descobrir quantos tijolos vão em 1 metro quadrado, você primeiro calcula a área de um tijolo. Considerando o bloco de 19x19cm e um rejunte padrão de 1cm, a área ocupada por cada tijolo assentado é de 20cm x 20cm, ou seja, 0,20m x 0,20m = 0,04 m².",
      "Dividindo 1 m² pela área do tijolo (1 / 0,04), chegamos ao número mágico: são necessários 25 tijolos de 9x19x19cm para preencher 1 metro quadrado de parede.",
      "No entanto, obras no mundo real não são perfeitamente matemáticas. É preciso considerar o desperdício, as quebras durante o transporte e os recortes para a passagem de canos e caixinhas de luz. A regra de ouro na construção civil é sempre adicionar uma margem de segurança de 10% a 15% sobre a quantidade total.",
      "Se a sua parede tem 5 metros de comprimento por 3 metros de altura, a área total é de 15 m². Multiplicando 15 m² por 25 tijolos/m², temos 375 tijolos. Adicionando a margem de segurança de 10% (37,5 tijolos), você deve comprar 413 tijolos para garantir que a parede seja finalizada sem imprevistos.",
      "Essa lógica se aplica a qualquer tipo de bloco: de concreto estrutural, cerâmico, de vidro ou tijolinho maciço. Basta verificar as medidas fornecidas pelo fabricante, adicionar a espessura da junta e aplicar a mesma divisão. Ferramentas automatizadas, como a Calculadora de Alvenaria do CentralObra, já fazem todas essas compensações automaticamente para você."
    ]
  },
  {
    id: 'orcamento-obra-residencial',
    title: 'Guia Completo para Orçamento de Obra Residencial',
    excerpt: 'Tudo o que você precisa considerar na hora de precificar ou planejar financeiramente a construção de uma casa do zero.',
    date: '15/08/2026',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    content: [
      "Planejar o orçamento de uma obra residencial do zero é o maior desafio para futuros proprietários e pequenos construtores. A falta de previsibilidade financeira é o principal motivo pelo qual as obras atrasam, estouram o limite do cartão de crédito ou ficam paralisadas por meses a fio.",
      "Um orçamento profissional não é apenas uma lista de preços de cimento e areia. Ele deve abranger absolutamente todas as fases do ciclo de vida do projeto: Serviços Preliminares (topografia, tapume, ligação de água/luz), Infraestrutura (fundação, vigas baldrames, impermeabilização), Superestrutura (pilares, vigas, lajes), Alvenaria, Cobertura, Esquadrias, Instalações Elétricas e Hidrossanitárias, e, finalmente, os Acabamentos.",
      "Um dos erros mais comuns é usar o CUB (Custo Unitário Básico) como valor final da obra. O CUB é um indicador excelente divulgado pelos Sinduscons estaduais, mas ele não contempla itens cruciais como: projetos arquitetônicos, fundações profundas, áreas de lazer (piscinas, churrasqueiras), muros de divisa, portões e paisagismo. Se você usar apenas o CUB para basear seu financiamento bancário, o dinheiro com certeza vai acabar antes de aplicar os pisos.",
      "Além dos custos diretos (materiais e mão de obra), é obrigatório considerar o BDI (Benefícios e Despesas Indiretas). O BDI representa os custos de administração da obra, impostos, taxas de financiamento, lucro do construtor e uma margem para imprevistos. Em obras residenciais de pequeno e médio porte, um BDI saudável varia entre 15% e 25%.",
      "Como controlar tudo isso? A prática recomendada é utilizar planilhas orçamentárias baseadas em composições de preços unitários (como a tabela SINAPI da Caixa Econômica Federal ou a TCPO). Nessas planilhas, cada serviço é destrinchado. Por exemplo: o custo do metro quadrado de piso não é apenas a cerâmica, mas sim a soma da cerâmica + argamassa + rejunte + hora de trabalho do pedreiro + hora do servente.",
      "Para quem não é engenheiro, montar esse quebra-cabeça do zero é praticamente impossível sem o auxílio de softwares especializados. É aqui que entra a importância de sistemas de gestão como o CentralObra, que automatizam o levantamento quantitativo e aplicam os preços atualizados do mercado local diretamente no projeto."
    ]
  },
  {
    id: 'melhores-marcas-cimento',
    title: 'As Melhores Marcas e Tipos de Cimento para Estrutura',
    excerpt: 'Analisamos o CP-II, CP-III e CP-IV para você entender qual utilizar em fundações, vigas e lajes.',
    date: '10/08/2026',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1621689255874-95484cdbdf38?q=80&w=800&auto=format&fit=crop',
    content: [
      "Escolher o cimento correto para a sua obra vai muito além de olhar para o preço da saca de 50kg. O mercado brasileiro oferece diversos tipos de cimento Portland, classificados por siglas como CP I, CP II, CP III, CP IV e CP V. Cada um possui adições químicas e minerais diferentes (como escória de alto-forno, pozolana ou fíler calcário) que mudam completamente seu comportamento, resistência e tempo de secagem.",
      "O CP II (Cimento Portland Composto) é o mais versátil e encontrado nas lojas de material de construção. Ele se subdivide em CP II-E (com escória), CP II-Z (com pozolana) e CP II-F (com fíler). O CP II é excelente para uso geral: contrapisos, argamassas de reboco, assentamento de tijolos e pequenas estruturas de concreto que não exijam desforma rápida.",
      "Se você está concretando a fundação da casa (blocos de coroamento, sapatas ou vigas baldrames) em um solo com presença de umidade ou próximo a regiões litorâneas, o CP III (Cimento Portland de Alto Forno) ou o CP IV (Cimento Portland Pozolânico) são escolhas muito superiores. Eles possuem maior durabilidade contra agentes agressivos (como sulfatos do solo e maresia) e apresentam um calor de hidratação menor, o que previne fissuras térmicas no concreto.",
      "Já o CP V-ARI (Alta Resistência Inicial) é o queridinho da indústria de pré-moldados e de obras muito aceleradas. Ele não atinge uma força final maior que os outros, mas atinge a resistência necessária muito mais rápido. Enquanto um CP II precisa de 7 a 14 dias para permitir a retirada de escoras de uma laje, o CP V permite acelerar esse cronograma. O ponto negativo é que ele exige um cuidado absurdo com a cura úmida, pois seca muito rápido e tem alta retração, podendo trincar facilmente se não for molhado constantemente nas primeiras 48 horas.",
      "Em relação às marcas, o Brasil conta com excelentes produtoras que seguem rigorosamente as normas da ABNT. Marcas como Votorantim (Votoran, Itaú, Tocantins), CSN, Cauê, Tupi, e LafargeHolcim entregam produtos de altíssima confiabilidade. A diferença de preço entre elas geralmente se deve a fatores de logística regional e não necessariamente a uma diferença de qualidade na resistência do concreto.",
      "Lembre-se sempre: o cimento tem prazo de validade (geralmente de 90 dias a partir da data de ensaque). Comprar o melhor cimento do mercado não adiantará nada se as sacas ficarem armazenadas no chão úmido da obra por meses antes do uso. Armazene sobre estrados de madeira, em pilhas de no máximo 10 sacos, e em locais secos e cobertos."
    ]
  }
];

export function PublicBlogView({ theme, postId }: { theme: string, postId: string | null }) {
  
  if (postId) {
    const post = MOCK_POSTS.find(p => p.id === postId) || MOCK_POSTS[0];
    
    return (
      <div className="landing-body" data-theme={theme} style={{ minHeight: '100dvh', height: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: 'var(--bg-base)' }}>
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

        <main style={{ maxWidth: 800, margin: '0 auto', padding: '120px 20px 80px', boxSizing: 'border-box', width: '100%', flex: 1 }}>
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
            {post.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* CTA App */}
          <div style={{ 
            marginTop: 64, padding: 40, borderRadius: 32, 
            background: 'linear-gradient(135deg, var(--color-primary), #8B5CF6)',
            textAlign: 'center', color: '#fff'
          }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
              Automatize seus Cálculos
            </h3>
            <p style={{ fontSize: 18, marginBottom: 32, opacity: 0.9 }}>
              Pare de fazer contas no papel. Use as ferramentas do CentralObra gratuitamente.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              style={{ background: '#fff', color: 'var(--color-primary)', padding: '16px 32px', borderRadius: 100, fontSize: 18, fontWeight: 800, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            >
              Criar Conta Grátis
            </button>
          </div>
        </main>
        
        <InstitutionalFooter theme={theme as 'light'|'dark'} onLogin={() => window.location.href = '/'} onNavigate={() => {}} />
      </div>
    );
  }

  return (
    <div className="landing-body" data-theme={theme} style={{ minHeight: '100dvh', height: '100dvh', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: 'var(--bg-base)' }}>
      <Helmet>
        <title>Blog de Engenharia e Gestão de Obras | CentralObra</title>
        <meta name="description" content="Artigos, dicas e calculadoras para facilitar o seu dia a dia no canteiro de obras." />
      </Helmet>

      <LandingNavbar 
        theme={theme as 'light' | 'dark'} 
        onLogin={() => window.location.href = '/'} 
        onRegister={() => window.location.href = '/'} 
        scrolled={true} 
      />

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '120px 20px 80px', boxSizing: 'border-box', width: '100%', flex: 1 }}>
        <header style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'var(--color-primary-alpha)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <BookOpen size={24} />
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Blog CentralObra
            </h1>
          </div>
          <p style={{ fontSize: 18, color: 'var(--text-muted)' }}>
            Conteúdo técnico, dicas de gestão e guias completos para sua obra.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
          {MOCK_POSTS.map(post => (
            <a 
              key={post.id} 
              href={`/?blog=${post.id}`}
              style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-surface)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border-subtle)', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              <img src={post.image} alt={post.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, lineHeight: 1.4 }}>
                  {post.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24, flex: 1 }}>
                  {post.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontSize: 14, fontWeight: 700 }}>
                  Ler artigo completo <ArrowRight size={16} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <InstitutionalFooter theme={theme as 'light'|'dark'} onLogin={() => window.location.href = '/'} onNavigate={() => {}} />
    </div>
  );
}
