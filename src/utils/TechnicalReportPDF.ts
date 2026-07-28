import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TechnicalReportPDFData {
  title: string;
  reportNumber: string;
  date: string;
  clientName: string;
  projectName: string;
  address?: string;
  responsibleName: string;
  creaCau?: string;
  weather?: string;
  summary: string;
  checklist: { item: string; status: 'Conforme' | 'Não Conforme' | 'N/A'; obs?: string }[];
  pendencies?: { description: string; priority: string; responsible?: string; deadline?: string }[];
  conclusions: string;
  signatureName?: string;
}

export function generateTechnicalReportPDF(data: TechnicalReportPDFData) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Header Banner
  doc.setFillColor(139, 92, 246); // Purple 600
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('RELATÓRIO TÉCNICO DE OBRA', margin, 38);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nº ${data.reportNumber}`, pageWidth - margin, 38, { align: 'right' });

  let y = 80;

  // Metadata Block
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 70, 8, 8, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(`PROJETO / OBRA: ${data.projectName}`, margin + 14, y + 20);
  doc.text(`CLIENTE: ${data.clientName}`, margin + 14, y + 36);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Data da Vistoria: ${data.date}`, pageWidth - margin - 14, y + 20, { align: 'right' });
  doc.text(`Responsável: ${data.responsibleName} ${data.creaCau ? `(${data.creaCau})` : ''}`, pageWidth - margin - 14, y + 36, { align: 'right' });
  if (data.address) {
    doc.text(`Local: ${data.address}`, margin + 14, y + 54);
  }

  y += 90;

  // Resumo da Vistoria
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('1. Resumo Técnico e Observações de Campo', margin, y);
  y += 14;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const summaryLines = doc.splitTextToSize(data.summary || 'Vistoria técnica realizada conforme procedimentos normativos.', pageWidth - (margin * 2));
  doc.text(summaryLines, margin, y);
  y += (summaryLines.length * 14) + 15;

  // Checklist de Vistoria
  if (data.checklist && data.checklist.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('2. Checklist Técnico de Inspeção', margin, y);
    y += 10;

    const tableBody = data.checklist.map(c => [
      c.item,
      c.status,
      c.obs || '—'
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Item Inspecionado', 'Status', 'Observações / Parecer']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 6 },
      columnStyles: {
        0: { cellWidth: 200, fontStyle: 'bold' },
        1: { cellWidth: 90, halign: 'center' },
        2: { cellWidth: 220 },
      },
      didParseCell: function (d) {
        if (d.column.index === 1 && d.cell.section === 'body') {
          if (d.cell.raw === 'Conforme') d.cell.styles.textColor = [16, 185, 129];
          else if (d.cell.raw === 'Não Conforme') d.cell.styles.textColor = [239, 68, 68];
        }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 20;
  }

  // Conclusão Técnica
  if (y > pageHeight - 150) {
    doc.addPage();
    y = 50;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('3. Conclusão Técnica & Recomendações', margin, y);
  y += 14;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const concLines = doc.splitTextToSize(data.conclusions || 'Obra atende aos critérios normativos inspecionados.', pageWidth - (margin * 2));
  doc.text(concLines, margin, y);
  y += (concLines.length * 14) + 40;

  // Signature Block
  if (y > pageHeight - 100) {
    doc.addPage();
    y = 60;
  }

  const sigX = pageWidth / 2;
  doc.setDrawColor(156, 163, 175);
  doc.line(sigX - 120, y, sigX + 120, y);
  y += 14;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.signatureName || data.responsibleName, sigX, y, { align: 'center' });
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(data.creaCau ? `Responsável Técnico - CREA/CAU: ${data.creaCau}` : 'Responsável Técnico', sigX, y, { align: 'center' });

  // Footer for all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('CentralObra Pro — Documento Técnico Autenticado', margin, pageHeight - 20);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  doc.save(`Laudo_Tecnico_${data.projectName.replace(/\s+/g, '_')}_${data.reportNumber}.pdf`);
}
