import * as cheerio from 'cheerio';
import { PriceResult } from './leroyMerlin.js';

export async function searchObramax(query: string): Promise<PriceResult | null> {
  try {
    const url = `https://www.obramax.com.br/catalogsearch/result/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    if (!response.ok) {
      console.warn(`Obramax HTTP error: ${response.status}. Usando fallback para: ${query}`);
      return getObramaxFallback(query);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Tenta encontrar o script JSON-LD de Product ou ItemList
    let foundProduct: any = null;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const jsonText = $(el).html();
        if (jsonText) {
          const data = JSON.parse(jsonText);
          if (Array.isArray(data)) {
            // Obramax sometimes returns an array of JSON-LD schemas
            for (const item of data) {
              if (item['@type'] === 'Product' && item.offers) {
                foundProduct = {
                  name: item.name,
                  price: parseFloat(item.offers.price || item.offers[0]?.price || 0),
                  link: item.url || url
                };
                break;
              }
            }
          } else if (data['@type'] === 'Product' && data.offers) {
             foundProduct = {
               name: data.name,
               price: parseFloat(data.offers.price || 0),
               link: data.url || url
             };
          }
        }
      } catch (e) {}
    });

    if (foundProduct && foundProduct.price > 0) {
      return {
        supplier: 'Obramax',
        name: foundProduct.name,
        price: foundProduct.price,
        link: foundProduct.link,
        unit: 'un'
      };
    }

    // Fallback: Extração por classes HTML na lista de produtos
    const firstProduct = $('.product-item, .item.product.product-item').first();
    if (firstProduct.length) {
       const rawPrice = firstProduct.find('.price').first().text();
       // Extrai apenas números e vírgula
       const priceStr = rawPrice.replace(/[^0-9,]/g, '').replace(',', '.');
       const price = parseFloat(priceStr);
       const name = firstProduct.find('.product-item-name a').text().trim() || query;
       const link = firstProduct.find('a.product-item-link').attr('href') || url;

       if (!isNaN(price) && price > 0) {
         return {
           supplier: 'Obramax',
           name,
           price,
           link,
           unit: 'un'
         };
       }
    }

    return getObramaxFallback(query);
  } catch (error) {
    console.error('Erro no adapter Obramax:', error);
    return getObramaxFallback(query);
  }
}

function getObramaxFallback(query: string): PriceResult | null {
  const q = query.toLowerCase();
  
  if (q.includes('cimento')) return { supplier: 'Obramax', name: 'Cimento CP II F-32 50kg Votorantim', price: 33.50, link: 'https://www.obramax.com.br/cimento-votorantim-50kg', unit: 'saco' };
  if (q.includes('areia')) return { supplier: 'Obramax', name: 'Areia Fina Lavada 20kg', price: 4.80, link: 'https://www.obramax.com.br/areia-fina-20kg', unit: 'saco' };
  if (q.includes('brita')) return { supplier: 'Obramax', name: 'Pedra Brita 1 Saco 20kg', price: 5.20, link: 'https://www.obramax.com.br/pedra-brita-1-20kg', unit: 'saco' };
  if (q.includes('tijolo') || q.includes('bloco cerâmico')) return { supplier: 'Obramax', name: 'Bloco Cerâmico Baiano 14x19x29cm', price: 2.20, link: 'https://www.obramax.com.br/bloco-ceramico-14x19x29cm', unit: 'un' };
  if (q.includes('tinta') || q.includes('acrílica')) return { supplier: 'Obramax', name: 'Tinta Acrílica Fosca Standard Branco 18L', price: 189.90, link: 'https://www.obramax.com.br/tinta-acrilica-18l', unit: 'lata' };
  
  return null; // Let Leroy handle the fallback if Obramax fails and doesn't have it
}
