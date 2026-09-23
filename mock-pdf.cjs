const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');

const doc1 = new jsPDF('p', 'pt', 'a4');
const margin = 40;
const pageWidth = doc1.internal.pageSize.getWidth();
const pageHeight = doc1.internal.pageSize.getHeight();

// ==========================================
// PDF 1: MATERIALS (Minimalist, orange block, dark footer)
// ==========================================
doc1.setFontSize(28);
doc1.setFont('helvetica', 'bold');
doc1.setTextColor(30, 41, 59);
doc1.text('CÁLCULO DE MATERIAIS', margin, 60);

doc1.setFontSize(10);
doc1.setFont('helvetica', 'normal');
doc1.setTextColor(100, 116, 139);
doc1.text('23 de setembro de 2026', margin, 78);

const rightX = pageWidth - margin - 120;
doc1.setFillColor(249, 115, 22);
doc1.rect(rightX, 42, 10, 30, 'F');
doc1.rect(rightX + 14, 48, 10, 24, 'F');
doc1.setFontSize(14);
doc1.setFont('helvetica', 'bold');
doc1.setTextColor(15, 23, 42);
doc1.text('Central', rightX + 32, 60);
doc1.setTextColor(249, 115, 22);
doc1.text('Obra', rightX + 32 + doc1.getTextWidth('Central'), 60);
doc1.setFontSize(8);
doc1.setTextColor(100, 116, 139);
doc1.setFont('helvetica', 'normal');
doc1.text('Gestão Inteligente', rightX + 32, 72);

let currentY = 120;
doc1.setFontSize(9);
doc1.setFont('helvetica', 'bold');
doc1.text('Para:', margin, currentY);
doc1.setFontSize(11);
doc1.setTextColor(30, 41, 59);
doc1.text('João da Silva', margin, currentY + 14);
doc1.setFontSize(9);
doc1.setFont('helvetica', 'normal');
doc1.setTextColor(100, 116, 139);
doc1.text('Obra:', margin, currentY + 28);
doc1.text('Reforma Residencial', margin, currentY + 40);

doc1.setFontSize(9);
doc1.setFont('helvetica', 'bold');
doc1.text('Emitido pelo Sistema:', pageWidth / 2, currentY);
doc1.setFontSize(11);
doc1.setTextColor(30, 41, 59);
doc1.text('CentralObra App', pageWidth / 2, currentY + 14);
doc1.setFontSize(9);
doc1.setFont('helvetica', 'normal');
doc1.setTextColor(100, 116, 139);
doc1.text('www.centralobra.com.br', pageWidth / 2, currentY + 28);

currentY += 80;

