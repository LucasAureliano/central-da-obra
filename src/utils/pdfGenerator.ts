import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './formatters';

const brlFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

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

export function applyGlobalWatermark(doc: jsPDF, isPremium: boolean = false) {}
export function drawHeader(doc: any, userName: string, userEmail: string, workName: string) {}
export function drawFooter(doc: any) {}

async function drawAppLogo(doc: jsPDF, x: number, y: number) {
  const logoBase64 = await fetchImageAsBase64('/logo-centralobra.png');
  if (logoBase64) {
    doc.addImage(logoBase64, 'PNG', x, y - 14, 20, 20, undefined, 'FAST');
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('CentralObra', x + 26, y);
  doc.setTextColor(249, 115, 22);
  doc.text('.', x + 26 + doc.getTextWidth('CentralObra'), y);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Gestão Inteligente para sua Obra', x + 26, y + 10);
}

// ============================================================================
// 1. CÁLCULO DE MATERIAIS
// ============================================================================
export async function generateCalculationPDF({
  title,
  results,
  prices,
  workName,
  userName,
  isPremium = false
}: {
  title: string;
  results: any;
  prices: any;
  workName?: string;
  userName?: string;
  isPremium?: boolean;
}) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const dataHoje = new Date().toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' });

  // HEADER
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(title.toUpperCase(), margin, 60);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(dataHoje, margin, 78);

  if (!isPremium) {
    await drawAppLogo(doc, pageWidth - margin - 120, 48);
  }

  // Accent line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(margin, 95, pageWidth - margin, 95);

  // INFO SECTION
  let currentY = 120;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Para:', margin, currentY);
  doc.setFontSize(11);
  doc.text(userName || 'Usuário', margin, currentY + 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Obra:', margin, currentY + 28);
  doc.text(workName || 'Nenhuma Obra Vinculada', margin, currentY + 40);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Emitido por:', pageWidth / 2, currentY);
  doc.setFontSize(11);
  doc.text(isPremium ? (userName || 'Profissional') : 'CentralObra App', pageWidth / 2, currentY + 14);

  currentY += 80;

  // TABLES
  if (results.materials && results.materials.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['DESCRIÇÃO DO ITEM', 'QTD', 'VALOR UNIT', 'TOTAL']],
      body: results.materials.map((m: any) => {
        const unitPrice = prices && prices[m.name]?.price ? prices[m.name].price : 0;
        const total = unitPrice * m.quantity;
        return [
          { content: m.name, styles: { fontStyle: 'bold', textColor: [30, 41, 59] } },
          `${m.quantity} ${m.unit}`,
          unitPrice > 0 ? brlFormatter.format(unitPrice) : '-',
          total > 0 ? brlFormatter.format(total) : '-'
        ];
      }),
      theme: 'plain',
      headStyles: { textColor: [255, 255, 255], fillColor: [30, 41, 59], fontStyle: 'bold', fontSize: 9, cellPadding: 8 },
      bodyStyles: { fillColor: [255, 255, 255], textColor: [71, 85, 105], fontSize: 9, cellPadding: 8, lineColor: [226, 232, 240], lineWidth: { bottom: 0.5, top: 0.5 } },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right', fontStyle: 'bold', textColor: [30, 41, 59] }
      },
      margin: { left: margin, right: margin }
    });
  }

  // Footer for calculation
  const pageHeight2 = doc.internal.pageSize.getHeight();
  const footerHeight = 100;
  
  doc.setFillColor(30, 41, 59); // Dark blue-gray
  doc.rect(0, pageHeight2 - footerHeight, pageWidth, footerHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Termos & Condições', margin, pageHeight2 - footerHeight + 25);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Documento gerado automaticamente pelo sistema.', margin, pageHeight2 - footerHeight + 40);
  doc.text('Valores sujeitos a variações do mercado e de projeto.', margin, pageHeight2 - footerHeight + 52);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(isPremium ? (userName || 'Profissional') : 'CentralObra App', pageWidth / 2 + 50, pageHeight2 - footerHeight + 25);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(isPremium ? 'Gestão e Orçamentos' : 'Gestão inteligente para sua obra.', pageWidth / 2 + 50, pageHeight2 - footerHeight + 40);

  if (!isPremium) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(180, 180, 180);
    const text = 'Gerado por CentralObra - www.centralobra.com.br';
    doc.text(text, pageWidth - margin - doc.getTextWidth(text), pageHeight2 - 15);
  }

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pdfLink = document.createElement('a');
  pdfLink.href = pdfUrl;
  pdfLink.download = `calculo_materiais_${new Date().getTime()}.pdf`;
  document.body.appendChild(pdfLink);
  pdfLink.click();
  document.body.removeChild(pdfLink);
  URL.revokeObjectURL(pdfUrl);
}

