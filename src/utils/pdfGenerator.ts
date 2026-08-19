import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoUrl from '/logo-centralobra.png?url';
import { formatDate } from './formatters';


interface PDFExportParams {
  work: any;
  user: any;
  calculations: any[];
  profile?: any;
}

export async function drawHeader(doc: jsPDF, userName: string, _userEmail: string, workName?: string, customLogoUrl?: string | null) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  let currentY = 40;

  // Render Logo
  if (customLogoUrl) {
    try {
      const logoBase64 = await fetchImageAsBase64(customLogoUrl);
      if (logoBase64) {
        const props = doc.getImageProperties(logoBase64);
        const ratio = props.width / props.height;
        const imgHeight = 40; 
        const imgWidth = imgHeight * ratio;
        doc.addImage(logoBase64, 'PNG', 40, 20, imgWidth, imgHeight);
      } else {
        drawDefaultLogo(doc);
      }
    } catch (e) {
      // Fallback if custom logo fails to load
      drawDefaultLogo(doc);
    }
  } else {
    drawDefaultLogo(doc);
  }

  // Header texts
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55); // text-gray-800
  doc.text(`Responsável: ${userName || 'Usuário'}`, pageWidth - 40, currentY, { align: 'right' });
  
  currentY += 14;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // text-gray-500
  
  if (workName) {
    doc.text(`Obra: ${workName}`, pageWidth - 40, currentY, { align: 'right' });
    currentY += 14;
  }
  doc.text(`Data: ${formatDate()}`, pageWidth - 40, currentY, { align: 'right' });

  return Math.max(currentY, 60) + 30; // Return currentY for subsequent drawing
}

function drawDefaultLogo(doc: jsPDF) {
  // CentralObra Modern Default Logo
  doc.setFillColor(17, 24, 39); // Preto escuro/Cinza 900
  doc.roundedRect(40, 25, 120, 32, 6, 6, 'F');
  
  // Ícone minimalista azul/dourado dentro do retangulo
  doc.setFillColor(59, 130, 246); // Azul
  doc.rect(48, 33, 12, 16, 'F');
  doc.setFillColor(139, 92, 246); // Roxo/Indigo
  doc.rect(62, 39, 12, 10, 'F');

  // Texto "CentralObra"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255); // Branco
  doc.text('CentralObra', 80, 47, { align: 'left' });
}

export function drawFooter(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Subtle background footer
  doc.setFillColor(249, 250, 251); // gray-50
  doc.rect(0, pageHeight - 40, pageWidth, 40, 'F');

  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.5);
  doc.line(0, pageHeight - 40, pageWidth, pageHeight - 40);

  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.setFont('helvetica', 'normal');
  doc.text('Documento gerado pela plataforma CentralObra', pageWidth / 2, pageHeight - 24, { align: 'center' });
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 114, 128); // gray-500
  doc.text('centralobra.com', pageWidth / 2, pageHeight - 12, { align: 'center' });

  const pageCount = (doc as any).internal.getNumberOfPages();
  const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.setFont('helvetica', 'normal');
  doc.text(`Página ${currentPage} de ${pageCount}`, pageWidth - 40, pageHeight - 18, { align: 'right' });
}

export function applyGlobalWatermark(doc: jsPDF, isPro: boolean = false) {
  if (isPro) return; // Planos PRO/Business não possuem marca d'água

  const pageCount = (doc as any).internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Watermark styling
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.setFont('helvetica', 'bold');
    
    // Calculate center
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    // Using GState for opacity if supported (works in newer jspdf)
    try {
      const gState = new (doc as any).GState({ opacity: 0.15 });
      (doc as any).setGState(gState);
    } catch (e) {
      // Fallback if GState is not available
    }

    doc.text('CENTRALOBRA', centerX, centerY, {
      align: 'center',
      angle: 45
    });

    // Reset GState if supported
    try {
      const resetState = new (doc as any).GState({ opacity: 1.0 });
      (doc as any).setGState(resetState);
    } catch (e) {}
  }
}

