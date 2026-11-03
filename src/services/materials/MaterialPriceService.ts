import { auth } from '../../lib/firebase';

export interface MaterialPrice {
  id: string;
  name: string;
  unit: string;
  price: number;
  supplier: string;
  tag?: string;
  distance?: string;
  link?: string;
  lastUpdated: string;
}

const CACHE_KEY_PREFIX = 'centralobra_prices_';
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

const normalize = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
};

// Catálogo Embutido de Resiliência Total (Garante que calculadoras nunca fiquem vazias)
const CLIENT_FALLBACK_CATALOG: { keywords: string[]; options: { supplier: string; price: number; unit: string; tag: string; distance: string; name: string }[] }[] = [
  {
    keywords: ['cimento', 'cp ii', 'cp iii', 'cp2', 'cp3'],
    options: [
      { supplier: 'Obramax', price: 34.90, unit: 'saco 50kg', tag: 'Melhor Preço', distance: '5.4 km', name: 'Cimento CP II 50kg Votoran' },
      { supplier: 'Leroy Merlin', price: 36.90, unit: 'saco 50kg', tag: 'Loja Próxima', distance: '3.1 km', name: 'Cimento CP II 50kg Cauê' },
      { supplier: 'Depósito da Região', price: 37.50, unit: 'saco 50kg', tag: 'Pronta Entrega', distance: '1.2 km', name: 'Cimento CP II 50kg' }
    ]
  },
  {
    keywords: ['areia', 'areia media', 'areia fina', 'areia lavada'],
    options: [
      { supplier: 'Depósito Regional', price: 140.00, unit: 'm³', tag: 'Mais Econômico', distance: '2.5 km', name: 'Areia Média Lavada Granel (m³)' },
      { supplier: 'Obramax', price: 8.90, unit: 'saco 20kg', tag: 'Pronta Entrega', distance: '5.4 km', name: 'Areia Média Ensacada 20kg' }
    ]
  },
  {
    keywords: ['brita', 'brita 1', 'brita 0', 'pedrisco'],
    options: [
      { supplier: 'Depósito Regional', price: 155.00, unit: 'm³', tag: 'Mais Econômico', distance: '2.5 km', name: 'Pedra Brita 1 Granel (m³)' },
      { supplier: 'Obramax', price: 9.20, unit: 'saco 20kg', tag: 'Pronta Entrega', distance: '5.4 km', name: 'Pedra Brita 1 Ensacada 20kg' }
    ]
  },
  {
    keywords: ['argamassa ac1', 'argamassa ac i', 'argamassa interna'],
    options: [
      { supplier: 'Obramax', price: 13.90, unit: 'saco 20kg', tag: 'Melhor Preço', distance: '5.4 km', name: 'Argamassa AC-I Interna 20kg' },
      { supplier: 'Leroy Merlin', price: 15.90, unit: 'saco 20kg', tag: 'Loja Próxima', distance: '3.1 km', name: 'Argamassa AC-I Quartzolit' }
    ]
  },
  {
    keywords: ['argamassa ac2', 'argamassa ac ii', 'argamassa externa'],
    options: [
      { supplier: 'Obramax', price: 18.50, unit: 'saco 20kg', tag: 'Melhor Preço', distance: '5.4 km', name: 'Argamassa AC-II 20kg Fortaleza' },
      { supplier: 'Telhanorte', price: 21.90, unit: 'saco 20kg', tag: 'Loja Próxima', distance: '4.2 km', name: 'Argamassa AC-II 20kg Quartzolit' }
    ]
  },
  {
    keywords: ['argamassa ac3', 'argamassa ac iii', 'argamassa porcelanato'],
    options: [
      { supplier: 'Obramax', price: 28.90, unit: 'saco 20kg', tag: 'Melhor Preço', distance: '5.4 km', name: 'Argamassa AC-III 20kg Votoran' },
      { supplier: 'Leroy Merlin', price: 31.90, unit: 'saco 20kg', tag: 'Loja Próxima', distance: '3.1 km', name: 'Argamassa AC-III 20kg Quartzolit' }
    ]
  },
  {
    keywords: ['rejunte', 'rejunte acrilico', 'rejunte porcelanato'],
    options: [
      { supplier: 'Leroy Merlin', price: 8.90, unit: 'pct 1kg', tag: 'Loja Próxima', distance: '3.1 km', name: 'Rejunte Porcelanato 1kg Quartzolit' },
      { supplier: 'Telhanorte', price: 9.50, unit: 'pct 1kg', tag: 'Pronta Entrega', distance: '4.2 km', name: 'Rejunte 1kg Fortaleza' }
    ]
  },
  {
    keywords: ['tijolo', 'tijolo 8 furos', 'bloco ceramico'],
    options: [
      { supplier: 'Olaria Direta', price: 1.15, unit: 'un', tag: 'Melhor Preço', distance: '8.0 km', name: 'Tijolo Cerâmico 8 Furos 9x19x19cm' },
      { supplier: 'Leroy Merlin', price: 1.45, unit: 'un', tag: 'Loja Próxima', distance: '3.1 km', name: 'Bloco Cerâmico 9x19x19cm' }
    ]
  },
  {
    keywords: ['bloco de concreto', 'bloco estrutural', 'bloco'],
    options: [
      { supplier: 'Obramax', price: 3.85, unit: 'un', tag: 'Melhor Preço', distance: '5.4 km', name: 'Bloco de Concreto Estrutural 14x19x39cm' },
      { supplier: 'Depósito Local', price: 4.10, unit: 'un', tag: 'Loja Próxima', distance: '1.2 km', name: 'Bloco Concreto Vedação 14x19x39cm' }
    ]
  },
  {
    keywords: ['aco', 'ferro', 'vergalhao', 'ca 50', 'barra de aco'],
    options: [
      { supplier: 'Obramax', price: 42.90, unit: 'barra 12m', tag: 'Melhor Preço', distance: '5.4 km', name: 'Barra de Aço CA-50 10mm 12m Gerdau' },
      { supplier: 'Telhanorte', price: 47.90, unit: 'barra 12m', tag: 'Loja Próxima', distance: '4.2 km', name: 'Vergalhão CA-50 10mm 12m ArcelorMittal' }
    ]
  },
  {
    keywords: ['tinta', 'tinta acrilica', 'tinta fosca', 'tinta latex'],
    options: [
      { supplier: 'Obramax', price: 319.00, unit: 'lata 18L', tag: 'Melhor Preço', distance: '5.4 km', name: 'Tinta Acrílica Fosca 18L Coral Rende Muito' },
      { supplier: 'Leroy Merlin', price: 349.90, unit: 'lata 18L', tag: 'Loja Próxima', distance: '3.1 km', name: 'Tinta Acrílica Premium 18L Suvinil' }
    ]
  },
  {
    keywords: ['massa corrida', 'massa pva', 'massa acrilica'],
    options: [
      { supplier: 'Obramax', price: 62.90, unit: 'lata 18L / 25kg', tag: 'Melhor Preço', distance: '5.4 km', name: 'Massa Corrida PVA 18L Coral' },
      { supplier: 'Leroy Merlin', price: 68.90, unit: 'lata 18L / 25kg', tag: 'Loja Próxima', distance: '3.1 km', name: 'Massa Corrida PVA 25kg Suvinil' }
    ]
  },
  {
    keywords: ['piso', 'ceramica', 'porcelanato', 'revestimento'],
    options: [
      { supplier: 'Obramax', price: 38.90, unit: 'm²', tag: 'Melhor Preço', distance: '5.4 km', name: 'Piso Cerâmico HD 60x60cm Bold' },
      { supplier: 'Leroy Merlin', price: 79.90, unit: 'm²', tag: 'Loja Próxima', distance: '3.1 km', name: 'Porcelanato Polido 84x84cm Elizabeth' }
    ]
  },
  {
    keywords: ['gesso', 'drywall', 'placa drywall'],
    options: [
      { supplier: 'Obramax', price: 36.90, unit: 'chapa 1,20x2,40m', tag: 'Melhor Preço', distance: '5.4 km', name: 'Chapa Drywall ST 12,5mm 1,20x2,40m' },
      { supplier: 'Depósito do Gesseiro', price: 24.00, unit: 'saco 40kg', tag: 'Pronta Entrega', distance: '2.8 km', name: 'Gesso em Pó Rápido 40kg' }
    ]
  },
  {
    keywords: ['tubo', 'cano', 'pvc', 'esgoto', 'agua fria'],
    options: [
      { supplier: 'Obramax', price: 58.90, unit: 'barra 6m', tag: 'Melhor Preço', distance: '5.4 km', name: 'Tubo PVC Esgoto 100mm 6m Tigre' },
      { supplier: 'Leroy Merlin', price: 64.90, unit: 'barra 6m', tag: 'Loja Próxima', distance: '3.1 km', name: 'Tubo PVC 100mm 6m Amanco' }
    ]
  },
  {
    keywords: ['fio', 'cabo', 'cabo flexivel', 'eletrico'],
    options: [
      { supplier: 'Obramax', price: 179.90, unit: 'rolo 100m', tag: 'Melhor Preço', distance: '5.4 km', name: 'Cabo Flexível 2,5mm² 100m Sil' },
      { supplier: 'Leroy Merlin', price: 199.90, unit: 'rolo 100m', tag: 'Loja Próxima', distance: '3.1 km', name: 'Cabo Flexível 2,5mm 100m Prysmian' }
    ]
  },
  {
    keywords: ['telha', 'telhado', 'fibrocimento'],
    options: [
      { supplier: 'Obramax', price: 63.90, unit: 'un', tag: 'Melhor Preço', distance: '5.4 km', name: 'Telha Fibrocimento 2,44x1,10m 6mm Brasilit' },
      { supplier: 'Leroy Merlin', price: 2.85, unit: 'un', tag: 'Loja Próxima', distance: '3.1 km', name: 'Telha Cerâmica Romana Vermelha' }
    ]
  }
];

