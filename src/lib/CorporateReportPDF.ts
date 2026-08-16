import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { applyGlobalWatermark } from '../utils/pdfGenerator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../utils/formatters';

// This function assumes it receives the aggregated data
export async function generateCorporateReportPDF(data: {
  builderName: string;
  totalWorks: number;
  activeWorks: number;
  delayedWorks: number;
  totalBudget: number;
  totalSpent: number;
  activeEmployees: number;
  equipmentInUse: number;
  worksDetails: any[];
}) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Helper to add centered text
  const addCenteredText = (text: string, y: number, fontSize = 12, color = '#000000') => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color);
    const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
    doc.text(text, (pageWidth - textWidth) / 2, y);
  };

  // Header / Logos
  // In a real app we would load base64 logos here.
  doc.setFillColor(6, 182, 212); // Cyan primary
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  doc.setTextColor('#FFFFFF');
  doc.setFontSize(18);
  doc.text('CentralObra - Relatório Corporativo', 40, 36);

  // Report Info
  doc.setTextColor('#333333');
  doc.setFontSize(14);
  doc.text(`Empresa: ${data.builderName}`, 40, 100);
  
  doc.setFontSize(10);
  doc.setTextColor('#666666');
  doc.text(`Data de Emissão: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 40, 115);

  // Executive Summary (KPIs)
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text('Resumo Executivo', 40, 150);
  doc.setLineWidth(1);
  doc.setDrawColor(200, 200, 200);
  doc.line(40, 155, pageWidth - 40, 155);

  const kpis = [
    [`Obras Ativas / Totais`, `${data.activeWorks} / ${data.totalWorks}`],
    [`Obras em Atraso`, `${data.delayedWorks}`],
    [`VGV (Orçamento Total)`, `${formatCurrency(data.totalBudget)}`],
    [`Custo Realizado (Total)`, `${formatCurrency(data.totalSpent)}`],
    [`Mão de Obra Alocada`, `${data.activeEmployees} colaboradores`],
    [`Equipamentos em Uso`, `${data.equipmentInUse} máquinas`],
  ];

  (doc as any).autoTable({
    startY: 165,
    head: [['Indicador', 'Valor']],
    body: kpis,
    theme: 'striped',
    headStyles: { fillColor: [240, 240, 240], textColor: [51, 51, 51] },
    margin: { left: 40, right: 40 },
  });

  // Works Details
  let finalY = (doc as any).lastAutoTable.finalY || 165;
  
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text('Detalhamento por Obra', 40, finalY + 30);
  doc.line(40, finalY + 35, pageWidth - 40, finalY + 35);

  const worksTableData = data.worksDetails.map(w => [
    w.name,
    w.status,
    `${w.progress || 0}%`,
    `${formatCurrency((w.budget || 0))}`,
    `${formatCurrency((w.spent || 0))}`
  ]);

  (doc as any).autoTable({
    startY: finalY + 45,
    head: [['Obra', 'Status', 'Avanço Fís.', 'Orçado', 'Realizado']],
    body: worksTableData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
    margin: { left: 40, right: 40 },
  });

  finalY = (doc as any).lastAutoTable.finalY || finalY + 45;

  // Footer / Signatures
  if (finalY > doc.internal.pageSize.getHeight() - 150) {
    doc.addPage();
    finalY = 40;
  }

  doc.setLineWidth(1);
  doc.setDrawColor(51, 51, 51);
  doc.line(pageWidth / 2 - 100, finalY + 80, pageWidth / 2 + 100, finalY + 80);
  addCenteredText('Assinatura do Diretor Técnico', finalY + 95, 10, '#333333');

  // QR Code placeholder text (To be replaced with real QR code generation if needed)
  doc.setFontSize(8);
  doc.setTextColor('#999999');
  addCenteredText('Relatório gerado automaticamente por CentralObra Connect', doc.internal.pageSize.getHeight() - 20, 8, '#999999');

  // Save the PDF
  applyGlobalWatermark(doc);
  doc.save(`Relatorio_Corporativo_${format(new Date(), "yyyyMMdd")}.pdf`);
}
