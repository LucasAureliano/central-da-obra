const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const fs = require('fs');

const doc = new jsPDF('p', 'pt', 'a4');
const margin = 40;
const pageWidth = doc.internal.pageSize.getWidth();

// 1. Capa
doc.setFillColor(37, 99, 235);
doc.rect(0, 0, pageWidth, 250, 'F');
doc.setTextColor(255, 255, 255);
doc.setFontSize(28);
doc.setFont('helvetica', 'bold');
doc.text('PROPOSTA COMERCIAL', margin, 150);

doc.setFontSize(14);
doc.setFont('helvetica', 'normal');
doc.text('Eng. Lucas Aureliano', margin, 190);
doc.text('Construção Residencial - Alphaville', margin, 215);

// 2. Dados
doc.setTextColor(17, 24, 39);
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text('EMITIDO POR:', margin, 290);
doc.setFontSize(11);
doc.text('Eng. Lucas Aureliano', margin, 310);
doc.setFont('helvetica', 'normal');
doc.text('CREA: 123456/SP', margin, 325);

const rightX = margin + 250;
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text('PREPARADO PARA:', rightX, 290);
doc.setFontSize(11);
doc.text('João da Silva', rightX, 310);
doc.setFont('helvetica', 'normal');
doc.text('Endereço: Alphaville, Lote 45', rightX, 325);

// 3. Tabela
const head = [['Descrição', 'Unid', 'Qtd', 'Valor Unit.', 'Total']];
const body = [
  ['Levantamento de Alvenaria', 'm²', '150', 'R$ 45,00', 'R$ 6.750,00'],
  ['Concretagem de Laje', 'm³', '12', 'R$ 450,00', 'R$ 5.400,00'],
  ['Instalação Hidráulica', 'GL', '1', 'R$ 3.500,00', 'R$ 3.500,00'],
  ['Instalação Elétrica', 'GL', '1', 'R$ 4.200,00', 'R$ 4.200,00'],
];

doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.setTextColor(37, 99, 235);
doc.text('Serviços e Materiais', margin, 380);

doc.autoTable({
  startY: 400,
  head: head,
  body: body,
  theme: 'plain',
  headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
  bodyStyles: { textColor: [17, 24, 39], fontSize: 10, cellPadding: 8 },
  alternateRowStyles: { fillColor: [249, 250, 251] },
  columnStyles: {
    0: { cellWidth: 'auto' },
    4: { halign: 'right', fontStyle: 'bold' }
  },
  margin: { left: margin, right: margin }
});

const finalY = doc.lastAutoTable.finalY + 30;
doc.setFontSize(16);
doc.setTextColor(37, 99, 235);
doc.text('Total da Proposta: R$ 19.850,00', margin, finalY);

doc.save('sample_proposal.pdf');
console.log('PDF generated');