// ============================================================================
// 2. ORÇAMENTO PRESTADOR (Proposta Comercial) - TEMPLATE BLACKWOOD
// ============================================================================
export async function generateCommercialQuotePDF({
  client,
  workData,
  services,
  materials,
  labor,
  costs,
  conditions,
  totals,
  profile,
  isPremium = false
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
  isPremium?: boolean;
}) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  
  const rawDueDate = conditions.validade || '15 dias';

  // Page Background (Light Gray)
  doc.setFillColor(248, 249, 250);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 1. Dark Block (Left Column)
  const darkBlockX = margin;
  const darkBlockY = margin + 50; 
  const darkBlockW = 160;
  const darkBlockH = 260;
  doc.setFillColor(42, 42, 42); 
  doc.rect(darkBlockX, darkBlockY, darkBlockW, darkBlockH, 'F');

  // 2. QR Code Box (Overlapping top-left)
  const qrBoxSize = 90;
  const qrBoxX = darkBlockX + 35;
  const qrBoxY = margin;
  doc.setFillColor(255, 255, 255);
  doc.rect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 'F');
  
  const qrUrl = (isPremium && profile?.customQrLink) ? profile.customQrLink : `https://centralobra.com.br/p/${profile?.id || 'profissional'}`;
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent(qrUrl)}`;
  const qrBase64 = await fetchImageAsBase64(qrApi);
  if (qrBase64) {
    // scale to fit inside 80x80 box
    doc.addImage(qrBase64, 'PNG', qrBoxX + 5, qrBoxY + 5, 80, 80, undefined, 'FAST');
  }

  // Text inside Dark Block
  doc.setTextColor(255, 255, 255);
  let currentLeftY = darkBlockY + 70;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Data :', darkBlockX + 20, currentLeftY);
  doc.setFont('helvetica', 'normal');
  doc.text(dataHoje, darkBlockX + 20, currentLeftY + 14);

  currentLeftY += 40;
  doc.setFont('helvetica', 'bold');
  doc.text('Validade :', darkBlockX + 20, currentLeftY);
  doc.setFont('helvetica', 'normal');
  doc.text(rawDueDate, darkBlockX + 20, currentLeftY + 14);

  currentLeftY += 25;
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(1);
  doc.line(darkBlockX + 20, currentLeftY, darkBlockX + 40, currentLeftY);

  currentLeftY += 25;
  doc.setFont('helvetica', 'bold');
  doc.text('Para', darkBlockX + 20, currentLeftY);
  doc.setFont('helvetica', 'normal');
  doc.text(client.name || 'Cliente', darkBlockX + 20, currentLeftY + 14);
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  if (client.phone) doc.text(client.phone, darkBlockX + 20, currentLeftY + 30);
  if (client.email) doc.text(client.email, darkBlockX + 20, currentLeftY + 42, { maxWidth: darkBlockW - 40 });

  // 3. Right Header Area
  const rightContentX = darkBlockX + darkBlockW + 40;
  let rightContentY = margin + 30;

  if (!isPremium) {
    await drawAppLogo(doc, rightContentX, rightContentY);
  } else {
    // Professional's Company Branding
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(42, 42, 42);
    doc.text(profile?.name || 'Profissional / Empresa', rightContentX, rightContentY);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(profile?.specialty || 'Serviços de Engenharia e Construção', rightContentX, rightContentY + 10);
  }

  rightContentY += 60;
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(42, 42, 42);
  doc.text('PROPOSTA', rightContentX, rightContentY);

  rightContentY += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('Documento Formal de Prestação de Serviços', rightContentX, rightContentY);

  rightContentY += 20;
  const infoBoxW = pageWidth - rightContentX - margin;
  doc.setFillColor(255, 255, 255);
  doc.rect(rightContentX, rightContentY, infoBoxW, 50, 'F');

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Contato:', rightContentX + 20, rightContentY + 20);
  doc.text('Obra:', rightContentX + 130, rightContentY + 20);

  doc.setFontSize(9);
  doc.setTextColor(42, 42, 42);
  doc.text(profile?.phone || '( ) -', rightContentX + 20, rightContentY + 34);
  doc.text(workData?.name || 'Projeto', rightContentX + 130, rightContentY + 34, { maxWidth: 100 });

  rightContentY += 80;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(42, 42, 42);
  doc.text('Profissional', rightContentX, rightContentY);
  doc.setLineWidth(2);
  doc.setDrawColor(42, 42, 42);
  doc.line(rightContentX, rightContentY + 8, rightContentX + 20, rightContentY + 8); 

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Empresa', rightContentX + 80, rightContentY - 10);
  doc.text('Especialidade', rightContentX + 80, rightContentY + 12);
  doc.text('CREA/CAU', rightContentX + 80, rightContentY + 24);

  doc.setTextColor(42, 42, 42);
  doc.text(profile?.companyName || profile?.name || '-', rightContentX + 150, rightContentY - 10);
  doc.text(profile?.specialty || '-', rightContentX + 150, rightContentY + 12);
  doc.text(profile?.document || '-', rightContentX + 150, rightContentY + 24);

  // 4. Table Area
  let tableY = darkBlockY + darkBlockH + 30;
  
  const itemsBody: any[] = [];
  if (services && services.length > 0) {
    itemsBody.push(...services.map((s: any) => [s.description, brlFormatter.format(s.unitPrice), `${s.quantity} ${s.unit || 'un'}`, brlFormatter.format(s.quantity * s.unitPrice)]));
  }
  if (materials && materials.length > 0) {
    itemsBody.push(...materials.map((m: any) => [m.description, brlFormatter.format(m.unitPrice), `${m.quantity} ${m.unit || 'un'}`, brlFormatter.format(m.quantity * m.unitPrice)]));
  }

  if (itemsBody.length > 0) {
    autoTable(doc, {
      startY: tableY,
      head: [['DESCRIÇÃO DO ITEM', 'VALOR UNIT', 'QTD', 'SUBTOTAL']],
      body: itemsBody,
      theme: 'plain',
      headStyles: { fillColor: [42, 42, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10, cellPadding: 12 }, 
      bodyStyles: { fillColor: [255, 255, 255], textColor: [80, 80, 80], fontSize: 9, cellPadding: 12 },
      alternateRowStyles: { fillColor: [255, 255, 255] }, 
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'normal', textColor: [80, 80, 80] },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right', fontStyle: 'bold', textColor: [42, 42, 42] } 
      },
      margin: { left: margin, right: margin }
    });
    
    let currentY = (doc as any).lastAutoTable.finalY;

    doc.setFillColor(255, 255, 255);
    doc.rect(margin, currentY, pageWidth - (margin * 2), 90, 'F');
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin + 20, currentY, pageWidth - margin - 20, currentY);

    const totalsX = pageWidth - margin - 120;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(42, 42, 42);
    
    doc.text('Subtotal', margin + 20, currentY + 30);
    doc.text(':', margin + 100, currentY + 30);
    doc.text(brlFormatter.format(totals.subtotal || 0), pageWidth - margin - 20, currentY + 30, { align: 'right' });

    doc.text('Descontos', margin + 20, currentY + 50);
    doc.text(':', margin + 100, currentY + 50);
    doc.text(brlFormatter.format(totals.discount || 0), pageWidth - margin - 20, currentY + 50, { align: 'right' });

    doc.setFontSize(11);
    doc.text('Total', margin + 20, currentY + 70);
    doc.text(':', margin + 100, currentY + 70);
    doc.text(brlFormatter.format(totals.total || 0), pageWidth - margin - 20, currentY + 70, { align: 'right' });
  }

  // 5. Footer
  const footerY = pageHeight - 60;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(150, 150, 150);
  doc.text('Valores sujeitos a variações do mercado e de projeto. Documento formal.', margin, footerY, { maxWidth: 250, lineHeightFactor: 1.5 });
  
  if (!isPremium) {
    doc.setFont('helvetica', 'italic');
    doc.text('Gerado por CentralObra - www.centralobra.com.br', margin, footerY + 15);
  }

  const footerRightX = pageWidth - margin - 150;
  if (profile?.email) {
    doc.setFillColor(42, 42, 42);
    doc.rect(footerRightX - 25, footerY - 5, 16, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('@', footerRightX - 21, footerY + 6);
    doc.setTextColor(42, 42, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('E-mail', footerRightX, footerY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(profile.email, footerRightX, footerY + 12);
  }

  if (profile?.phone || profile?.city) {
    doc.setFillColor(42, 42, 42);
    doc.rect(footerRightX - 25, footerY + 20, 16, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('+', footerRightX - 21, footerY + 31);
    doc.setTextColor(42, 42, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Contato', footerRightX, footerY + 25);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(profile.phone || profile.city || '', footerRightX, footerY + 37);
  }

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pdfLink = document.createElement('a');
  pdfLink.href = pdfUrl;
  pdfLink.download = `proposta_comercial_${new Date().getTime()}.pdf`;
  document.body.appendChild(pdfLink);
  pdfLink.click();
  document.body.removeChild(pdfLink);
  URL.revokeObjectURL(pdfUrl);
}

export async function generateBudgetPDF(args: any) { return generateCommercialQuotePDF(args); }
export async function generateGeneralReport(args: any) {}
