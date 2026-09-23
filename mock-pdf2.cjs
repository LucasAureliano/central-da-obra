const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');
const fs = require('fs');

const logoBuffer = fs.readFileSync('public/logo-centralobra.png');
const logoBase64 = 'data:image/png;base64,' + logoBuffer.toString('base64');

const drawDarkFooter = (doc, isPremium) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const footerHeight = 100;
  
  doc.setFillColor(30, 41, 59);
  doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Termos & Condições', margin, pageHeight - footerHeight + 25);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Documento gerado automaticamente pelo sistema.', margin, pageHeight - footerHeight + 40);
  doc.text('Valores sujeitos a variações do mercado e de projeto.', margin, pageHeight - footerHeight + 52);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('CentralObra App', pageWidth / 2 + 50, pageHeight - footerHeight + 25);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Gestão inteligente para sua obra.', pageWidth / 2 + 50, pageHeight - footerHeight + 40);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(180, 180, 180);
  const text = isPremium 
    ? 'Gerado via CentralObra Premium - www.centralobra.com.br' 
    : 'Gerado gratuitamente por CentralObra - www.centralobra.com.br';
  doc.text(text, pageWidth - 280, pageHeight - 15);
};


// ==========================================
// 1. CÁLCULO DE MATERIAIS
// ==========================================
const doc1 = new jsPDF('p', 'pt', 'a4');
const margin = 40;
const pageWidth = doc1.internal.pageSize.getWidth();
const pageHeight = doc1.internal.pageSize.getHeight();

doc1.setFontSize(24);
doc1.setFont('helvetica', 'bold');
doc1.setTextColor(30, 41, 59);
doc1.text('CÁLCULO DE MATERIAIS', margin, 60);

doc1.setFontSize(10);
doc1.setFont('helvetica', 'normal');
doc1.setTextColor(100, 116, 139);
doc1.text('23 de setembro de 2026', margin, 78);

const imgWidth = 140;
const imgHeight = 35;
doc1.addImage(logoBase64, 'PNG', pageWidth - margin - imgWidth, 40, imgWidth, imgHeight);

// Accent line
doc1.setDrawColor(249, 115, 22);
doc1.setLineWidth(2);
doc1.line(margin, 95, pageWidth - margin, 95);

let currentY = 120;
doc1.setFontSize(9);
doc1.setFont('helvetica', 'bold');
doc1.setTextColor(30, 41, 59);
doc1.text('Para:', margin, currentY);
doc1.setFontSize(11);
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
    ['Brita 1', '8 m³', 'R$ 130,00', 'R$ 1.040,00'],
    ['Tijolo Baiano', '3.000 un', 'R$ 0,90', 'R$ 2.700,00'],
    ['Cimento Colante ACIII', '10 sacos', 'R$ 48,00', 'R$ 480,00']
  ],
  theme: 'plain',
  headStyles: { textColor: [255, 255, 255], fillColor: [249, 115, 22], fontStyle: 'bold', fontSize: 10, cellPadding: 8 },
  bodyStyles: { textColor: [71, 85, 105], fontSize: 9, cellPadding: 8, lineColor: [226, 232, 240], lineWidth: { bottom: 1 } },
  alternateRowStyles: { fillColor: [248, 250, 252] },
  columnStyles: { 0: { cellWidth: 'auto', fontStyle: 'bold', textColor: [30, 41, 59] }, 1: { halign: 'center' }, 2: { halign: 'right' }, 3: { halign: 'right', fontStyle: 'bold', textColor: [30, 41, 59] } },
  margin: { left: margin, right: margin }
});

drawDarkFooter(doc1, false);
doc1.save('materials_preview.pdf');


// ==========================================
// 2. ORÇAMENTO PRESTADOR (Proposta Comercial)
// ==========================================
const doc2 = new jsPDF('p', 'pt', 'a4');
doc2.setFillColor(250, 250, 250);
doc2.rect(0, 0, pageWidth, pageHeight, 'F');

const darkBlockWidth = 160;
doc2.setFillColor(30, 41, 59);
doc2.rect(margin, margin, darkBlockWidth, 240, 'F');

doc2.setTextColor(255, 255, 255);
doc2.setFontSize(8);
doc2.setFont('helvetica', 'normal');
doc2.text('Data:', margin + 20, margin + 30);
doc2.setFontSize(10);
doc2.text('23/09/2026', margin + 20, margin + 45);

doc2.setFontSize(8);
doc2.text('Validade:', margin + 20, margin + 65);
doc2.setFontSize(10);
doc2.text('15 dias', margin + 20, margin + 80);

doc2.setDrawColor(100, 116, 139);
doc2.line(margin + 20, margin + 95, margin + darkBlockWidth - 20, margin + 95);

doc2.setFontSize(8);
doc2.text('Para:', margin + 20, margin + 115);
doc2.setFontSize(10);
doc2.text('João da Silva', margin + 20, margin + 130, { maxWidth: darkBlockWidth - 40 });

