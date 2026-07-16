import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Work, Expense } from '../types';

export const generateGeneralReport = async (activeWork: Work) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('pt-BR');
  
  doc.setFontSize(20);
  doc.text('Relatório Geral da Obra', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Obra: ${activeWork.name}`, 14, 32);
  doc.text(`Data: ${dateStr}`, 14, 38);
  doc.text(`Progresso: ${activeWork.progress || 0}%`, 14, 44);
  
  // Orçamento vs Gasto
  const budget = activeWork.budget || 0;
  const spent = activeWork.spent || 0;
  
  (doc as any).autoTable({
    startY: 55,
    head: [['Indicador', 'Valor']],
    body: [
      ['Orçamento Previsto', `R$ ${budget.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`],
      ['Total Gasto', `R$ ${spent.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`],
      ['Saldo Atual', `R$ ${(budget - spent).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] }
  });

  doc.save(`relatorio_geral_${(activeWork.name || 'obra').replace(/\s+/g, '_')}.pdf`);
};

export const generateFinancialReport = async (activeWork: Work) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('pt-BR');
  
  doc.setFontSize(20);
  doc.text('Relatório Financeiro', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Obra: ${activeWork.name}`, 14, 32);
  doc.text(`Data: ${dateStr}`, 14, 38);
  
  const qExp = query(collection(db, `works/${activeWork.id}/expenses`), orderBy('date', 'desc'));
  const snap = await getDocs(qExp);
  const expenses = snap.docs.map(d => d.data() as Expense);

  if (expenses.length === 0) {
    doc.text('Nenhuma despesa registrada nesta obra.', 14, 55);
  } else {
    const tableData = expenses.map(e => [
      e.date?.toDate ? e.date.toDate().toLocaleDateString('pt-BR') : new Date(e.date).toLocaleDateString('pt-BR'),
      e.title,
      e.category,
      e.status,
      `R$ ${Number(e.amount).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
    ]);

    (doc as any).autoTable({
      startY: 50,
      head: [['Data', 'Descrição', 'Categoria', 'Status', 'Valor']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Calculate totals
    const totalPago = expenses.filter(e => e.status === 'Pago').reduce((sum, e) => sum + Number(e.amount), 0);
    const totalPendente = expenses.filter(e => e.status === 'Pendente').reduce((sum, e) => sum + Number(e.amount), 0);
    
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.text(`Total Pago: R$ ${totalPago.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 14, finalY + 15);
    doc.text(`Total Pendente: R$ ${totalPendente.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, 14, finalY + 22);
  }

  doc.save(`financeiro_${(activeWork.name || 'obra').replace(/\s+/g, '_')}.pdf`);
};

export const generateShoppingReport = async (activeWork: Work) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('pt-BR');
  
  doc.setFontSize(20);
  doc.text('Lista de Compras & Materiais', 14, 22);
  
  doc.setFontSize(12);
  doc.text(`Obra: ${activeWork.name}`, 14, 32);
  doc.text(`Data: ${dateStr}`, 14, 38);
  
  const qShop = query(collection(db, `works/${activeWork.id}/shopping`));
  const snapShop = await getDocs(qShop);
  
  const qCalc = query(collection(db, `works/${activeWork.id}/calculations`));
  const snapCalc = await getDocs(qCalc);
  
  const materials: any[] = [];
  
  snapShop.forEach(d => {
    const item = d.data();
    materials.push({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      status: item.isPurchased ? 'Comprado' : 'Pendente',
      origin: 'Manual'
    });
  });
  
  snapCalc.forEach(d => {
    const calc = d.data();
    if (calc.resultData && calc.resultData.materials) {
      calc.resultData.materials.forEach((mat: any) => {
        materials.push({
          name: mat.name,
          quantity: mat.quantity,
          unit: mat.unit,
          status: mat.isPurchased ? 'Comprado' : 'Pendente',
          origin: calc.name || 'Assistente'
        });
      });
    }
  });

  if (materials.length === 0) {
    doc.text('Nenhum material listado.', 14, 55);
  } else {
    const tableData = materials.map(m => [
      m.name,
      `${m.quantity} ${m.unit}`,
      m.status,
      m.origin
    ]);

    (doc as any).autoTable({
      startY: 50,
      head: [['Material', 'Qtd', 'Status', 'Origem']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }
    });
  }

  doc.save(`compras_${(activeWork.name || 'obra').replace(/\s+/g, '_')}.pdf`);
};
