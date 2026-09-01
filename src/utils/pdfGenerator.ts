import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './formatters';

const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

interface PDFExportParams {
  work: any;
  user: any;
  calculations: any[];
  profile?: any;
}

const fetchImageAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return null;
  }
};

export async function drawProfessionalHeader(doc: jsPDF, documentTitle: string, subtitle?: string, responsible?: string, docNumber?: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFillColor(249, 250, 251);
  doc.rect(0, 0, pageWidth, 80, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(1);
  doc.line(0, 80, pageWidth, 80);

  const logoBase64 = await fetchImageAsBase64('/logo-centralobra.png');
  if (logoBase64) {
    const props = doc.getImageProperties(logoBase64);
    const ratio = props.width / props.height;
    const imgHeight = 26; 
    const imgWidth = imgHeight * ratio;
    doc.addImage(logoBase64, 'PNG', 40, 27, imgWidth, imgHeight);
  } else {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('CentralObra', 40, 48);
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(documentTitle, pageWidth - 40, 34, { align: 'right' });
  
  let currentY = 48;
  if (docNumber) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text(`Nº ${docNumber}`, pageWidth - 40, currentY, { align: 'right' });
    currentY += 12;
  }

  if (subtitle) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(subtitle, pageWidth - 40, currentY, { align: 'right' });
    currentY += 12;
  }
  
  if (responsible) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`Resp: ${responsible}`, pageWidth - 40, currentY, { align: 'right' });
  }

  return 110;
}

export function drawProfessionalFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('Gerado por CentralObra - centralobra.com', 40, pageHeight - 30);
  
  doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 40, pageHeight - 30, { align: 'right' });
}

export function applyGlobalWatermark(doc: jsPDF, isPro: boolean = false) {
  if (isPro) return;
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  
  doc.saveGraphicsState();
  doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
  
  doc.text('GERADO VIA CENTRALOBRA', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 45
  });
  
  doc.restoreGraphicsState();
}

