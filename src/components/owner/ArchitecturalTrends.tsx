import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, Share2, ArrowLeft, Sparkles, Eye, Copy, Check, 
  Flame, DollarSign, Award, Layers, Calculator, ExternalLink, Compass,
  TrendingUp, Palette, ChevronRight, Bookmark
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export interface TrendItem {
  id: string;
  title: string;
  category: string;
  badge: 'tiktok' | 'custo_beneficio' | 'lancamento' | 'casacor';
  imageUrl: string;
  description: string;
  tags: string[];
  palette: string[];
  brands: { name: string; product: string; url?: string }[];
  valueEngineering?: {
    luxuryOption: { name: string; price: number };
    smartOption: { name: string; price: number };
    savingsPercent: number;
    tip: string;
  };
  technicalSpec: {
    materialsNeeded: string[];
    lightingKelvin?: string;
    installationTip: string;
    calculatorTab?: string;
  };
}

const BADGE_CONFIG = {
  tiktok: { label: 'Viral no TikTok', icon: Flame, color: '#FF0050', bg: 'rgba(255, 0, 80, 0.12)' },
  custo_beneficio: { label: 'Alto Custo-Benefício', icon: DollarSign, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  lancamento: { label: 'Lançamento 2026', icon: Sparkles, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)' },
  casacor: { label: 'Tendência CASACOR', icon: Award, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' }
};

const TREND_CATEGORIES = [
  'Todos',
  'Salas & Living',
  'Cozinhas & Gourmet',
  'Banheiros & Lavabos',
  'Quartos & Suítes',
  'Fachadas & Áreas Externas',
  'Iluminação & Forros',
  'Revestimentos & Pisos'
];

export const ARCHITECTURAL_TRENDS_DB: TrendItem[] = [
  {
    id: 't-1',
    title: 'Box do Banheiro até o Teto (Floor-to-Ceiling Glass)',
    category: 'Banheiros & Lavabos',
    badge: 'tiktok',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
    description: 'A maior febre de banheiros no TikTok: o vidro temperado de 8mm vai do chão até o forro de gesso com perfil U embutido. Cria um efeito de spa de hotel 5 estrelas retendo o calor do vapor.',
    tags: ['#BoxAteOTeto', '#BanheiroSpa', '#PerfilInvisivel', '#DesignSensorial', '#TikTokMadeMeBuyIt'],
    palette: ['#1A1D20', '#8E979D', '#E5E9EC', '#C5A880'],
    brands: [
      { name: 'Blindex', product: 'Vidro Temperado Extra Clear 8mm' },
      { name: 'Perfilco', product: 'Perfil U Alumínio Embutido Preto Fosco' },
      { name: 'Tigre', product: 'Ralo Linear Oculto 70cm' }
    ],
    valueEngineering: {
      luxuryOption: { name: 'Box italiano com roldanas douradas aparentes', price: 4800 },
      smartOption: { name: 'Vidro fixo até o teto com perfil U invisível', price: 1450 },
      savingsPercent: 70,
      tip: 'Usar vidro fixo até o teto com porta de correr simples economiza ferragens caras e entrega um visual muito mais limpo e minimalista.'
    },
    technicalSpec: {
      materialsNeeded: ['Vidro temperado 8mm até o gesso', 'Perfil U alumínio embutido', 'Silicone acético neutro', 'Ralo linear oculto'],
      lightingKelvin: '2700K (Luz quente acolhedora no nicho)',
      installationTip: 'Preveja um duto de exaustão ou grelha de ventilação no forro de gesso para desumidificação pós-banho.',
      calculatorTab: 'wall'
    }
  },
  {
    id: 't-2',
    title: 'Paredes "Greige" & Pintura Monocromática com Eletrofitas',
    category: 'Salas & Living',
    badge: 'tiktok',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    description: 'O cinza frio deu lugar total ao "Greige" (bege acinzentado) que envolve paredes e tetos numa caixa monocromática acolhedora. Uso de eletrofitas adesivas para criar pontos de arandela sem quebrar alvenaria.',
    tags: ['#GreigeTrend', '#Eletrofita', '#PinturaMonocromatica', '#SemQuebraQuebra', '#WarmMinimalism'],
    palette: ['#D8CFBC', '#C4B9A5', '#6B5E51', '#2D2926'],
    brands: [
      { name: 'Suvinil', product: 'Tinta Acrílica Fosca "Algodão Egípcio" e "Dia de Chuva"' },
      { name: 'Coral', product: 'Linha Toque de Seda "Lugar de Afeto"' },
      { name: 'Eletrofitas Brasil', product: 'Fita Condutora Adesiva Bipolar 2,5mm' }
    ],
    valueEngineering: {
      luxuryOption: { name: 'Quebra de parede + conduíte + reboco + pintura completa', price: 2200 },
      smartOption: { name: 'Eletrofita adesiva invisível sob massa corrida', price: 380 },
      savingsPercent: 82,
      tip: 'A eletrofita permite reposicionar arandelas e interruptores sem ruído nem entulho. Aplique uma demão de massa corrida por cima e pinte normalmente.'
    },
    technicalSpec: {
      materialsNeeded: ['Tinta Acrílica Fosca Premium 18L', 'Massa corrida PVA', 'Eletrofita adesiva 2 pistas', 'Fita isolante líquida'],
      lightingKelvin: '2700K (Ideal para criar contraste com o tom Greige)',
      installationTip: 'Pinte o teto no mesmo tom da parede rebaixando levemente a luminosidade para sensação de cápsula aconchegante.',
      calculatorTab: 'wall'
    }
  },
  {
    id: 't-3',
    title: 'Minimalismo sem Painel de TV (No-TV-Panel Wall)',
    category: 'Salas & Living',
    badge: 'custo_beneficio',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    description: 'Tendência máxima de eliminação de excessos: fim dos painéis pesados de MDF de R$ 5.000. A TV fica rente à parede com fiação oculta por duto interno de 50mm e acabamento em textura suave tipo cimento queimado ou linho.',
    tags: ['#SemPainelTV', '#CleanLiving', '#CustoBeneficio', '#CimentoQueimado', '#ArquiteturaReal'],
    palette: ['#E8E6E1', '#9C978F', '#4A4744', '#1F1E1D'],
    brands: [
      { name: 'Suvinil', product: 'Textura Cimento Queimado Fosco' },
      { name: 'Tigre', product: 'Tubo de Passagem de Cabos PVC 50mm' },
      { name: 'ELG', product: 'Suporte Fixo Ultra Slim 14mm' }
    ],
    valueEngineering: {
      luxuryOption: { name: 'Painel planejado em marcenaria sob medida 3x2,60m', price: 4800 },
      smartOption: { name: 'Duto embutido + Pintura Textura Cimento Queimado', price: 620 },
      savingsPercent: 87,
      tip: 'Uma parede texturizada limpa com duto embutido amplia visualmente o ambiente e nunca sai de moda, economizando quase 90% em marcenaria.'
    },
    technicalSpec: {
      materialsNeeded: ['Galão de Cimento Queimado 5kg', 'Tubo PVC 50mm', 'Caixas 4x2 para tomada e HDMI', 'Suporte ultra-slim'],
      lightingKelvin: '3000K (Luz neutra suave no rodapé ou teto)',
      installationTip: 'Instale o duto de 50mm a 1,20m de altura com curva suave de 45° para passar cabos grossos sem travar.',
      calculatorTab: 'wall'
    }
  },
  {
    id: 't-4',
    title: 'Ripados Ecológicos de Poliestireno Reciclado (Santa Luzia)',
    category: 'Revestimentos & Pisos',
    badge: 'lancamento',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    description: 'Lançamento revolucionário em acabamentos: ripas modulares de poliestireno reciclado (EPS). Imunes a cupins, mofo e umidade, perfeitas para áreas úmidas, lavabos e cabeceiras de cama com colagem instantânea.',
    tags: ['#SantaLuzia', '#RipadoEcologico', '#Lançamento2026', '#Sustentabilidade', '#AntiCupim'],
    palette: ['#825737', '#C7A27C', '#3C2817', '#F2EDE4'],
    brands: [
      { name: 'Santa Luzia', product: 'Coleção Multilinha Freijó Natural 10x15mm' },
      { name: 'Santa Luzia', product: 'Superadesivo e Fita Dupla Face Fixa Forte' }
    ],
    valueEngineering: {
      luxuryOption: { name: 'Ripado de marcenaria em madeira natural Cumaru', price: 4200 },
      smartOption: { name: 'Ripado de Poliestireno Santa Luzia colado', price: 980 },
      savingsPercent: 76,
      tip: 'O poliestireno não empena com umidade de ar-condicionado nem descasca, além de ter aplicação rápida sem pó de marcenaria.'
    },
    technicalSpec: {
      materialsNeeded: ['Barras ripadas Santa Luzia 2,80m', 'Superadesivo Santa Luzia', 'Fita dupla face 3M', 'Serra meia-esquadria'],
      lightingKelvin: '2700K (Iluminação rasante valoriza o relevo das ripas)',
      installationTip: 'Inicie a instalação pelo centro da parede para que os recortes fiquem simétricos nas duas extremidades.',
      calculatorTab: 'wall'
    }
  },
  {
    id: 't-5',
    title: 'Bancada e Nicho Esculpido em Porcelanato Grandes Formatos',
    category: 'Cozinhas & Gourmet',
    badge: 'casacor',
    imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    description: 'Destaque absoluto na CASACOR: bancadas contínuas esculpidas em lastras e grandes formatos 120x240cm com cuba embutida e rampa oculta. Não mancha com café, limão ou vinho.',
    tags: ['#PorcelanatoGiga', '#CubaEsculpida', '#CASACOR2026', '#PortobelloLastras', '#Monolitico'],
    palette: ['#FFFFFF', '#E3DED8', '#BFA37C', '#303030'],
    brands: [
      { name: 'Portobello', product: 'Lastras Unique 120x270cm Calacatta Blanc Touch' },
      { name: 'Biancogres', product: 'Porcelanato Calacatta Oro 120x120cm Acetinado' },
      { name: 'Quartzolit', product: 'Argamassa Grandes Formatos e Rejunte Epóxi' }
    ],
    valueEngineering: {
      luxuryOption: { name: 'Mármore Calacatta Importado da Itália', price: 6500 },
      smartOption: { name: 'Bancada em Porcelanato 120x270cm esculpido', price: 2100 },
      savingsPercent: 68,
      tip: 'O porcelanato tem absorção de água próxima a zero (< 0,1%), enquanto o mármore mancha facilmente em contato com gorduras e ácidos.'
    },
    technicalSpec: {
      materialsNeeded: ['Lastra de Porcelanato 120x270cm', 'Estrutura metálica tubular de apoio', 'Massa plástica / Cola PU', 'Válvula de escoamento oculto'],
      installationTip: 'Exija mão de obra especializada em cortes 45° e reforço com tela de fibra de vidro na face inferior.',
      calculatorTab: 'flooring'
    }
  },
  {
    id: 't-6',
    title: 'Trilhos Eletrificados & Fita LED COB Linear 2700K',
    category: 'Iluminação & Forros',
    badge: 'tiktok',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description: 'O hack favorito dos criadores de interiores: trilhos eletrificados de sobrepor pretos ou brancos com spots orientáveis combinados com fita LED COB (efeito neon sem pontinhos aparentes) em temperatura acolhedora de 2700K.',
    tags: ['#TrilhoEletrificado', '#LEDCOB', '#IluminacaoCenica', '#LuzQuente2700K', '#DesignContemporaneo'],
    palette: ['#0A0A0A', '#FFE5B4', '#E6C280', '#404040'],
    brands: [
      { name: 'Stella Iluminação', product: 'Trilho Magnético / Eletrificado 2m Preto' },
      { name: 'Nordecor', product: 'Spot Orientável GU10 / LED Integrado' },
      { name: 'Gaya', product: 'Fita LED COB 2700K 12W/m Bivolt' }
    ],
    valueEngineering: {
      luxuryOption: { name: 'Rasgo de gesso rebaixado + pintura de teto + eletricista', price: 2800 },
      smartOption: { name: 'Trilho eletrificado sobreposto com spots e LED COB', price: 490 },
      savingsPercent: 82,
      tip: 'O trilho permite adicionar, remover e mover spots livremente conforme você muda a disposição dos móveis, sem obras futuras.'
    },
    technicalSpec: {
      materialsNeeded: ['Trilho eletrificado 2m ou 3m', '3 a 5 spots direcionáveis 7W', 'Fita LED COB 2700K', 'Driver / Fonte 12V slim'],
      lightingKelvin: '2700K a 3000K (Imprescindível para sensação de conforto)',
      installationTip: 'Evite luz branca de 6000K em áreas de convivência; a luz de 2700K valoriza madeiras e tecidos.',
      calculatorTab: 'lighting'
    }
  },
  {
    id: 't-7',
    title: 'Revestimento Apenas na Área Molhada (Smart Backsplash)',
    category: 'Cozinhas & Gourmet',
    badge: 'custo_beneficio',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    description: 'Economia inteligente e elegância: em vez de revestir a cozinha inteira de piso ao teto como antigamente, aplica-se azulejo metrô (Subway Tile) ou cerâmica artesanal apenas na faixa de 60cm da pia. O resto recebe tinta lavável antimofo.',
    tags: ['#BacksplashInteligente', '#SubwayTile', '#CozinhaClean', '#EconomiaDeObra', '#MinimalismoFuncional'],
    palette: ['#F4F5F7', '#4B5563', '#111827', '#D1D5DB'],
    brands: [
      { name: 'Eliane', product: 'Revestimento Metrô White 10x20cm Biselado' },
      { name: 'Portobello', product: 'Linha Liverpool 7x24cm' },
      { name: 'Coral', product: 'Tinta Esmalte Base Água Antimofo' }
    ],
    valueEngineering: {
      luxuryOption: { name: 'Azulejar as quatro paredes da cozinha até o teto', price: 3500 },
      smartOption: { name: 'Backsplash de 60cm com Subway Tile + Tinta Epóxi', price: 780 },
      savingsPercent: 77,
      tip: 'Reduz em até 75% o custo de revestimento e argamassa na cozinha, além de agilizar a entrega da obra em 3 dias.'
    },
    technicalSpec: {
      materialsNeeded: ['Azulejo Metrô 10x20cm (aprox. 3m²)', 'Argamassa AC-II 20kg', 'Rejunte Cinza Platina', 'Tinta lavável antimofo'],
      installationTip: 'Utilize espaçador de 1,5mm e rejunte cinza ou bege para evitar manchas de gordura típicas do rejunte branco.',
      calculatorTab: 'flooring'
    }
  },
  {
    id: 't-8',
    title: 'Metais D.Coat Champagne & Preto Matte Escovado',
    category: 'Banheiros & Lavabos',
    badge: 'lancamento',
    imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80',
    description: 'Lançamentos de ponta das principais marcas nacionais: metais com acabamento PVD / D.Coat a vácuo nas cores Champagne Escovado e Black Matte. Textura sedosa anti-impressão digital e alta resistência à oxidação.',
    tags: ['#DecaDCoat', '#DocolChroma', '#MetaisEscovados', '#ChampagneMatte', '#Lançamento2026'],
    palette: ['#D9C3A5', '#262626', '#594A3C', '#FAFAFA'],
    brands: [
      { name: 'Deca', product: 'Monocomando You Champagne Escovado D.Coat' },
      { name: 'Docol', product: 'Misturador de Mesa DocolChroma Grafite Escovado' }
    ],
    technicalSpec: {
      materialsNeeded: ['Misturador Monocomando', 'Válvula click correspondente', 'Engates flexíveis inox', 'Fita teflon veda rosca'],
      installationTip: 'Nunca utilize esponjas de aço ou produtos químicos abrasivos na limpeza; apenas pano úmido e sabão neutro.',
      calculatorTab: 'plumbing'
    }
  },
  {
    id: 't-9',
    title: 'Fachada em Concreto Ripado com Iluminação Rasante',
    category: 'Fachadas & Áreas Externas',
    badge: 'casacor',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Imponência contemporânea: placas cimentícias que reproduzem tábuas de concreto aparente ripado, valorizadas por arandelas e balizadores embutidos de piso com facho estreito de 3000K.',
    tags: ['#FachadaRipado', '#Castelatto', '#ConcretoAparente', '#IluminacaoRasante', '#ArquiteturaModerna'],
    palette: ['#5A5A58', '#8A8A85', '#C2A379', '#181818'],
    brands: [
      { name: 'Castelatto', product: 'Revestimento Cimentício Madeyra Lignum 100x20cm' },
      { name: 'Stella Iluminação', product: 'Balizador de Solo Embutido LED IP67 3W 3000K' }
    ],
    technicalSpec: {
      materialsNeeded: ['Placas cimentícias ripadas', 'Argamassa AC-III Especial', 'Hidrofugante base solvente', 'Spots embutidos de solo IP67'],
      lightingKelvin: '3000K (Realça as ranhuras do cimentício)',
      installationTip: 'Aplique 2 demãos de hidrofugante para proteger contra eflorescência e manchas de chuva ácida.',
      calculatorTab: 'masonry'
    }
  },
  {
    id: 't-10',
    title: 'Piscina com Pedra Hijau Verde Vulcânica e Borda Infinita',
    category: 'Fachadas & Áreas Externas',
    badge: 'casacor',
    imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
    description: 'Pedra natural vulcânica originária da Indonésia que confere à água tonalidades deslumbrantes de verde-esmeralda caribenho. Naturalmente atérmica, antiderrapante e com minerais purificadores.',
    tags: ['#PedraHijau', '#PiscinaNatural', '#BordaInfinita', '#Palimanan', '#LuxoSustentavel'],
    palette: ['#1E4D40', '#3A7563', '#A8C2B3', '#4E5340'],
    brands: [
      { name: 'Palimanan', product: 'Pedra Hijau Lisa 10x10cm e 20x20cm' },
      { name: 'Quartzolit', product: 'Argamassa e Rejunte Piscinas & Saunas' }
    ],
    technicalSpec: {
      materialsNeeded: ['Pedra Hijau selecionada', 'Argamassa colante especial para piscinas', 'Rejunte epóxi impermeável', 'Impermeabilizante bi-componente'],
      installationTip: 'Impermeabilize a piscina com manta asfáltica ou membrana polimérica flexível antes do assentamento.',
      calculatorTab: 'flooring'
    }
  },
  {
    id: 't-11',
    title: 'Rodapé Invertido de Alumínio com Parede Flutuante',
    category: 'Revestimentos & Pisos',
    badge: 'tiktok',
    imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80',
    description: 'O detalhe que os arquitetos mais postam no TikTok: a parede recua 2 cm na base através de um perfil metálico embutido no reboco. Elimina o rodapé convencional saliente e dá a impressão de que a parede está flutuando.',
    tags: ['#RodapeInvertido', '#ParedeFlutuante', '#DetalheArquitetonico', '#SantaLuziaInvertido', '#TikTokTrend'],
    palette: ['#E2E8F0', '#94A3B8', '#334155', '#0F172A'],
    brands: [
      { name: 'Santa Luzia', product: 'Perfil de Alumínio para Rodapé Invertido' },
      { name: 'Perfilflot', product: 'Perfil Cantoneira de Alumínio Anodizado 25x25mm' }
    ],
    valueEngineering: {
      luxuryOption: { name: 'Corte artesanal e rebaixo manual em alvenaria com fresa', price: 1800 },
      smartOption: { name: 'Perfil metálico de sobrepor pré-fabricado Santa Luzia', price: 420 },
      savingsPercent: 76,
      tip: 'Usar o perfil pré-fabricado acelera a execução do reboco e garante alinhamento milimétrico com menos retrabalho.'
    },
    technicalSpec: {
      materialsNeeded: ['Barras de perfil de alumínio 2,5m', 'Parafusos ponta broca e buchas 5mm', 'Fita crepe de proteção', 'Fita LED ultrafina (opcional)'],
      installationTip: 'Fixe o perfil antes de puxar a última camada de reboco ou massa para nivelamento perfeito.',
      calculatorTab: 'wall'
    }
  },
  {
    id: 't-12',
    title: 'Design Biofílico Maduro com Jardim Vertical Automatizado',
    category: 'Fachadas & Áreas Externas',
    badge: 'casacor',
    imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    description: 'Integração estrutural da natureza na arquitetura residencial: módulos cerâmicos verticais irrigados por gotejamento programável com espécies tropicais (samambaias, véu-de-noiva e ripsális) que filtram o ar e absorvem ruídos.',
    tags: ['#DesignBiofilico', '#JardimVertical', '#QualidadeDoAr', '#BemEstar', '#CasaSaudavel'],
    palette: ['#284B30', '#5B8C5A', '#94B49F', '#3B2F2F'],
    brands: [
      { name: 'GreenWall Ceramic', product: 'Módulos Cerâmicos de Parede 29x19cm' },
      { name: 'Hunter', product: 'Controlador de Irrigação Bluetooth BTT' }
    ],
    technicalSpec: {
      materialsNeeded: ['Módulos cerâmicos ou feltro estruturado', 'Tubos de microgotejamento 1/4"', 'Temporizador eletrônico', 'Calha de recolhimento de drenagem'],
      installationTip: 'Garanta ponto de água pressurizado e dreno de 40mm na base antes de iniciar a fixação dos módulos.',
      calculatorTab: 'masonry'
    }
  }
];

export function ArchitecturalTrends({ onBack }: { onBack?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedBadge, setSelectedBadge] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('co_architect_trends_favs');
      return saved ? JSON.parse(saved) : ['t-1', 't-3'];
    } catch (e) {
      return ['t-1', 't-3'];
    }
  });
  const [activeItem, setActiveItem] = useState<TrendItem | null>(null);
  const [modalTab, setModalTab] = useState<'visao_geral' | 'custo_beneficio' | 'especificacao'>('visao_geral');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id];
      localStorage.setItem('co_architect_trends_favs', JSON.stringify(next));
      if (prev.includes(id)) {
        toast.success('Removido dos favoritos do Studio');
      } else {
        toast.success('Salvo nos seus favoritos do Studio!');
      }
      return next;
    });
  };

  const handleShare = (item: TrendItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(`Confira esta tendência no CentralObra Studio: ${item.title}`);
    toast.success('Link de inspiração copiado!');
  };

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    toast.success(`Código ${hex} copiado!`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const copyTechnicalSpec = (item: TrendItem) => {
    const text = `ESPECIFICAÇÃO TÉCNICA - CENTRALOBRA
Projeto / Ambiente: ${item.title}
Categoria: ${item.category}

MARCAS & PRODUTOS:
${item.brands.map(b => `- ${b.name}: ${b.product}`).join('\n')}

INSUMOS RECOMENDADOS:
${item.technicalSpec.materialsNeeded.map(m => `- ${m}`).join('\n')}
${item.technicalSpec.lightingKelvin ? `Temperatura de Cor: ${item.technicalSpec.lightingKelvin}` : ''}

DICA EXECUTIVA:
${item.technicalSpec.installationTip}
`;
    navigator.clipboard.writeText(text);
    toast.success('Memorial técnico copiado para a área de transferência!');
  };

  const filteredTrends = ARCHITECTURAL_TRENDS_DB.filter(item => {
    const matchesCat = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesBadge = selectedBadge === 'todos' || item.badge === selectedBadge;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          item.brands.some(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesBadge && matchesSearch;
  });

  return (
    <div className="screen-content animate-fade-in" style={{ padding: '24px 20px 100px 20px', maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Header Principal */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} className="btn-secondary" style={{ width: 42, height: 42, borderRadius: 21, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
                Tendências & Lançamentos 2026
              </h1>
              <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 12, backgroundColor: 'rgba(217, 70, 239, 0.15)', color: '#D946EF', fontWeight: 800 }}>
                STUDIO PRO
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, marginTop: 4 }}>
              Pesquisa minuciosa de tendências virais do TikTok, lançamentos de marcas e engenharia de valor com alto custo-benefício.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '8px 14px', borderRadius: 20, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <Bookmark size={15} color="#10B981" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>{favorites.length} Salvos</span>
          </div>
        </div>
      </div>

      {/* Barra de Busca Inteligente */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: 16, top: 15 }} />
        <input 
          type="text"
          placeholder="Busque por revestimento, Portobello, Santa Luzia, box até o teto, iluminação 2700K..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ width: '100%', height: 48, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, paddingLeft: 46, paddingRight: 16, fontSize: 14, color: 'var(--text-main)', outline: 'none' }}
        />
      </div>

      {/* FILTROS POR SELO (TikTok, Custo-Benefício, Lançamento 2026, CASACOR) */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }} className="hide-scrollbar">
        <button
          onClick={() => setSelectedBadge('todos')}
          style={{
            padding: '8px 14px', borderRadius: 16, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
            backgroundColor: selectedBadge === 'todos' ? 'var(--color-primary)' : 'var(--bg-elevated)',
            color: selectedBadge === 'todos' ? '#FFF' : 'var(--text-muted)',
            border: selectedBadge === 'todos' ? 'none' : '1px solid var(--border-subtle)',
            cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6
          }}
        >
          <Compass size={14} /> Todos os Destaques
        </button>

        {Object.entries(BADGE_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const isSelected = selectedBadge === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedBadge(isSelected ? 'todos' : key)}
              style={{
                padding: '8px 14px', borderRadius: 16, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                backgroundColor: isSelected ? cfg.color : cfg.bg,
                color: isSelected ? '#FFF' : cfg.color,
                border: `1px solid ${isSelected ? cfg.color : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Icon size={14} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Categorias de Ambientes */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 24 }} className="hide-scrollbar">
        {TREND_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              backgroundColor: selectedCategory === cat ? 'var(--text-main)' : 'var(--bg-surface)',
              color: selectedCategory === cat ? 'var(--bg-app)' : 'var(--text-muted)',
              border: selectedCategory === cat ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Tendências */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filteredTrends.map(item => {
          const isFav = favorites.includes(item.id);
          const badgeCfg = BADGE_CONFIG[item.badge];
          const BadgeIcon = badgeCfg.icon;

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -6, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => { setActiveItem(item); setModalTab('visao_geral'); }}
              className="card-premium-interactive"
              style={{
                backgroundColor: 'var(--bg-surface)', borderRadius: 24, overflow: 'hidden',
                border: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)', position: 'relative'
              }}
            >
              {/* Imagem do Projeto com Selos */}
              <div style={{ position: 'relative', width: '100%', height: 210, overflow: 'hidden' }}>
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                />
                
                {/* Selo Principal (TikTok, Custo-Benefício, Lançamento, CASACOR) */}
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    backgroundColor: 'rgba(0,0,0,0.75)', color: badgeCfg.color, 
                    fontSize: 11, fontWeight: 800, padding: '5px 10px', borderRadius: 12, 
                    backdropFilter: 'blur(8px)', border: `1px solid ${badgeCfg.color}40` 
                  }}>
                    <BadgeIcon size={13} color={badgeCfg.color} />
                    {badgeCfg.label}
                  </span>
                </div>

                {/* Botões de Ação Rápida */}
                <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                  <button
                    onClick={e => handleShare(item, e)}
                    style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.65)', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                  >
                    <Share2 size={15} />
                  </button>
                  <button
                    onClick={e => toggleFavorite(item.id, e)}
                    style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: isFav ? 'var(--color-primary)' : 'rgba(0,0,0,0.65)', border: 'none', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                  >
                    <Heart size={15} fill={isFav ? '#FFF' : 'none'} />
                  </button>
                </div>

                {/* Badge de Categoria */}
                <span style={{ position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.75)', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 10, backdropFilter: 'blur(6px)' }}>
                  {item.category}
                </span>

                {/* Badge de Economia se houver */}
                {item.valueEngineering && (
                  <span style={{ position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(16, 185, 129, 0.9)', color: '#FFF', fontSize: 10, fontWeight: 900, padding: '4px 8px', borderRadius: 10, backdropFilter: 'blur(4px)' }}>
                    -{item.valueEngineering.savingsPercent}% Custo
                  </span>
                )}
              </div>

              {/* Informações da Tendência */}
              <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', gap: 14 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.35 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {item.description}
                  </p>
                </div>

                {/* Marcas de Referência e Lançamentos */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {item.brands.slice(0, 2).map((b, bi) => (
                    <span key={bi} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 8, backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontWeight: 600 }}>
                      🏷️ {b.name}
                    </span>
                  ))}
                </div>

                {/* Rodapé do Card com Paleta e Ação */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {item.palette.map((color, idx) => (
                      <div 
                        key={idx} 
                        style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: color, border: '1px solid rgba(255,255,255,0.2)' }} 
                        title={`Cor: ${color}`} 
                      />
                    ))}
                  </div>
                  
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={14} /> Abrir Guia
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MODAL DETALHADO DO GUIA DO ARQUITETO */}
      <AnimatePresence>
        {activeItem && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }} 
              onClick={() => setActiveItem(null)} 
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel"
              style={{ width: '100%', maxWidth: 680, borderRadius: 28, overflow: 'hidden', position: 'relative', zIndex: 1, maxHeight: '92vh', overflowY: 'auto', backgroundColor: 'var(--bg-elevated)' }}
            >
              {/* Imagem de Capa do Modal */}
              <div style={{ position: 'relative', width: '100%', height: 280 }}>
                <img src={activeItem.imageUrl} alt={activeItem.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button 
                  onClick={() => setActiveItem(null)} 
                  style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.7)', border: 'none', width: 38, height: 38, borderRadius: 19, color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
                >
                  <ArrowLeft size={18} />
                </button>
              </div>

              <div style={{ padding: 24 }}>
                
                {/* Cabeçalho do Modal */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {activeItem.category}
                    </span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, backgroundColor: BADGE_CONFIG[activeItem.badge].bg, color: BADGE_CONFIG[activeItem.badge].color, fontWeight: 800 }}>
                      {BADGE_CONFIG[activeItem.badge].label}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', margin: 0, lineHeight: 1.3 }}>
                    {activeItem.title}
                  </h2>
                </div>

                {/* Sub-abas de Navegação Interna */}
                <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, marginBottom: 20 }}>
                  <button
                    onClick={() => setModalTab('visao_geral')}
                    style={{
                      padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                      backgroundColor: modalTab === 'visao_geral' ? 'var(--color-primary)' : 'transparent',
                      color: modalTab === 'visao_geral' ? '#FFF' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer'
                    }}
                  >
                    Visão Geral
                  </button>

                  {activeItem.valueEngineering && (
                    <button
                      onClick={() => setModalTab('custo_beneficio')}
                      style={{
                        padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                        backgroundColor: modalTab === 'custo_beneficio' ? '#10B981' : 'transparent',
                        color: modalTab === 'custo_beneficio' ? '#FFF' : 'var(--text-muted)',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
                      }}
                    >
                      <DollarSign size={14} /> Custo-Benefício (-{activeItem.valueEngineering.savingsPercent}%)
                    </button>
                  )}

                  <button
                    onClick={() => setModalTab('especificacao')}
                    style={{
                      padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                      backgroundColor: modalTab === 'especificacao' ? 'var(--color-primary)' : 'transparent',
                      color: modalTab === 'especificacao' ? '#FFF' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer'
                    }}
                  >
                    Ficha Técnica
                  </button>
                </div>

                {/* CONTEÚDO DA ABA: VISÃO GERAL */}
                {modalTab === 'visao_geral' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                      {activeItem.description}
                    </p>

                    {/* Paleta Interativa (Copia o código Hex) */}
                    <div>
                      <h4 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Palette size={14} /> Paleta de Cores e Tons (Clique para Copiar HEX)
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                        {activeItem.palette.map((color, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => copyHex(color)}
                            style={{ 
                              padding: 8, borderRadius: 14, backgroundColor: 'var(--bg-surface)', 
                              border: copiedHex === color ? '2px solid #10B981' : '1px solid var(--border-subtle)', 
                              cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' 
                            }}
                          >
                            <div style={{ height: 36, borderRadius: 10, backgroundColor: color, border: '1px solid rgba(255,255,255,0.15)', marginBottom: 6 }} />
                            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-main)' }}>
                              {copiedHex === color ? 'Copiado!' : color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {activeItem.tags.map((tag, idx) => (
                        <span key={idx} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 10 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CONTEÚDO DA ABA: ENGENHARIA DE VALOR (CUSTO-BENEFÍCIO) */}
                {modalTab === 'custo_beneficio' && activeItem.valueEngineering && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div style={{ padding: 18, borderRadius: 18, backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <TrendingUp size={20} color="#10B981" />
                        <h4 style={{ fontSize: 15, fontWeight: 800, color: '#10B981', margin: 0 }}>
                          Economia Estimada de até {activeItem.valueEngineering.savingsPercent}%
                        </h4>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                        {activeItem.valueEngineering.tip}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div style={{ padding: 16, borderRadius: 16, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', textTransform: 'uppercase' }}>Opção Luxo Tradicional</span>
                        <h5 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginTop: 6, marginBottom: 12 }}>
                          {activeItem.valueEngineering.luxuryOption.name}
                        </h5>
                        <span style={{ fontSize: 20, fontWeight: 900, color: '#EF4444' }}>
                          R$ {activeItem.valueEngineering.luxuryOption.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div style={{ padding: 16, borderRadius: 16, backgroundColor: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase' }}>Alternativa Inteligente</span>
                        <h5 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginTop: 6, marginBottom: 12 }}>
                          {activeItem.valueEngineering.smartOption.name}
                        </h5>
                        <span style={{ fontSize: 20, fontWeight: 900, color: '#10B981' }}>
                          R$ {activeItem.valueEngineering.smartOption.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTEÚDO DA ABA: FICHA TÉCNICA E MARCAS */}
                {modalTab === 'especificacao' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 10, textTransform: 'uppercase' }}>
                        Marcas e Lançamentos Homologados
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {activeItem.brands.map((b, bi) => (
                          <div key={bi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 12, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>{b.name}</span>
                              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.product}</span>
                            </div>
                            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 8, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontWeight: 700 }}>
                              Original
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {activeItem.technicalSpec.lightingKelvin && (
                      <div style={{ padding: 14, borderRadius: 14, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Temperatura de Cor Recomendada</span>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#F59E0B', margin: '4px 0 0 0' }}>
                          💡 {activeItem.technicalSpec.lightingKelvin}
                        </p>
                      </div>
                    )}

                    <div style={{ padding: 14, borderRadius: 14, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dica de Instalação e Execução</span>
                      <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.5, margin: '4px 0 0 0' }}>
                        {activeItem.technicalSpec.installationTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* BOTÕES DE AÇÃO DO GUIA */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
                  <button
                    onClick={() => copyTechnicalSpec(activeItem)}
                    style={{ padding: '12px 16px', borderRadius: 14, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <Copy size={16} /> Copiar Especificação
                  </button>

                  <button
                    onClick={() => toggleFavorite(activeItem.id)}
                    className="btn-primary"
                    style={{ padding: '12px 16px', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    <Heart size={16} fill={favorites.includes(activeItem.id) ? '#FFF' : 'none'} />
                    {favorites.includes(activeItem.id) ? 'Remover dos Salvos' : 'Salvar no Meu Studio'}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
