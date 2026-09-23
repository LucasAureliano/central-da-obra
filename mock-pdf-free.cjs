const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');
const fs = require('fs');

const logoBuffer = fs.readFileSync('public/assets/logo_light_3d.jpg');
const logoBase64 = 'data:image/jpeg;base64,' + logoBuffer.toString('base64');

const drawDarkFooter = (doc, isPremium, profileName) => {
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
  doc.text(isPremium ? (profileName || 'Profissional') : 'CentralObra App', pageWidth / 2 + 50, pageHeight - footerHeight + 25);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(isPremium ? 'Gestão e Orçamentos' : 'Gestão inteligente para sua obra.', pageWidth / 2 + 50, pageHeight - footerHeight + 40);

  if (!isPremium) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(180, 180, 180);
    const text = 'Gerado por CentralObra - www.centralobra.com.br';
    doc.text(text, pageWidth - margin - doc.getTextWidth(text), pageHeight - 15);
  }
};

const drawAppLogo = (doc, x, y) => {
  doc.addImage(logoBase64, 'JPEG', x, y, 22, 22);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('CentralObra', x + 28, y + 16);
  doc.setTextColor(249, 115, 22);
  doc.text('.', x + 28 + doc.getTextWidth('CentralObra'), y + 16);
};


// ==========================================
// 2. ORÇAMENTO PRESTADOR (Proposta Comercial) - FREE VERSION
// ==========================================
const doc2 = new jsPDF('p', 'pt', 'a4');
const margin = 40;
const pageWidth = doc2.internal.pageSize.getWidth();
const pageHeight = doc2.internal.pageSize.getHeight();
const isPremium2 = false; // MUDADO PARA FALSE

doc2.setFillColor(255, 255, 255);
doc2.rect(0, 0, pageWidth, pageHeight, 'F');

const darkBlockWidth = 170; // Slightly wider for QR code to breathe
doc2.setFillColor(30, 41, 59);
doc2.rect(margin, margin, darkBlockWidth, 260, 'F');

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

doc2.setDrawColor(71, 85, 105);
doc2.setLineWidth(1);
doc2.line(margin + 20, margin + 95, margin + darkBlockWidth - 20, margin + 95);

doc2.setFontSize(8);
doc2.text('Para:', margin + 20, margin + 115);
doc2.setFontSize(10);
doc2.text('João da Silva', margin + 20, margin + 130, { maxWidth: darkBlockWidth - 40 });

doc2.setFontSize(8);
doc2.text('(11) 98888-7777', margin + 20, margin + 145);

doc2.setFillColor(255, 255, 255);
doc2.rect(margin + 20, margin + 190, 70, 70, 'F'); 

doc2.setFillColor(0, 0, 0);
doc2.rect(margin + 22, margin + 192, 66, 66, 'F');
doc2.setFillColor(255, 255, 255);
doc2.rect(margin + 27, margin + 197, 56, 56, 'F');
doc2.setFillColor(0, 0, 0);
doc2.rect(margin + 32, margin + 202, 10, 10, 'F');
doc2.rect(margin + 68, margin + 202, 10, 10, 'F');
doc2.rect(margin + 32, margin + 238, 10, 10, 'F');
doc2.rect(margin + 55, margin + 225, 6, 6, 'F');

const contentStartX = margin + darkBlockWidth + 30;

if (!isPremium2) {
  drawAppLogo(doc2, pageWidth - margin - 120, margin + 40);
}

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

doc2.setFillColor(248, 250, 252);
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
  bodyStyles: { fillColor: [255, 255, 255], textColor: [55, 65, 81], fontSize: 9, cellPadding: { top: 12, bottom: 12, left: 8, right: 8 }, lineColor: [226, 232, 240], lineWidth: { bottom: 0.5, top: 0.5 } },
  alternateRowStyles: { fillColor: [241, 245, 249] }, // Grey zebra
  columnStyles: { 0: { cellWidth: 'auto', fontStyle: 'bold', textColor: [30, 41, 59] }, 3: { halign: 'right', fontStyle: 'bold', textColor: [249, 115, 22] } },
  margin: { left: margin, right: margin }
});

const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
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

drawDarkFooter(doc2, isPremium2, 'Lucas Engenharia');
doc2.save('quote_preview_free.pdf');
console.log('PDFs generated successfully');