export async function generateBudgetPDF({ work, user, calculations, profile }: PDFExportParams) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;

  const userName = profile?.name || user?.displayName || user?.email || 'Usuário';
  const userEmail = user?.email || '';
  const isPro = profile?.subscriptionPlan === 'pro' || profile?.subscriptionPlan === 'business';
  const customLogo = isPro ? profile?.logoUrl : null;
  let y = await drawHeader(doc, userName, userEmail, work?.name, customLogo);

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Orçamento de Obra', centerX, y, { align: 'center' });

  y += 20;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(1);
  doc.line(40, y, pageWidth - 40, y);

  y += 20;
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

  const rightCol = pageWidth / 2 + 20;
  doc.text(`Data: ${formatDate()}`, rightCol, cardY + 34);
  if (work.budget) {
    const budgetFormatted = typeof work.budget === 'number' 
      ? work.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
      : work.budget;
    doc.text(`Orçamento Previsto: ${budgetFormatted}`, rightCol, cardY + 50);
  }

  y += 110;
  let totalGeral = 0;

  if (calculations.length === 0) {
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text('Nenhum cálculo registrado para esta obra.', 40, y + 20);
  }

  for (let index = 0; index < calculations.length; index++) {
    const calc = calculations[index];
    if (!calc.resultData || !calc.resultData.materials || calc.resultData.materials.length === 0) continue;

    if (y > 750) {
      doc.addPage();
      y = await drawHeader(doc, userName, userEmail, work?.name, customLogo) + 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 107, 0);
    doc.text(`${index + 1}. ${calc.calcType || 'Lista de Materiais'}`, 40, y);
    
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

    tableData.push([
      'SUBTOTAL',
      '',
      '',
      calcTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ]);

    autoTable(doc, {
      startY: y,
      margin: { left: 40, right: 40 },
      head: [['Material', 'Quantidade', 'Valor Unitário', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [255, 107, 0], textColor: 255, fontSize: 9, fontStyle: 'bold', cellPadding: 8 },
      styles: { fontSize: 9, cellPadding: 6, textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [252, 252, 252] },
      columnStyles: {
        0: { cellWidth: 200, fontStyle: 'bold' },
        1: { cellWidth: 80, halign: 'center' },
        2: { cellWidth: 100, halign: 'right' },
        3: { cellWidth: 100, halign: 'right' },
      },
      didParseCell: function (data) {
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [255, 243, 230];
          data.cell.styles.textColor = [200, 80, 0];
        }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 30;
  }

  if (y > 720) {
    doc.addPage();
    y = await drawHeader(doc, userName, userEmail, work?.name, customLogo) + 20;
  }

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

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawFooter(doc);
  }


  applyGlobalWatermark(doc, isPro);
  // Use blob URL approach for Capacitor/Android WebView compatibility
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Orcamento_${work.name?.replace(/\s+/g, '_') || 'Obra'}_${formatDate().replace(/\//g, '-')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --------------------------------------------------------------------------------------
// NOVO: Geração de PDF Comercial Profissional (Estilo Stripe/Linear)
// --------------------------------------------------------------------------------------

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
  } catch (error) {
    console.error("Erro ao carregar imagem", error);
    return null;
  }
};

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
  const margin = 40;
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  // 1. Header Profissional (Centralizado com tema Escuro/Dourado)
  const centerX = pageWidth / 2;

  let currentY = margin;

  // Tenta carregar a logo customizada se for PRO/Business
  const isPro = profile?.subscriptionPlan === 'pro' || profile?.subscriptionPlan === 'business';
  const customLogoUrl = isPro ? profile?.logoUrl : null;
  let customLogoBase64 = null;
  if (customLogoUrl) {
    customLogoBase64 = await fetchImageAsBase64(customLogoUrl);
  }

  if (customLogoBase64) {
    try {
      const props = doc.getImageProperties(customLogoBase64);
      const ratio = props.width / props.height;
      const imgHeight = 50; 
      const imgWidth = imgHeight * ratio;
      // Centraliza a imagem mantendo a proporção original
      doc.addImage(customLogoBase64, 'PNG', centerX - (imgWidth/2), currentY, imgWidth, imgHeight);
      currentY += imgHeight + 20;
    } catch(e) {
      // Fallback
      doc.setFillColor(17, 24, 39);
      doc.roundedRect(centerX - 60, currentY, 120, 32, 6, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text('CentralObra', centerX, currentY + 20, { align: 'center' });
      currentY += 50;
    }
  } else {
    // Fallback: Logo Padrão Moderno Centralizado
    doc.setFillColor(17, 24, 39); // Preto escuro/Cinza 900
    doc.roundedRect(centerX - 60, currentY, 120, 32, 6, 6, 'F');
    
    // Ícone minimalista azul/dourado dentro do retangulo
    doc.setFillColor(59, 130, 246); // Azul
    doc.rect(centerX - 52, currentY + 8, 12, 16, 'F');
    doc.setFillColor(139, 92, 246); // Roxo/Indigo
    doc.rect(centerX - 38, currentY + 14, 12, 10, 'F');

    // Texto "CentralObra"
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255); // Branco
    doc.text('CentralObra', centerX - 20, currentY + 22, { align: 'left' });
    
    currentY += 50;
  }

  // Proposta Comercial Title below it
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55); // Dourado
  doc.text('PROPOSTA COMERCIAL', centerX, currentY, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128); // Gray 500
  doc.text(`Data: ${formatDate()}  |  Validade: ${conditions.validade || '15 dias'}`, centerX, currentY + 13, { align: 'center' });

  currentY += 35;

  // Informações do Prestador Centralizadas
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  const prestadorName = profile?.companyName || profile?.name || 'CentralObra Pro';
  doc.text(prestadorName, centerX, currentY, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  
  let prestadorInfo: string[] = [];
  if (profile?.documentNumber) prestadorInfo.push(`CPF/CNPJ: ${profile.documentNumber}`);
  if (profile?.registry) prestadorInfo.push(`Reg: ${profile.registry}`);
  if (profile?.whatsapp || profile?.phone) prestadorInfo.push(`Tel/Whats: ${profile.whatsapp || profile.phone}`);
  if (profile?.pixKey) prestadorInfo.push(`PIX: ${profile.pixKey}`);
  
  if (prestadorInfo.length > 0) {
    doc.text(prestadorInfo.join('  •  '), centerX, currentY + 12, { align: 'center' });
  }
  if (profile?.email) {
    doc.text(profile.email, centerX, currentY + 22, { align: 'center' });
  }

  // Divider
  currentY += 35;
  doc.setDrawColor(229, 231, 235); // Gray 200
  doc.setLineWidth(1);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 20;

  // 2. Blocos de Cliente e Obra
  // Cliente (Left)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(156, 163, 175); // Gray 400
  doc.text('PREPARADO PARA', margin, currentY);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(client.name || 'Cliente Não Informado', margin, currentY + 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // Gray 600
  if (client.phone) doc.text(client.phone, margin, currentY + 30);
  if (client.email) doc.text(client.email, margin, currentY + 44);

  // Obra (Right)
  const rightX = pageWidth - margin;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(156, 163, 175);
  doc.text('LOCAL DA OBRA', rightX, currentY, { align: 'right' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(workData.name || 'Nome da Obra', rightX, currentY + 16, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  if (workData.address) doc.text(workData.address, rightX, currentY + 30, { align: 'right' });

  currentY += 70;

  // Função Helper para tabelas profissionais
  const drawMinimalTable = (title: string, head: string[][], body: any[][]) => {
    if (body.length === 0) return;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text(title, centerX, currentY, { align: 'center' });
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      head: head,
      body: body,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 8,
        textColor: [55, 65, 81], // Gray 700
      },
      headStyles: {
        fontStyle: 'bold',
        textColor: [107, 114, 128], // Gray 500
        fontSize: 9,
        cellPadding: { top: 8, bottom: 8, left: 8, right: 8 },
        lineWidth: { bottom: 1 },
        lineColor: [229, 231, 235]
      },
      bodyStyles: {
        lineWidth: { bottom: 1 },
        lineColor: [243, 244, 246] // Gray 100
      },
      columnStyles: {
        0: { cellWidth: 200, fontStyle: 'bold', textColor: [17, 24, 39] },
        [head[0].length - 1]: { halign: 'right' }
      },
      margin: { left: margin, right: margin }
    });

    currentY = (doc as any).lastAutoTable.finalY + 30;
  };

  // 3. Tabelas de Itens
  if (services.length > 0) {
    const sBody = services.map(s => [
      s.desc,
      `${s.qtd} ${s.un}`,
      formatter.format(s.price),
      formatter.format(s.qtd * s.price)
    ]);
    drawMinimalTable('Serviços Profissionais', [['Descrição', 'Qtd', 'V. Unitário', 'Subtotal']], sBody);
  }

  if (materials.length > 0) {
    const mBody = materials.map(m => [
      m.name,
      `${m.qtd} un`,
      formatter.format(m.price),
      formatter.format(m.qtd * m.price)
    ]);
    drawMinimalTable('Materiais Fornecidos', [['Material', 'Qtd', 'V. Unitário', 'Subtotal']], mBody);
  }

  // 4. Mão de Obra e Custos (Resumo Simples)
  if (totals.totalLabor > 0 || totals.totalCosts > 0) {
    const extraBody = [];
    if (totals.totalLabor > 0) {
      extraBody.push(['Mão de Obra Especializada', `${labor.workers} prof. x ${labor.days} dias`, formatter.format(labor.dailyRate), formatter.format(totals.totalLabor)]);
    }
    if (costs.freight > 0) extraBody.push(['Frete / Logística', '-', '-', formatter.format(costs.freight)]);
    if (costs.displacement > 0) extraBody.push(['Deslocamento', '-', '-', formatter.format(costs.displacement)]);
    if (costs.rental > 0) extraBody.push(['Locação de Equipamentos', '-', '-', formatter.format(costs.rental)]);
    if (costs.others > 0) extraBody.push(['Outros Custos / Taxas', '-', '-', formatter.format(costs.others)]);

    drawMinimalTable('Custos Adicionais', [['Descrição', 'Detalhe', 'Referência', 'Subtotal']], extraBody);
  }

  // 5. Totalizador (Caixa de Destaque Estilo Stripe)
  // Verifica se precisa quebrar página
  if (currentY > pageWidth - 200) {
    doc.addPage();
    currentY = margin;
  }

  const boxWidth = 260;
  const boxX = pageWidth - margin - boxWidth;
  
  doc.setFillColor(249, 250, 251); // Gray 50
  doc.setDrawColor(229, 231, 235); // Gray 200
  doc.roundedRect(boxX, currentY, boxWidth, 140, 8, 8, 'FD');

  let tY = currentY + 25;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  doc.text('Subtotal:', boxX + 20, tY);
  doc.text(formatter.format(totals.subtotal), boxX + boxWidth - 20, tY, { align: 'right' });
  
  tY += 20;
  if (totals.discountAmount > 0) {
    doc.setTextColor(239, 68, 68); // Red 500
    doc.text('Desconto:', boxX + 20, tY);
    doc.text(`- ${formatter.format(totals.discountAmount)}`, boxX + boxWidth - 20, tY, { align: 'right' });
    tY += 20;
  }

  doc.setDrawColor(229, 231, 235);
  doc.line(boxX + 20, tY - 5, boxX + boxWidth - 20, tY - 5);

  tY += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Total Final:', boxX + 20, tY);
  
  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235); // Blue 600
  doc.text(formatter.format(totals.grandTotal), boxX + boxWidth - 20, tY, { align: 'right' });


  // 6. Condições Comerciais
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('Condições Comerciais', margin, currentY + 10);
  
  let cY = currentY + 30;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  
  doc.text(`• Prazo de Execução: ${conditions.prazo || 'A combinar'}`, margin, cY); cY += 16;
  doc.text(`• Garantia: ${conditions.garantia || 'Padrão legal'}`, margin, cY); cY += 16;
  doc.text(`• Pagamento: ${conditions.pagamento || 'A combinar'}`, margin, cY); cY += 16;
  if (conditions.obs) {
    const maxWidth = Math.max(100, boxX - margin - 20);
    const lines = doc.splitTextToSize(`• Observações: ${conditions.obs}`, maxWidth);
    doc.text(lines, margin, cY);
  }

  // Footer para todas as páginas geradas
  const pageCount = (doc as any).internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    drawFooter(doc);
  }

  applyGlobalWatermark(doc, isPro);
  // Use blob URL approach for Capacitor/Android WebView compatibility
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const pdfLink = document.createElement('a');
  pdfLink.href = pdfUrl;
  pdfLink.download = `Proposta_${client.name?.replace(/\s+/g, '_') || 'Cliente'}.pdf`;
  document.body.appendChild(pdfLink);
  pdfLink.click();
  document.body.removeChild(pdfLink);
  URL.revokeObjectURL(pdfUrl);
}
