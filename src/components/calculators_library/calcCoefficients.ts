// Biblioteca centralizada de coeficientes técnicos do mercado brasileiro da construção civil.
// Facilita atualização de rendimentos, perdas e parâmetros normativos sem precisar alterar a UI.

export const Coefficients = {
  losses: {
    masonry: 1.10, // 10%
    concrete: 1.05, // 5%
    roof: 1.10,
    paint: 1.05,
    floor: 1.15 // 15% para cortes de piso
  },
  masonry: {
    baiano_9x19x19: { yieldM2: 25 },
    'ceramico_11.5x14x24': { yieldM2: 29 },
    baiano_14x19x29: { yieldM2: 17 },
    concreto_14x19x39: { yieldM2: 12.5 },
    estrutural_14x19x39: { yieldM2: 12.5 },
    estrutural_19x19x39: { yieldM2: 12.5 },
    macico_5x9x19: { yieldM2: 80 },
    mortarKgPerM2: 15,
  },
  concrete: {
    mixes: { // cimento, areia, brita, agua
      '15': { cement: 5, sand: 0.72, gravel: 0.60, water: 180 },
      '20': { cement: 6, sand: 0.65, gravel: 0.65, water: 190 },
      '25': { cement: 7, sand: 0.60, gravel: 0.70, water: 200 },
      '30': { cement: 8, sand: 0.55, gravel: 0.75, water: 210 },
      '35': { cement: 9, sand: 0.50, gravel: 0.80, water: 220 }
    }
  },
  structure: {
    steelKgPerM3: 80, // Estimativa média de 80kg de aço por m3 de concreto armado
    woodFormSqMPerM3: 12, // 12m2 de forma por m3 (média pilares/vigas)
  },
  finishes: {
    paint: {
      acrylic: { yieldM2PerLiter: 10 }, // 10m2/L por demão (rendimento prático)
      epoxy: { yieldM2PerLiter: 8 },
      enamel: { yieldM2PerLiter: 12 },
      sealer: { yieldM2PerLiter: 8 }
    },
    texture: {
      grafiato: { kgPerM2: 3.5 }, // 3.5kg a 4kg por m2
      projetada: { kgPerM2: 2.5 }
    },
    floor: {
      mortarKgPerM2: 6, // 6kg de argamassa (AC1/AC2/AC3) por m2 (dupla colagem)
      groutKgPerM2: 0.3 // 300g de rejunte por m2 em média (pode variar c/ tamanho da junta)
    }
  },
  roof: {
    tiles: {
      ceramic: { yieldUnPerM2: 15 }, // Telha romana/portuguesa
      fibrocement: { yieldUnPerM2: 0.7 } // Telha 2.44x1.10 (rendimento util ~1.47m2)
    },
    wood: {
      // Madeiramento médio em metros lineares por m2 de telhado (estimativas)
      caibroMlPerM2: 2.5,
      ripaMlPerM2: 3.5,
      vigaMlPerM2: 0.7
    }
  },
  waterproofing: {
    asphaltic: { kgPerM2: 3.0 }, // Emulsão asfáltica (3kg/m2)
    polymeric: { kgPerM2: 4.0 } // Argamassa polimérica (4kg/m2)
  },
  mep: { // Mechanical, Electrical, Plumbing
    electrical: {
      conduitMlPerPoint: 3.5, // Média de 3.5m de eletroduto corrugado por ponto elétrico
      cableMlPerPoint: 10.5 // Média de 10.5m de fio (Fase+Neutro+Terra = 3 * 3.5) por ponto
    },
    hydraulic: {
      pipeMlPerPoint: 2.0, // Média de 2m de tubo PVC de Água Fria por ponto
      fittingsPerPoint: 3 // Média de 3 conexões (joelhos/Tês) por ponto
    }
  },
  drywall: {
    // Estimativas para parede de drywall simples (1 chapa de cada lado, montantes a cada 60cm)
    boardsSqMPerM2: 2.1, // 2 chapas (frente e verso) + 5% perda
    studsMlPerM2: 2.5, // Montantes (Ml por m2)
    tracksMlPerM2: 0.7, // Guias (Ml por m2)
    screwsPerM2: 30, // Parafusos (Unidade por m2)
    jointCompoundKgPerM2: 0.5, // Massa para juntas (Kg por m2)
    jointTapeMlPerM2: 1.5, // Fita (Ml por m2)
  },
  plaster: {
    // Forro de plaquinha de gesso 60x60
    platesPerM2: 3.0, // Placas + 8% perda
    wireKgPerM2: 0.05, // Arame galvanizado (Kg por m2)
    sisalKgPerM2: 0.04, // Estopa/Sisal (Kg por m2)
    gluePlasterKgPerM2: 1.0 // Gesso cola (Kg por m2)
  }
};
