import * as XLSX from 'xlsx';

interface ExcelExportParams {
  filename: string;
  sheetName: string;
  columns: { header: string; key: string; width?: number }[];
  data: any[];
  title?: string;
  subtitle?: string;
}

export function exportToExcel({ filename, sheetName, columns, data, title, subtitle }: ExcelExportParams) {
  // Create a new Workbook
  const wb = XLSX.utils.book_new();

  // Create rows
  const rows: any[][] = [];

  // Add Branding Header / Watermark
  rows.push(['CENTRALOBRA - PLATAFORMA DE GESTÃO DA CONSTRUÇÃO CIVIL']);
  rows.push(['Documento Autenticado CentralObra | www.centralobra.com.br']);
  rows.push([]);

  // Add Title and Subtitle
  if (title) {
    rows.push([title]);
  }
  if (subtitle) {
    rows.push([subtitle]);
  }
  if (title || subtitle) {
    rows.push([]); // Empty row
  }

  // Add Headers
  rows.push(columns.map(col => col.header));

  // Add Data
  data.forEach(item => {
    const row = columns.map(col => {
      let val = item[col.key];
      // Format BRL currency if needed
      if (typeof val === 'number' && (col.key.toLowerCase().includes('price') || col.key.toLowerCase().includes('total') || col.key.toLowerCase().includes('amount') || col.key.toLowerCase().includes('cost') || col.key.toLowerCase().includes('valor'))) {
        return val; // Keep as number for excel formatting
      }
      return val || '';
    });
    rows.push(row);
  });

  // Create Worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Styling and column widths
  ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));

  // Apply number formats for currency columns
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
  const headerRowOffset = (title ? 1 : 0) + (subtitle ? 1 : 0) + (title || subtitle ? 1 : 0);
  
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const key = columns[C]?.key?.toLowerCase() || '';
    const isCurrency = key.includes('price') || key.includes('total') || key.includes('amount') || key.includes('cost') || key.includes('valor');
    
    if (isCurrency) {
      for (let R = headerRowOffset + 1; R <= range.e.r; ++R) {
        const cellAddress = {c: C, r: R};
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (ws[cellRef] && ws[cellRef].t === 'n') {
          ws[cellRef].z = '"R$" #,##0.00';
        }
      }
    }
  }

  // Append Worksheet
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Save File
  XLSX.writeFile(wb, `${filename}.xlsx`);
}