export async function generateCalculationPDF({
  title,
  results,
  prices,
  workName,
  userName
}: {
  title: string;
  results: any;
  prices: any;
  workName?: string;
  userName?: string;
}) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const margin = 40;
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  let currentY = await drawProfessionalHeader(doc, 'Cálculo de Materiais', `Data: ${dataHoje}`, userName);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(title, margin, currentY);
  currentY += 20;

  if (results.mainMetrics && results.mainMetrics.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Métrica', 'Valor']],
      body: results.mainMetrics.map((m: any) => [m.label, `${m.value} ${m.unit || ''}`]),
      theme: 'plain',
      headStyles: { fillColor: [243, 244, 246], textColor: [17, 24, 39], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { textColor: [55, 65, 81], fontSize: 10, cellPadding: 6 },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: { 0: { cellWidth: 300 } },
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 25;
  }

  if (results.materials && results.materials.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['Material', 'Quantidade', 'Preço Unit. (Informado)']],
      body: results.materials.map((m: any) => [
        m.name,
        `${m.quantity} ${m.unit}`,
        prices && prices[m.name]?.price ? brlFormatter.format(prices[m.name].price) : '-'
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { textColor: [17, 24, 39], fontSize: 10, cellPadding: 6 },
      alternateRowStyles: { fillColor: [243, 248, 255] },
      margin: { left: margin, right: margin }
    });
    currentY = (doc as any).lastAutoTable.finalY + 25;
  }

  if (results.observations && results.observations.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('Observações', margin, currentY);
    currentY += 15;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    results.observations.forEach((obs: any) => {
      const lines = doc.splitTextToSize(`• ${obs}`, 500);
      doc.text(lines, margin, currentY);
      currentY += (lines.length * 12) + 4;
    });
  }

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawProfessionalFooter(doc, i, pageCount);
  }

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pdfLink = document.createElement('a');
  pdfLink.href = pdfUrl;
  pdfLink.download = `Calculo_${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  document.body.appendChild(pdfLink);
  pdfLink.click();
  document.body.removeChild(pdfLink);
  URL.revokeObjectURL(pdfUrl);
}

export async function generateCommercialQuotePDF({
  client,
  workData,
  services,
  materials,
  labor,
  costs,
  conditions,
  totals,
  profile
}: {
  client: any;
  workData: any;
  services: any[];
  materials: any[];
  labor: any;
  costs: any;
  conditions: any;
  totals: any;
  profile: any;
}) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  const docNumber = Math.floor(Math.random() * 90000) + 10000;
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  let currentY = await drawProfessionalHeader(
    doc, 
    'Orçamento Comercial', 
    `Data: ${dataHoje} | Validade: ${conditions.validade || '15 dias'}`, 
    profile?.name || 'Profissional',
    docNumber.toString()
  );

  const halfWidth = (pageWidth - (margin * 2)) / 2;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(156, 163, 175);
  doc.text('EMITIDO POR:', margin, currentY);
  
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(profile?.name || 'Profissional', margin, currentY + 14);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  let pY = currentY + 26;
  if (profile?.documentNumber) { doc.text(`CPF/CNPJ: ${profile.documentNumber}`, margin, pY); pY += 10; }
  if (profile?.phone) { doc.text(`Tel: ${profile.phone}`, margin, pY); pY += 10; }
  if (profile?.email) { doc.text(profile.email, margin, pY); }

  const rightX = margin + halfWidth + 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(156, 163, 175);
  doc.text('PREPARADO PARA:', rightX, currentY);
  
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(client.name || 'Cliente Não Informado', rightX, currentY + 14);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  let cY = currentY + 26;
  if (client.phone) { doc.text(`Tel: ${client.phone}`, rightX, cY); cY += 10; }
  if (client.email) { doc.text(client.email, rightX, cY); cY += 10; }
  if (workData?.name) { doc.text(`Obra: ${workData.name}`, rightX, cY); cY += 10; }
  if (workData?.address) { doc.text(`Endereço: ${workData.address}`, rightX, cY); }

  currentY += 80;

  const drawTable = (title: string, head: string[][], body: any[][]) => {
    if (body.length === 0) return;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(title, margin, currentY);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: head,
      body: body,
      theme: 'plain',
      headStyles: { fillColor: [249, 250, 251], textColor: [55, 65, 81], fontStyle: 'bold', fontSize: 9, lineWidth: { bottom: 1 }, lineColor: [229, 231, 235] },
      bodyStyles: { textColor: [17, 24, 39], fontSize: 9, cellPadding: 6, lineWidth: { bottom: 0.5 }, lineColor: [243, 244, 246] },
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'bold' },
        [head[0].length - 1]: { halign: 'right' }
      },
      margin: { left: margin, right: margin }
    });

    currentY = (doc as any).lastAutoTable.finalY + 25;
  };

  if (services && services.length > 0) {
    const sBody = services.map(s => [
      s.desc,
      `${s.qtd} ${s.un}`,
      brlFormatter.format(s.price),
      brlFormatter.format(s.qtd * s.price)
    ]);
    drawTable('Serviços Profissionais', [['Descrição', 'Qtd', 'V. Unitário', 'Subtotal']], sBody);
  }

  if (materials && materials.length > 0) {
    const mBody = materials.map(m => [
      m.name,
      `${m.qtd} un`,
      brlFormatter.format(m.price),
      brlFormatter.format(m.qtd * m.price)
    ]);
    drawTable('Materiais Fornecidos', [['Material', 'Qtd', 'V. Unitário', 'Subtotal']], mBody);
  }

  if ((totals?.totalLabor > 0) || (totals?.totalCosts > 0)) {
    const extraBody = [];
    if (totals.totalLabor > 0) {
      extraBody.push(['Mão de Obra Especializada', `${labor.workers} prof. x ${labor.days} dias`, brlFormatter.format(labor.dailyRate), brlFormatter.format(totals.totalLabor)]);
    }
    if (costs.freight > 0) extraBody.push(['Frete / Logística', '-', '-', brlFormatter.format(costs.freight)]);
    if (costs.displacement > 0) extraBody.push(['Deslocamento', '-', '-', brlFormatter.format(costs.displacement)]);
    if (costs.rental > 0) extraBody.push(['Locação de Equipamentos', '-', '-', brlFormatter.format(costs.rental)]);
    if (costs.others > 0) extraBody.push(['Outros Custos / Taxas', '-', '-', brlFormatter.format(costs.others)]);

    drawTable('Custos Adicionais', [['Descrição', 'Detalhe', 'Referência', 'Subtotal']], extraBody);
  }

  if (currentY > pageHeight - 220) {
    doc.addPage();
    currentY = margin;
  }

  const boxWidth = 240;
  const boxX = pageWidth - margin - boxWidth;
  
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(1);
  doc.roundedRect(boxX, currentY, boxWidth, 120, 6, 6, 'FD');

  let tY = currentY + 24;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  doc.text('Subtotal:', boxX + 16, tY);
  doc.text(brlFormatter.format(totals?.subtotal || 0), boxX + boxWidth - 16, tY, { align: 'right' });
  
  tY += 20;
  if (totals?.discountAmount > 0) {
    doc.setTextColor(239, 68, 68);
    doc.text('Desconto:', boxX + 16, tY);
    doc.text(`- ${brlFormatter.format(totals.discountAmount)}`, boxX + boxWidth - 16, tY, { align: 'right' });
    tY += 20;
  }

  doc.setDrawColor(229, 231, 235);
  doc.line(boxX + 16, tY - 6, boxX + boxWidth - 16, tY - 6);
  tY += 12;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Total Final:', boxX + 16, tY);
  
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.text(brlFormatter.format(totals?.grandTotal || 0), boxX + boxWidth - 16, tY, { align: 'right' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Condições Comerciais', margin, currentY + 16);
  
  let condY = currentY + 36;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  doc.text(`• Prazo de Execução: ${conditions?.prazo || 'A combinar'}`, margin, condY); condY += 16;
  doc.text(`• Garantia: ${conditions?.garantia || 'Padrão legal'}`, margin, condY); condY += 16;
  doc.text(`• Pagamento: ${conditions?.pagamento || 'A combinar'}`, margin, condY); condY += 16;
  if (conditions?.obs) {
    const lines = doc.splitTextToSize(`• Observações: ${conditions.obs}`, boxX - margin - 20);
    doc.text(lines, margin, condY);
  }

  const centerX = pageWidth / 2;
  let sigY = Math.max(currentY + 140, condY + 40);
  if (sigY > pageHeight - 100) {
    doc.addPage();
    sigY = margin + 40;
  }
  
  doc.setDrawColor(209, 213, 219);
  doc.line(centerX - 100, sigY, centerX + 100, sigY);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('De acordo (Assinatura do Cliente)', centerX, sigY + 16, { align: 'center' });

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawProfessionalFooter(doc, i, pageCount);
  }

  applyGlobalWatermark(doc, profile?.isPro);
  
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pdfLink = document.createElement('a');
  pdfLink.href = pdfUrl;
  pdfLink.download = `Orcamento_CentralObra.pdf`;
  document.body.appendChild(pdfLink);
  pdfLink.click();
  document.body.removeChild(pdfLink);
  URL.revokeObjectURL(pdfUrl);
}

export async function generateGeneralReport(work: any) {}
export async function generateBudgetPDF(params: any) {}
export async function drawHeader(doc: jsPDF, userName: string, _userEmail: string, workName?: string, customLogoUrl?: string | null) { await drawProfessionalHeader(doc, 'Relatório', workName, userName); return 100; }
export function drawFooter(doc: jsPDF) { drawProfessionalFooter(doc, 1, 1); }
