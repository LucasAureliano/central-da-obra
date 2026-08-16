/**
 * Formata um valor numérico para o padrão de moeda brasileiro (BRL)
 * Retorna ex: R$ 1.250,50
 */
export function formatCurrency(value: number | string | undefined | null): string {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return 'R$ 0,00';
  }
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value));
}

/**
 * Formata uma string de data ou objeto Date para o padrão brasileiro (dd/MM/yyyy)
 */
export function formatDate(date?: string | Date | number | null): string {
  if (!date) return '--/--/----';
  
  try {
    const d = new Date(date);
    // Verificar se é data inválida
    if (isNaN(d.getTime())) return '--/--/----';
    
    return Intl.DateTimeFormat('pt-BR', {
      timeZone: 'UTC', // Evitar problemas de timezone para datas puras
    }).format(d);
  } catch (e) {
    return '--/--/----';
  }
}