autoTable.default(doc1, {
  startY: currentY,
  head: [['DESCRIÇÃO DO ITEM', 'QTD', 'VALOR UNIT', 'TOTAL']],
  body: [
    ['Cimento Portland CP II', '50 sacos', 'R$ 35,90', 'R$ 1.795,00'],
    ['Areia Média', '12 m³', 'R$ 120,00', 'R$ 1.440,00'],
    ['Brita 1', '8 m³', 'R$ 130,00', 'R$ 1.040,00']
  ],
  theme: 'plain',
  headStyles: { textColor: [15, 23, 42], fontStyle: 'bold', fontSize: 9, lineWidth: { top: 1, bottom: 1 }, lineColor: [30, 41, 59] },
  bodyStyles: { textColor: [100, 116, 139], fontSize: 9, cellPadding: { top: 12, bottom: 12, left: 6, right: 6 } },
  columnStyles: { 0: { cellWidth: 'auto', fontStyle: 'bold', textColor: [30,41,59] }, 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right', fontStyle: 'bold', textColor: [30,41,59] } },
  margin: { left: margin, right: margin }
});

const footerHeight = 120;
doc1.setFillColor(45, 55, 72);
doc1.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
doc1.setTextColor(255, 255, 255);
doc1.setFontSize(10);
doc1.setFont('helvetica', 'bold');
doc1.text('Termos & Condições.', margin, pageHeight - footerHeight + 30);
doc1.setFontSize(8);
doc1.setFont('helvetica', 'normal');
doc1.setTextColor(160, 174, 192);
doc1.text('Cálculo gerado automaticamente com base em ABNT e TCPO.', margin, pageHeight - footerHeight + 50);
doc1.text('Valores sujeitos a variações do mercado.', margin, pageHeight - footerHeight + 62);
doc1.setFontSize(10);
doc1.setFont('helvetica', 'bold');
doc1.setTextColor(255, 255, 255);
doc1.text('Método de Utilização', pageWidth / 2 + 50, pageHeight - footerHeight + 30);
doc1.setFontSize(8);
doc1.setFont('helvetica', 'normal');
doc1.setTextColor(160, 174, 192);
doc1.text('Documento Exclusivo CentralObra', pageWidth / 2 + 50, pageHeight - footerHeight + 50);

doc1.setFontSize(8);
doc1.setFont('helvetica', 'italic');
doc1.setTextColor(200, 200, 200);
doc1.text('Gerado gratuitamente por CentralObra - www.centralobra.com.br', pageWidth - 260, pageHeight - 15);

doc1.save('materials_preview.pdf');


// ==========================================
// PDF 2: COMMERCIAL QUOTE (Dark block, QR code)
// ==========================================
const doc2 = new jsPDF('p', 'pt', 'a4');
doc2.setFillColor(243, 244, 246);
doc2.rect(0, 0, pageWidth, pageHeight, 'F');

doc2.setFillColor(255, 255, 255);
doc2.rect(margin, margin, pageWidth - (margin*2), pageHeight - (margin*2), 'F');

const darkBlockWidth = 140;
doc2.setFillColor(30, 41, 59);
doc2.rect(margin + 20, margin + 40, darkBlockWidth, 200, 'F');
doc2.setTextColor(255, 255, 255);
doc2.setFontSize(8);
doc2.setFont('helvetica', 'normal');
doc2.text('Data:', margin + 35, margin + 70);
doc2.setFontSize(10);
doc2.text('23 de setembro, 2026', margin + 35, margin + 85);
doc2.setFontSize(8);
doc2.text('Validade:', margin + 35, margin + 110);
doc2.setFontSize(10);
doc2.text('15 dias', margin + 35, margin + 125);
doc2.setDrawColor(100, 116, 139);
doc2.line(margin + 35, margin + 145, margin + 55, margin + 145);
doc2.setFontSize(8);
doc2.text('Para:', margin + 35, margin + 165);
doc2.setFontSize(10);
doc2.text('João da Silva', margin + 35, margin + 180, { maxWidth: 110 });

// Simulated QR code square (we don't have async fetch in this sync mock script, so we'll just draw a black box to represent it, but wait! I can draw a grid!)
doc2.setFillColor(255, 255, 255);
doc2.rect(margin + 35, margin + 20, 80, 80, 'F');
doc2.setFillColor(0, 0, 0);
doc2.rect(margin + 40, margin + 25, 70, 70, 'F');
doc2.setFillColor(255, 255, 255);
doc2.rect(margin + 45, margin + 30, 60, 60, 'F');
doc2.setFillColor(0, 0, 0);
doc2.rect(margin + 50, margin + 35, 10, 10, 'F');
doc2.rect(margin + 80, margin + 35, 10, 10, 'F');
doc2.rect(margin + 50, margin + 65, 10, 10, 'F');
doc2.rect(margin + 75, margin + 70, 15, 15, 'F');
doc2.rect(margin + 65, margin + 50, 5, 5, 'F');

const contentStartX = margin + 180;
doc2.setFillColor(30, 41, 59);
doc2.circle(contentStartX + 10, margin + 40, 8, 'F');
doc2.setFillColor(249, 115, 22);
doc2.circle(contentStartX + 10, margin + 40, 4, 'F');
doc2.setFontSize(14);
doc2.setFont('helvetica', 'bold');
doc2.setTextColor(30, 41, 59);
doc2.text('Lucas Engenharia', contentStartX + 30, margin + 44);

doc2.setFontSize(40);
doc2.setFont('helvetica', 'bold');
doc2.text('PROPOSTA', contentStartX, margin + 100);
doc2.setFontSize(10);
doc2.setFont('helvetica', 'normal');
doc2.setTextColor(100, 116, 139);
doc2.text('Documento Formal de Prestação de Serviços', contentStartX, margin + 115);

doc2.setFillColor(248, 250, 252);
doc2.rect(contentStartX, margin + 130, pageWidth - contentStartX - margin - 20, 50, 'F');
doc2.setFontSize(8);
doc2.text('Obra:', contentStartX + 15, margin + 150);
doc2.text('Contato:', contentStartX + 120, margin + 150);
doc2.setFontSize(10);
doc2.setFont('helvetica', 'bold');
doc2.setTextColor(30, 41, 59);
doc2.text('Reforma Residencial', contentStartX + 15, margin + 165);
doc2.text('(11) 99999-9999', contentStartX + 120, margin + 165);

autoTable.default(doc2, {
  startY: margin + 260,
  head: [['DESCRIÇÃO DO ITEM', 'QTD', 'VALOR UNIT', 'SUBTOTAL']],
  body: [
    ['Projeto Arquitetônico', '1', 'R$ 5.000,00', 'R$ 5.000,00'],
    ['Acompanhamento Técnico', '1', 'R$ 2.500,00', 'R$ 2.500,00']
  ],
  theme: 'plain',
  headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
  bodyStyles: { textColor: [55, 65, 81], fontSize: 9, cellPadding: { top: 10, bottom: 10, left: 6, right: 6 } },
  alternateRowStyles: { fillColor: [255, 255, 255] },
  columnStyles: { 0: { cellWidth: 'auto' }, 3: { halign: 'right', fontStyle: 'bold' } },
  margin: { left: margin + 20, right: margin + 20 }
});

const currentY2 = doc2.lastAutoTable.finalY + 20;
doc2.setFontSize(10);
doc2.setFont('helvetica', 'normal');
doc2.setTextColor(30, 41, 59);
const totalsX = pageWidth - margin - 150;
doc2.text('Subtotal:', totalsX, currentY2);
doc2.text('R$ 7.500,00', pageWidth - margin - 20, currentY2, { align: 'right' });
doc2.text('Descontos:', totalsX, currentY2 + 15);
doc2.text('R$ 0,00', pageWidth - margin - 20, currentY2 + 15, { align: 'right' });
doc2.setFont('helvetica', 'bold');
doc2.setFontSize(12);
doc2.text('Total:', totalsX, currentY2 + 35);
doc2.text('R$ 7.500,00', pageWidth - margin - 20, currentY2 + 35, { align: 'right' });

const footerY = pageHeight - margin - 80;
doc2.setFontSize(8);
doc2.setFont('helvetica', 'normal');
doc2.setTextColor(148, 163, 184);
doc2.text('TERMOS E CONDIÇÕES', margin + 20, footerY);
doc2.setTextColor(100, 116, 139);
doc2.text('Aprovado mediante assinatura ou aceite via WhatsApp.', margin + 20, footerY + 15);
doc2.text('Pagamento via: PIX', margin + 20, footerY + 25);

doc2.setFontSize(8);
doc2.setFont('helvetica', 'italic');
doc2.setTextColor(200, 200, 200);
doc2.text('Gerado via CentralObra Premium', pageWidth - 200, pageHeight - 15);

doc2.save('quote_preview.pdf');

console.log('PDFs generated successfully');
