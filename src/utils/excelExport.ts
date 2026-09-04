import ExcelJS from 'exceljs';

interface ExcelExportParams {
  filename: string;
  sheetName: string;
  columns: { header: string; key: string; width?: number }[];
  data: any[];
  title?: string;
  subtitle?: string;
}

export async function exportToExcel({ filename, sheetName, columns, data, title, subtitle }: ExcelExportParams) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Add Branding Header / Watermark
  worksheet.addRow(['CENTRALOBRA - PLATAFORMA DE GESTíO DA CONSTRUÇíO CIVIL']);
  worksheet.addRow(['Documento Autenticado CentralObra | www.centralobra.com.br']);
  worksheet.addRow([]);

  if (title) worksheet.addRow([title]);
  if (subtitle) worksheet.addRow([subtitle]);
  if (title || subtitle) worksheet.addRow([]);

  // Add Headers
  const headerRow = worksheet.addRow(columns.map(col => col.header));
  headerRow.font = { bold: true };

  // Set Column Widths
  columns.forEach((col, index) => {
    worksheet.getColumn(index + 1).width = col.width || 15;
  });

  // Add Data
  data.forEach(item => {
    const rowValues = columns.map(col => {
      let val = item[col.key];
      return val !== undefined && val !== null ? val : '';
    });
    const addedRow = worksheet.addRow(rowValues);
    
    // Format currencies
    columns.forEach((col, index) => {
      const key = col.key.toLowerCase();
      const isCurrency = key.includes('price') || key.includes('total') || key.includes('amount') || key.includes('cost') || key.includes('valor');
      if (isCurrency) {
        const cell = addedRow.getCell(index + 1);
        if (typeof cell.value === 'number') {
          cell.numFmt = '"R$" #,##0.00';
        }
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