function getClientFallbackPrices(query: string): MaterialPrice[] {
  const normQuery = normalize(query);
  const tokens = normQuery.split(' ').filter(t => t.length > 2);

  let bestMatch: any[] = [];
  let maxScore = 0;

  for (const item of CLIENT_FALLBACK_CATALOG) {
    let score = 0;
    for (const kw of item.keywords) {
      const normKw = normalize(kw);
      if (normQuery.includes(normKw) || normKw.includes(normQuery)) {
        score += 10;
      } else {
        for (const token of tokens) {
          if (normKw.includes(token)) score += 3;
        }
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = item.options;
    }
  }

  if (bestMatch.length > 0) {
    return bestMatch.map((opt, i) => ({
      id: `client_fb_${Date.now()}_${i}`,
      name: opt.name,
      unit: opt.unit,
      price: opt.price,
      supplier: opt.supplier,
      tag: opt.tag,
      distance: opt.distance,
      link: 'https://centralobra.com',
      lastUpdated: new Date().toISOString()
    }));
  }

  // Fallback padrão estimado
  return [
    {
      id: `client_gen_${Date.now()}`,
      name: query,
      unit: 'un',
      price: 38.50,
      supplier: 'Depósito Local',
      tag: 'Preço Estimado',
      distance: '2.0 km',
      link: 'https://centralobra.com',
      lastUpdated: new Date().toISOString()
    }
  ];
}

class MaterialPriceService {
  async searchMaterial(query: string): Promise<MaterialPrice[]> {
    if (!query) return [];

    const lowerQuery = query.toLowerCase().trim();
    const cacheKey = `${CACHE_KEY_PREFIX}${lowerQuery}`;
    const cachedStr = localStorage.getItem(cacheKey);

    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        if (Date.now() - cached.timestamp < CACHE_DURATION_MS && cached.data?.length > 0) {
          return cached.data;
        }
      } catch (e) {
      }
    }

    try {
      let token = '';
      try {
        const user = auth.currentUser;
        if (user) {
          token = await user.getIdToken();
        }
      } catch (e) {
      }

      const response = await fetch(`/api/prices?q=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const resultsArray = result.data?.[query] || result.data?.[lowerQuery] || [];

        if (Array.isArray(resultsArray) && resultsArray.length > 0) {
          const formattedPrices: MaterialPrice[] = resultsArray.map((item: any, index: number) => ({
            id: `api_${index}_${Date.now()}`,
            name: item.name || query,
            unit: item.unit || 'un',
            price: Number(item.price) || 0,
            supplier: item.store || item.supplier || 'Loja Próxima',
            tag: item.tag || 'Confirmado',
            distance: item.distance || '3 km',
            link: item.url || item.link,
            lastUpdated: item.lastUpdated || new Date().toISOString()
          }));

          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: formattedPrices
          }));

          return formattedPrices;
        }
      }
    } catch (error) {
      console.warn('API de preços indisponível, usando catálogo de resiliência:', error);
    }

    // Se a API não respondeu ou não tem dados, usa o catálogo de mercado integrado
    const fallbackPrices = getClientFallbackPrices(query);
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data: fallbackPrices
    }));
    return fallbackPrices;
  }

  async searchMultiple(queries: string[]): Promise<Record<string, MaterialPrice[]>> {
    const validQueries = queries.filter(Boolean);
    if (!validQueries.length) return {};

    const results: Record<string, MaterialPrice[]> = {};
    const missingQueries: string[] = [];

    validQueries.forEach(q => {
      const cacheKey = `${CACHE_KEY_PREFIX}${q.toLowerCase().trim()}`;
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr);
          if (Date.now() - cached.timestamp < CACHE_DURATION_MS && cached.data?.length > 0) {
            results[q] = cached.data;
            return;
          }
        } catch (e) {}
      }
      missingQueries.push(q);
    });

    if (missingQueries.length === 0) return results;

    try {
      let token = '';
      try {
        const user = auth.currentUser;
        if (user) token = await user.getIdToken();
      } catch (e) {}

      const response = await fetch(`/api/prices?materials=${encodeURIComponent(missingQueries.join(','))}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || {};

        missingQueries.forEach(q => {
          const lowerQ = q.toLowerCase().trim();
          const sourceArray = data[lowerQ] || data[q];
          if (sourceArray && Array.isArray(sourceArray) && sourceArray.length > 0) {
            const formattedPrices: MaterialPrice[] = sourceArray.map((item: any, index: number) => ({
               id: `api_${index}_${Date.now()}`,
               name: item.name || q,
               unit: item.unit || 'un',
               price: Number(item.price) || 0,
               supplier: item.store || item.supplier || 'Loja Próxima',
               tag: item.tag || 'Confirmado',
               distance: item.distance || '3 km',
               link: item.url || item.link,
               lastUpdated: item.lastUpdated || new Date().toISOString()
            }));

            results[q] = formattedPrices;

            const cacheKey = `${CACHE_KEY_PREFIX}${lowerQ}`;
            localStorage.setItem(cacheKey, JSON.stringify({
              timestamp: Date.now(),
              data: formattedPrices
            }));
          } else {
            // Usa fallback para este item específico
            const fb = getClientFallbackPrices(q);
            results[q] = fb;
          }
        });

        return results;
      }
    } catch (error) {
      console.warn('API de múltiplos preços indisponível, usando catálogo integrado:', error);
    }

    // Se a chamada de rede falhou totalmente, preenche os que faltam com o catálogo embutido
    missingQueries.forEach(q => {
      const fb = getClientFallbackPrices(q);
      results[q] = fb;
      const cacheKey = `${CACHE_KEY_PREFIX}${q.toLowerCase().trim()}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: fb
      }));
    });

    return results;
  }
}

export const materialPriceService = new MaterialPriceService();
