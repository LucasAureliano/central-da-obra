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

async function drawDarkFooter(doc: jsPDF, isPremium: boolean = false, profileName?: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const footerHeight = 100;
  
  doc.setFillColor(30, 41, 59); // Dark blue-gray
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
}

async function drawAppLogo(doc: jsPDF, x: number, y: number, isDarkBackground: boolean = false) {
  const logoBase64 = await fetchImageAsBase64('/logo-centralobra.png');
  if (logoBase64) {
    // Drawn as a perfect 22x22 square, and explicitly as PNG for transparency
    doc.addImage(logoBase64, 'PNG', x, y, 22, 22, undefined, 'FAST');
  }
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isDarkBackground ? 255 : 30, isDarkBackground ? 255 : 41, isDarkBackground ? 255 : 59);
  doc.text('CentralObra', x + 28, y + 16);
  doc.setTextColor(249, 115, 22);
  doc.text('.', x + 28 + doc.getTextWidth('CentralObra'), y + 16);
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
    await drawAppLogo(doc, pageWidth - margin - 120, 48, false);
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
          ${m.quantity} ,
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

  await drawDarkFooter(doc, isPremium, userName);
  
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pdfLink = document.createElement('a');
  pdfLink.href = pdfUrl;
  pdfLink.download = calculo_materiais_.pdf;
  document.body.appendChild(pdfLink);
  pdfLink.click();
  document.body.removeChild(pdfLink);
  URL.revokeObjectURL(pdfUrl);
}

// ============================================================================
// 2. ORÇAMENTO PRESTADOR (Proposta Comercial)
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
  const dataHoje = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Dark Block on the left
  const darkBlockWidth = 170;
  doc.setFillColor(30, 41, 59); // Dark Gray
  doc.rect(margin, margin, darkBlockWidth, 290, 'F'); 
  
  if (!isPremium) {
    await drawAppLogo(doc, margin + 15, margin + 20, true);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Data:', margin + 20, margin + 65);
  doc.setFontSize(10);
  doc.text(dataHoje, margin + 20, margin + 80);
  
  doc.setFontSize(8);
  doc.text('Validade:', margin + 20, margin + 100);
  doc.setFontSize(10);
  doc.text(conditions.validade || '15 dias', margin + 20, margin + 115);
  
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(1);
  doc.line(margin + 20, margin + 130, margin + darkBlockWidth - 20, margin + 130);
  
  doc.setFontSize(8);
  doc.text('Para:', margin + 20, margin + 150);
  doc.setFontSize(10);
  doc.text(client.name || 'Cliente', margin + 20, margin + 165, { maxWidth: darkBlockWidth - 40 });
  
  doc.setFontSize(8);
  let clientContactY = margin + 180;
  if (client.phone) { doc.text(client.phone, margin + 20, clientContactY); clientContactY += 12; }
  if (client.email) { doc.text(client.email, margin + 20, clientContactY, { maxWidth: darkBlockWidth - 40 }); }

  // QR Code Box
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 20, margin + 205, 70, 70, 'F'); 
  
  const qrUrl = (isPremium && profile.customQrLink) ? profile.customQrLink : https://centralobra.com.br/p/;
  const qrApi = https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=;
  const qrBase64 = await fetchImageAsBase64(qrApi);
  if (qrBase64) {
    doc.addImage(qrBase64, 'PNG', margin + 25, margin + 210, 60, 60, undefined, 'FAST');
  }

  // Header Right Side
  const contentStartX = margin + darkBlockWidth + 30;

  // Company Name / Proposta
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(249, 115, 22); // Orange detail
  doc.text(profile.name || 'Empresa / Profissional', contentStartX, margin + 60);

  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('PROPOSTA', contentStartX, margin + 95);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Documento Formal de Prestação de Serviços', contentStartX, margin + 110);

  // Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.rect(contentStartX, margin + 130, pageWidth - contentStartX - margin, 50, 'FD');

  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(3);
  doc.line(contentStartX, margin + 130, contentStartX, margin + 180);

  doc.setFontSize(8);
  doc.text('Obra:', contentStartX + 15, margin + 150);
  doc.text('Contato:', contentStartX + 150, margin + 150);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(workData?.name || '-', contentStartX + 15, margin + 165, { maxWidth: 120 });
  doc.text(profile?.phone || '-', contentStartX + 150, margin + 165);

  let currentY = margin + 310;

  // TABLE
  const itemsBody = [];
  if (services && services.length > 0) {
    itemsBody.push(...services.map((s: any) => [s.description, s.quantity, brlFormatter.format(s.unitPrice), brlFormatter.format(s.quantity * s.unitPrice)]));
  }
  if (materials && materials.length > 0) {
    itemsBody.push(...materials.map((m: any) => [m.description, m.quantity, brlFormatter.format(m.unitPrice), brlFormatter.format(m.quantity * m.unitPrice)]));
  }

  if (itemsBody.length > 0) {
    autoTable(doc, {
      startY: currentY,
      head: [['DESCRIÇÃO DO ITEM', 'QTD', 'VALOR UNIT', 'SUBTOTAL']],
      body: itemsBody,
      theme: 'plain',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10, cellPadding: 8 }, 
      bodyStyles: { fillColor: [255, 255, 255], textColor: [55, 65, 81], fontSize: 9, cellPadding: { top: 12, bottom: 12, left: 8, right: 8 }, lineColor: [226, 232, 240], lineWidth: { bottom: 0.5, top: 0.5 } },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'bold', textColor: [30, 41, 59] },
        3: { halign: 'right', fontStyle: 'bold', textColor: [249, 115, 22] } 
      },
      margin: { left: margin, right: margin }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 30;

    // Totals block on the right
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    
    const totalsX = pageWidth - margin - 150;
    doc.text('Subtotal:', totalsX, currentY);
    doc.setTextColor(30, 41, 59);
    doc.text(brlFormatter.format(totals.subtotal || 0), pageWidth - margin, currentY, { align: 'right' });
    
    doc.setTextColor(100, 116, 139);
    doc.text('Descontos:', totalsX, currentY + 15);
    doc.setTextColor(30, 41, 59);
    doc.text(brlFormatter.format(totals.discount || 0), pageWidth - margin, currentY + 15, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text('Total:', totalsX, currentY + 40);
    doc.setTextColor(249, 115, 22);
    doc.text(brlFormatter.format(totals.total || 0), pageWidth - margin, currentY + 40, { align: 'right' });
  }

  await drawDarkFooter(doc, isPremium, profile.name);

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pdfLink = document.createElement('a');
  pdfLink.href = pdfUrl;
  pdfLink.download = proposta_comercial_.pdf;
  document.body.appendChild(pdfLink);
  pdfLink.click();
  document.body.removeChild(pdfLink);
  URL.revokeObjectURL(pdfUrl);
}

export async function generateBudgetPDF(args: any) { return generateCommercialQuotePDF(args); }
export async function generateGeneralReport(args: any) {}
