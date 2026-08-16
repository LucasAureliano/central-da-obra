import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { applyGlobalWatermark } from './pdfGenerator';

export interface CorporateReportPDFData {
  companyName: string;
  cnpj?: string;
  reportTitle: string;
  reportNumber: string;
  date: string;
  responsibleEngineer: string;
  creaNumber?: string;
  activeWorksCount: number;
  totalRevenue: number;
  totalExpenses: number;
  executiveSummary: string;
  worksList: { name: string; client: string; progress: number; status: string }[];
  signatureName?: string;
}

export function generateCorporateReportPDF(data: CorporateReportPDFData) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;

  // Top Banner
  doc.setFillColor(30, 58, 138); // Deep Navy Blue
  doc.rect(0, 0, pageWidth, 65, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(data.companyName.toUpperCase(), margin, 32);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(data.cnpj ? `CNPJ: ${data.cnpj}` : 'Relatório Executivo Corporativo', margin, 48);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nº ${data.reportNumber}`, pageWidth - margin, 32, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${data.date}`, pageWidth - margin, 48, { align: 'right' });

  let y = 85;

  // Title & Metadata
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.reportTitle || 'RELATÓRIO CONSOLIDADO DE OPERAÇÕES', margin, y);
  y += 20;

  // Executive Summary Box
  doc.setFillColor(243, 244, 246);
  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 65, 8, 8, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text(`Engenheiro Responsável: ${data.responsibleEngineer} ${data.creaNumber ? `(${data.creaNumber})` : ''}`, margin + 14, y + 20);

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  doc.setFont('helvetica', 'normal');
  doc.text(`Obras Monitoradas: ${data.activeWorksCount} obras ativas`, margin + 14, y + 38);
  doc.text(`Faturamento Consolidado: ${fmt(data.totalRevenue)}`, pageWidth - margin - 14, y + 20, { align: 'right' });
  doc.text(`Custos Operacionais: ${fmt(data.totalExpenses)}`, pageWidth - margin - 14, y + 38, { align: 'right' });

  y += 85;

  // Summary Text
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('1. Resumo da Situação Operacional', margin, y);
  y += 14;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const summaryLines = doc.splitTextToSize(data.executiveSummary || 'Operação mantida dentro dos padrões técnicos e cronogramas acordados.', pageWidth - (margin * 2));
  doc.text(summaryLines, margin, y);
  y += (summaryLines.length * 13) + 20;

  // Table of Works
  if (data.worksList && data.worksList.length > 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('2. Desempenho Físico das Obras Ativas', margin, y);
    y += 10;

    const tableBody = data.worksList.map(w => [
      w.name,
      w.client || 'Cliente',
      `${w.progress}%`,
      w.status
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Obra / Empreendimento', 'Cliente', 'Progresso Físico', 'Status']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 6 },
      columnStyles: {
        0: { cellWidth: 200, fontStyle: 'bold' },
        1: { cellWidth: 150 },
        2: { cellWidth: 90, halign: 'center' },
        3: { cellWidth: 70, halign: 'center' },
      }
    });

    y = (doc as any).lastAutoTable.finalY + 30;
  }

  // Signature Block
  if (y > pageHeight - 100) {
    doc.addPage();
    y = 60;
  }

  const sigX = pageWidth / 2;
  doc.setDrawColor(156, 163, 175);
  doc.line(sigX - 120, y, sigX + 120, y);
  y += 14;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.signatureName || data.responsibleEngineer, sigX, y, { align: 'center' });
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(data.creaNumber ? `Responsável Técnico - CREA: ${data.creaNumber}` : 'Diretoria de Operações', sigX, y, { align: 'center' });

  // Footer on all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('CentralObra Enterprise ERP — Documento Corporativo', margin, pageHeight - 20);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 20, { align: 'right' });
  }

  applyGlobalWatermark(doc);
  doc.save(`Relatorio_Corporativo_${data.companyName.replace(/\s+/g, '_')}_${data.reportNumber}.pdf`);
}