doc2.setFontSize(8);
doc2.text('(11) 98888-7777', margin + 20, margin + 145);

// QR Code clearly separated at the bottom of the dark block
doc2.setFillColor(255, 255, 255);
doc2.rect(margin + 20, margin + 180, 60, 60, 'F');
doc2.setFillColor(0, 0, 0);
doc2.rect(margin + 22, margin + 182, 56, 56, 'F');
doc2.setFillColor(255, 255, 255);
doc2.rect(margin + 27, margin + 187, 46, 46, 'F');
doc2.setFillColor(0, 0, 0);
doc2.rect(margin + 32, margin + 192, 8, 8, 'F');
doc2.rect(margin + 58, margin + 192, 8, 8, 'F');
doc2.rect(margin + 32, margin + 218, 8, 8, 'F');
doc2.rect(margin + 50, margin + 205, 5, 5, 'F');

const contentStartX = margin + darkBlockWidth + 30;

// Draw Logo on the Right
doc2.addImage(logoBase64, 'PNG', pageWidth - margin - 120, margin, 120, 35);

doc2.setFontSize(14);
doc2.setFont('helvetica', 'bold');
doc2.setTextColor(249, 115, 22);
doc2.text('Lucas Engenharia', contentStartX, margin + 60);

doc2.setFontSize(32);
doc2.setFont('helvetica', 'bold');
doc2.setTextColor(30, 41, 59);
doc2.text('PROPOSTA', contentStartX, margin + 95);
doc2.setFontSize(10);
doc2.setFont('helvetica', 'normal');
doc2.setTextColor(100, 116, 139);
doc2.text('Documento Formal de Prestação de Serviços', contentStartX, margin + 110);

doc2.setFillColor(255, 255, 255);
doc2.setDrawColor(226, 232, 240);
doc2.setLineWidth(1);
doc2.rect(contentStartX, margin + 130, pageWidth - contentStartX - margin, 50, 'FD');

doc2.setDrawColor(249, 115, 22);
doc2.setLineWidth(3);
doc2.line(contentStartX, margin + 130, contentStartX, margin + 180);

doc2.setFontSize(8);
doc2.text('Obra:', contentStartX + 15, margin + 150);
doc2.text('Contato:', contentStartX + 150, margin + 150);
doc2.setFontSize(10);
doc2.setFont('helvetica', 'bold');
doc2.setTextColor(30, 41, 59);
doc2.text('Reforma Residencial', contentStartX + 15, margin + 165, { maxWidth: 120 });
doc2.text('(11) 99999-9999', contentStartX + 150, margin + 165);

autoTable.default(doc2, {
  startY: margin + 300,
  head: [['DESCRIÇÃO DO ITEM', 'QTD', 'VALOR UNIT', 'SUBTOTAL']],
  body: [
    ['Projeto Arquitetônico Residencial (150m²)', '1', 'R$ 5.000,00', 'R$ 5.000,00'],
    ['Acompanhamento Técnico Mensal', '2', 'R$ 1.500,00', 'R$ 3.000,00'],
    ['Levantamento Topográfico', '1', 'R$ 800,00', 'R$ 800,00'],
    ['Projeto Elétrico e Hidráulico', '1', 'R$ 3.200,00', 'R$ 3.200,00']
  ],
  theme: 'plain',
  headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10, cellPadding: 8 },
  bodyStyles: { textColor: [55, 65, 81], fontSize: 9, cellPadding: { top: 12, bottom: 12, left: 8, right: 8 }, lineColor: [226, 232, 240], lineWidth: { bottom: 1 } },
  alternateRowStyles: { fillColor: [248, 250, 252] },
  columnStyles: { 0: { cellWidth: 'auto', fontStyle: 'bold', textColor: [30, 41, 59] }, 3: { halign: 'right', fontStyle: 'bold', textColor: [249, 115, 22] } },
  margin: { left: margin, right: margin }
});

const currentY2 = doc2.lastAutoTable.finalY + 30;
doc2.setFontSize(10);
doc2.setFont('helvetica', 'normal');
doc2.setTextColor(100, 116, 139);
const totalsX = pageWidth - margin - 150;
doc2.text('Subtotal:', totalsX, currentY2);
doc2.setTextColor(30, 41, 59);
doc2.text('R$ 12.000,00', pageWidth - margin, currentY2, { align: 'right' });
doc2.setTextColor(100, 116, 139);
doc2.text('Descontos:', totalsX, currentY2 + 15);
doc2.setTextColor(30, 41, 59);
doc2.text('R$ 0,00', pageWidth - margin, currentY2 + 15, { align: 'right' });
doc2.setFont('helvetica', 'bold');
doc2.setFontSize(14);
doc2.setTextColor(30, 41, 59);
doc2.text('Total:', totalsX, currentY2 + 40);
doc2.setTextColor(249, 115, 22);
doc2.text('R$ 12.000,00', pageWidth - margin, currentY2 + 40, { align: 'right' });

drawDarkFooter(doc2, true);

doc2.save('quote_preview.pdf');
console.log('PDFs generated successfully');
