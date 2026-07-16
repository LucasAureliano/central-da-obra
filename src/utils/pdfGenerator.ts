import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportParams {
  work: any;
  user: any;
  calculations: any[];
  profile?: any;
}

// Draw the logo + header bar on the top of a page
function drawHeader(doc: jsPDF, userName: string, userEmail: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Top bar background
  doc.setFillColor(255, 107, 0);
  doc.rect(0, 0, pageWidth, 70, 'F');

  // Subtle gradient overlay
  doc.setFillColor(220, 80, 0);
  doc.rect(0, 55, pageWidth, 15, 'F');

  // Logo icon (hard-hat shape drawn with rects)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, 14, 42, 42, 8, 8, 'F');
  doc.setFillColor(255, 107, 0);
  doc.roundedRect(24, 18, 34, 34, 6, 6, 'F');
  doc.setFillColor(255, 255, 255);
  // Hard-hat brim
  doc.rect(28, 38, 26, 4, 'F');
  // Hard-hat dome
  doc.roundedRect(31, 24, 20, 16, 4, 4, 'F');

  // App name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('CentralObra', 72, 32);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Gestão inteligente de obras', 72, 46);

  // User info on the right
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  const rightX = pageWidth - 20;
  doc.text(userName || 'Usuário', rightX, 28, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(userEmail || '', rightX, 40, { align: 'right' });
  doc.text(new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }), rightX, 50, { align: 'right' });
}

// Draw the footer/merchan on the bottom of every page
function drawFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Footer bar
  doc.setFillColor(245, 245, 245);
  doc.rect(0, pageHeight - 40, pageWidth, 40, 'F');

  // Divider line
  doc.setDrawColor(230, 230, 230);
  doc.line(0, pageHeight - 40, pageWidth, pageHeight - 40);

  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Documento gerado pela plataformo CentralObra', pageWidth / 2, pageHeight - 26, { align: 'center' });
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 107, 0);
  doc.text('centralobra.vercel.app', pageWidth / 2, pageHeight - 14, { align: 'center' });

  // Page number
  const pageCount = (doc as any).internal.getNumberOfPages();
  const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.setFont('helvetica', 'normal');
  doc.text(`Página ${currentPage} de ${pageCount}`, pageWidth - 20, pageHeight - 26, { align: 'right' });
}

export function generateBudgetPDF({ work, user, calculations, profile }: PDFExportParams) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  const userName = profile?.name || user?.displayName || user?.email || 'Usuário';
  const userEmail = user?.email || '';

  // ===== PAGE 1 HEADER =====
  drawHeader(doc, userName, userEmail);

  // ===== TITLE =====
  let y = 95;
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Orçamento de Obra', 40, y);

  // Horizontal accent line
  y += 8;
  doc.setFillColor(255, 107, 0);
  doc.rect(40, y, 80, 3, 'F');

  // ===== WORK INFO CARD =====
  y += 22;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(30, y, pageWidth - 60, 90, 6, 6, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(30, y, pageWidth - 60, 90, 6, 6, 'S');

  const cardY = y + 18;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('DADOS DA OBRA', 45, cardY);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text(`Obra: ${work.name || 'Não informada'}`, 45, cardY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Responsável: ${userName}`, 45, cardY + 34);
  doc.text(`Endereço: ${work.address || 'Não informado'}`, 45, cardY + 50);

  // Right side info
  const rightCol = pageWidth / 2 + 20;
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, rightCol, cardY + 34);
  if (work.budget) {
    const budgetFormatted = typeof work.budget === 'number' 
      ? work.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
      : work.budget;
    doc.text(`Orçamento Previsto: ${budgetFormatted}`, rightCol, cardY + 50);
  }

  // ===== CALCULATIONS / TABLES =====
  y += 110;
  let totalGeral = 0;

  if (calculations.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text('Nenhum cálculo registrado para esta obra.', 40, y + 20);
  }

  calculations.forEach((calc, index) => {
    if (!calc.resultData || !calc.resultData.materials || calc.resultData.materials.length === 0) return;

    // Check if we need a new page
    if (y > 680) {
      doc.addPage();
      drawHeader(doc, userName, userEmail);
      y = 90;
    }

    // Section title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 0);
    doc.text(`${index + 1}. ${calc.calcType || 'Lista de Materiais'}`, 40, y);
    
    // Accent underline
    y += 6;
    doc.setFillColor(255, 107, 0);
    doc.rect(40, y, 60, 2, 'F');
    y += 8;

    const tableData = calc.resultData.materials.map((mat: any) => {
      const q = Number(mat.quantity) || 0;
      const p = Number(mat.unitPrice) || 0;
      const total = q * p;
      return [
        mat.name,
        `${q} ${mat.unit || ''}`,
        p.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ];
    });

    const calcTotal = calc.resultData.materials.reduce(
      (acc: number, mat: any) => acc + (Number(mat.quantity || 0) * Number(mat.unitPrice || 0)), 0
    );
    totalGeral += calcTotal;

    // Subtotal row
    tableData.push([
      'SUBTOTAL',
      '',
      '',
      calcTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Material', 'Quantidade', 'Valor Unitário', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [255, 107, 0], 
        textColor: 255, 
        fontSize: 9, 
        fontStyle: 'bold',
        cellPadding: 8
      },
      styles: { 
        fontSize: 9, 
        cellPadding: 6,
        textColor: [50, 50, 50]
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252]
      },
      columnStyles: {
        0: { cellWidth: 200, fontStyle: 'bold' },
        1: { cellWidth: 80, halign: 'center' },
        2: { cellWidth: 100, halign: 'right' },
        3: { cellWidth: 100, halign: 'right' },
      },
      didParseCell: function (data) {
        // Style the subtotal row
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [255, 243, 230]; // Light orange
          data.cell.styles.textColor = [200, 80, 0];
        }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 30;
  });

  // ===== TOTAL GERAL =====
  if (y > 720) {
    doc.addPage();
    drawHeader(doc, userName, userEmail);
    y = 90;
  }

  // Total box
  doc.setFillColor(255, 107, 0);
  doc.roundedRect(30, y, pageWidth - 60, 50, 6, 6, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL GERAL DO ORÇAMENTO', 50, y + 22);
  
  doc.setFontSize(18);
  doc.text(
    totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
    pageWidth - 50, 
    y + 32, 
    { align: 'right' }
  );

  // ===== ADD FOOTER TO ALL PAGES =====
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawFooter(doc);
  }

  // Save
  doc.save(`Orcamento_${work.name?.replace(/\s+/g, '_') || 'Obra'}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
}
