export const UNITS = [
  'Unidade',
  'Saco',
  'Caixa',
  'Pacote',
  'Barra',
  'Peça',
  'Metro',
  'Metro²',
  'Metro³',
  'Quilograma',
  'Grama',
  'Litro',
  'Mililitro'
];

export const CATEGORIES = [
  'Materiais',
  'Mão de obra',
  'Equipamentos',
  'Transporte',
  'Alimentação',
  'Outros'
];

// Common construction materials for quick selection and autocomplete
export const COMMON_MATERIALS = [
  'Cimento',
  'Argamassa',
  'Tinta',
  'Bloco',
  'Tijolo',
  'Ferragem',
  'Tubo',
  'Fio',
  'Piso',
  'Telha',
  'Impermeabilizante'
];

// Keyword mapping to categories for auto‑detection
export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Materiais: ['cimento', 'argamassa', 'tinta', 'bloco', 'tijolo', 'ferragem', 'tubo', 'fio', 'piso', 'telha', 'impermeabilizante'],
  'Mão de obra': ['mão de obra', 'operário', 'serviço', 'labor'],
  Equipamentos: ['máquina', 'equipamento', 'ferramenta'],
  Transporte: ['transporte', 'caminhão', 'van', 'logística'],
  Alimentação: ['alimentação', 'refeição', 'lanche'],
  Outros: []
};
