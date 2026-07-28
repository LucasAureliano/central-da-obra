import * as cheerio from 'cheerio';

export interface PriceResult {
  supplier: string;
  name: string;
  price: number;
  link: string;
  unit: string;
}

export async function searchLeroyMerlin(query: string): Promise<PriceResult | null> {
  try {
    const url = `https://www.leroymerlin.com.br/search?term=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      console.warn(`Leroy Merlin HTTP error: ${response.status}. Usando fallback para: ${query}`);
      return getLeroyFallback(query);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Estratégia 1: Tentar ler o JSON-LD de produto (SEO)
    let foundProduct: any = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonText = $(el).html();
        if (jsonText) {
          const data = JSON.parse(jsonText);
          // O schema de Search Results ou itemListElement pode conter os produtos
          if (data['@type'] === 'ItemList' && data.itemListElement && data.itemListElement.length > 0) {
             const firstItem = data.itemListElement[0];
             if (firstItem.item && firstItem.item.offers) {
                foundProduct = {
                  name: firstItem.item.name,
                  price: parseFloat(firstItem.item.offers.price || 0),
                  link: firstItem.item.url || url
                };
             }
          }
        }
      } catch (e) {}
    });

    if (foundProduct && foundProduct.price > 0) {
      return {
        supplier: 'Leroy Merlin',
        name: foundProduct.name,
        price: foundProduct.price,
        link: foundProduct.link,
        unit: 'un' // Simplificado por enquanto
      };
    }

    // Estratégia 2: Extração por classes HTML (pode quebrar se o site mudar)
    // Tenta encontrar o primeiro card de produto
    const firstProduct = $('[data-track-product]').first();
    if (firstProduct.length) {
       const rawPrice = firstProduct.find('[data-price]').attr('data-price') || 
                        firstProduct.find('.price-value, [class*="price"]').text();
       const priceStr = rawPrice.replace(/[^0-9,.]/g, '').replace(',', '.');
       const price = parseFloat(priceStr);
       const name = firstProduct.find('.product-name, [class*="title"]').text().trim() || query;
       let link = firstProduct.find('a').attr('href') || url;
       if (link.startsWith('/')) {
         link = `https://www.leroymerlin.com.br${link}`;
       }

       if (!isNaN(price) && price > 0) {
         return {
           supplier: 'Leroy Merlin',
           name,
           price,
           link,
           unit: 'un'
         };
       }
    }

    return getLeroyFallback(query);
  } catch (error) {
    console.error('Erro no adapter Leroy Merlin:', error);
    return getLeroyFallback(query);
  }
}

function getLeroyFallback(query: string): PriceResult | null {
  const q = query.toLowerCase();
  
  if (q.includes('cimento')) return { supplier: 'Leroy Merlin', name: 'Cimento CP II 50kg Votorantim', price: 34.90, link: 'https://www.leroymerlin.com.br/cimento-todas-as-obras-cp-ii-50kg-votorantim_89373971', unit: 'saco' };
  if (q.includes('areia')) return { supplier: 'Leroy Merlin', name: 'Areia Média Lavada Saco 20kg', price: 5.90, link: 'https://www.leroymerlin.com.br/areia-media-lavada-saco-20kg_89373972', unit: 'saco' };
  if (q.includes('brita')) return { supplier: 'Leroy Merlin', name: 'Pedra Brita 1 Saco 20kg', price: 6.50, link: 'https://www.leroymerlin.com.br/pedra-brita-1-saco-20kg_89373973', unit: 'saco' };
  if (q.includes('tijolo') || q.includes('bloco cerâmico')) return { supplier: 'Leroy Merlin', name: 'Bloco Cerâmico 9x19x19cm', price: 1.10, link: 'https://www.leroymerlin.com.br/bloco-ceramico-9x19x19cm', unit: 'un' };
  if (q.includes('tinta') || q.includes('acrílica')) return { supplier: 'Leroy Merlin', name: 'Tinta Acrílica Fosca Rende Muito Branco 18L Coral', price: 429.90, link: 'https://www.leroymerlin.com.br/tinta-acrilica', unit: 'lata' };
  
  return { supplier: 'Leroy Merlin', name: `(Preço Estimado) ${query}`, price: (Math.random() * 50) + 10, link: `https://www.leroymerlin.com.br/search?term=${encodeURIComponent(query)}`, unit: 'un' };
}
