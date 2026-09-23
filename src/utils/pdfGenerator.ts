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

export function applyGlobalWatermark(doc: jsPDF, isPremium: boolean = false) {
  const pageCount = (doc as any).internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(200, 200, 200);
    
    const text = isPremium ? "Gerado via CentralObra Premium" : "Gerado gratuitamente por CentralObra - www.centralobra.com.br";
    const textWidth = doc.getTextWidth(text);
    
    // Bottom right watermark
    doc.text(text, pageWidth - 40 - textWidth, pageHeight - 15);
  }
}

// ============================================================================
// IMAGE 1 INSPIRATION: Materials Calculation (Minimalist, Orange Accents, Dark Footer)
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

  // HEADER (Title left, Logo right)
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59); // Dark Gray
  doc.text(title.toUpperCase(), margin, 60);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(dataHoje, margin, 78);

  // Fake Logo Block on Right
  const rightX = pageWidth - margin - 120;
  doc.setFillColor(249, 115, 22); // Orange Accent
  doc.rect(rightX, 42, 10, 30, 'F');
  doc.rect(rightX + 14, 48, 10, 24, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Central', rightX + 32, 60);
  doc.setTextColor(249, 115, 22); // Orange
  doc.text('Obra', rightX + 32 + doc.getTextWidth('Central'), 60);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Gestão Inteligente', rightX + 32, 72);

  // INFO SECTION
  let currentY = 120;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Para:', margin, currentY);
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(userName || 'Usuário', margin, currentY + 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Obra:', margin, currentY + 28);
  doc.text(workName || 'Nenhuma Obra Vinculada', margin, currentY + 40);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Emitido pelo Sistema:', pageWidth / 2, currentY);
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('CentralObra App', pageWidth / 2, currentY + 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('www.centralobra.com.br', pageWidth / 2, currentY + 28);

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
      headStyles: { textColor: [15, 23, 42], fontStyle: 'bold', fontSize: 9, lineWidth: { top: 1, bottom: 1 }, lineColor: [30, 41, 59] },
      bodyStyles: { textColor: [100, 116, 139], fontSize: 9, cellPadding: { top: 12, bottom: 12, left: 6, right: 6 } },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right', fontStyle: 'bold', textColor: [30, 41, 59] }
      },
      margin: { left: margin, right: margin }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 30;
  }

  // DRAW DARK FOOTER (Like Image 1)
  const footerHeight = 120;
  doc.setFillColor(45, 55, 72); // Very dark gray
  doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Termos & Condições.', margin, pageHeight - footerHeight + 30);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 174, 192);
  doc.text('Cálculo gerado automaticamente com base em ABNT e TCPO.', margin, pageHeight - footerHeight + 50);
  doc.text('Valores sujeitos a variações do mercado.', margin, pageHeight - footerHeight + 62);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Método de Utilização', pageWidth / 2 + 50, pageHeight - footerHeight + 30);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 174, 192);
  doc.text('Documento Exclusivo CentralObra', pageWidth / 2 + 50, pageHeight - footerHeight + 50);

  applyGlobalWatermark(doc, isPremium);
  
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
// IMAGE 2 INSPIRATION: Commercial Quote (Dark Left Block, QR Code, Professional)
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

  // Background light gray base
  doc.setFillColor(243, 244, 246);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // White content container
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, margin, pageWidth - (margin*2), pageHeight - (margin*2), 'F');

  // Dark Block on the left
  const darkBlockWidth = 140;
  doc.setFillColor(30, 41, 59); // Dark Gray
  doc.rect(margin + 20, margin + 40, darkBlockWidth, 200, 'F');
  
  // Date and To inside Dark Block
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Data:', margin + 35, margin + 70);
  doc.setFontSize(10);
  doc.text(dataHoje, margin + 35, margin + 85);
  
  doc.setFontSize(8);
  doc.text('Validade:', margin + 35, margin + 110);
  doc.setFontSize(10);
  doc.text(conditions.validade || '15 dias', margin + 35, margin + 125);
  
  doc.setDrawColor(100, 116, 139);
  doc.line(margin + 35, margin + 145, margin + 55, margin + 145);
  
  doc.setFontSize(8);
  doc.text('Para:', margin + 35, margin + 165);
  doc.setFontSize(10);
  doc.text(client.name || 'Cliente', margin + 35, margin + 180, { maxWidth: 110 });
  doc.setFontSize(8);
  if (client.phone) doc.text(client.phone, margin + 35, margin + 210);
  if (client.email) doc.text(client.email, margin + 35, margin + 225, { maxWidth: 110 });

  // QR Code on top of Dark Block
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 35, margin + 20, 80, 80, 'F'); // White Box for QR Code
  
  const qrUrl = (isPremium && profile.customQrLink) ? profile.customQrLink : https://centralobra.com.br/p/;
  const qrApi = https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=;
  const qrBase64 = await fetchImageAsBase64(qrApi);
  if (qrBase64) {
    doc.addImage(qrBase64, 'PNG', margin + 40, margin + 25, 70, 70);
  }

  // Right Side Header
  const contentStartX = margin + 180;
  
  // Logo
  doc.setFillColor(30, 41, 59);
  doc.circle(contentStartX + 10, margin + 40, 8, 'F');
  doc.setFillColor(249, 115, 22);
  doc.circle(contentStartX + 10, margin + 40, 4, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(profile.name || 'Empresa / Profissional', contentStartX + 30, margin + 44);

  // Title INVOICE / PROPOSTA
  doc.setFontSize(40);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPOSTA', contentStartX, margin + 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Documento Formal de Prestação de Serviços', contentStartX, margin + 115);

  // Info Box
  doc.setFillColor(248, 250, 252);
  doc.rect(contentStartX, margin + 130, pageWidth - contentStartX - margin - 20, 50, 'F');
  doc.setFontSize(8);
  doc.text('Obra:', contentStartX + 15, margin + 150);
  doc.text('Contato:', contentStartX + 120, margin + 150);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(workData?.name || '-', contentStartX + 15, margin + 165);
  doc.text(profile?.phone || '-', contentStartX + 120, margin + 165);

  let currentY = margin + 260;

  // TABLE (Dark Header)
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
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 }, // Dark header
      bodyStyles: { textColor: [55, 65, 81], fontSize: 9, cellPadding: { top: 10, bottom: 10, left: 6, right: 6 } },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 'auto' },
        3: { halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: margin + 20, right: margin + 20 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 20;

    // Totals block on the right
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    
    const totalsX = pageWidth - margin - 150;
    doc.text('Subtotal:', totalsX, currentY);
    doc.text(brlFormatter.format(totals.subtotal || 0), pageWidth - margin - 20, currentY, { align: 'right' });
    
    doc.text('Descontos:', totalsX, currentY + 15);
    doc.text(brlFormatter.format(totals.discount || 0), pageWidth - margin - 20, currentY + 15, { align: 'right' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total:', totalsX, currentY + 35);
    doc.text(brlFormatter.format(totals.total || 0), pageWidth - margin - 20, currentY + 35, { align: 'right' });
  }

  // Footer / Terms
  const footerY = pageHeight - margin - 80;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('TERMOS E CONDIÇÕES', margin + 20, footerY);
  doc.setTextColor(100, 116, 139);
  doc.text('Aprovado mediante assinatura ou aceite via WhatsApp.', margin + 20, footerY + 15);
  doc.text(Pagamento via: , margin + 20, footerY + 25);

  applyGlobalWatermark(doc, isPremium);

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

// Dummy stubs for old methods so imports don't break
export async function generateBudgetPDF(args: any) { return generateCommercialQuotePDF(args); }
export async function generateGeneralReport(args: any) {}
