import { exportToExcel } from '../utils/excelExport';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Work, Expense } from '../types';

export const exportShoppingToExcel = async (activeWork: Work) => {
  const qShop = query(collection(db, `works/${activeWork.id}/shopping`));
  const snapShop = await getDocs(qShop);
  
  const qCalc = query(collection(db, `works/${activeWork.id}/calculations`));
  const snapCalc = await getDocs(qCalc);
  
  const materials: any[] = [];
  
  snapShop.forEach(d => {
    const item = d.data();
    materials.push({
      Material: item.name,
      Quantidade: item.quantity,
      Unidade: item.unit,
      Status: item.isPurchased ? 'Comprado' : 'Pendente',
      Origem: 'Manual',
      Valor: item.price || 0,
      Total: (item.quantity || 0) * (item.price || 0)
    });
  });
  
  snapCalc.forEach(d => {
    const calc = d.data();
    if (calc.resultData && calc.resultData.materials) {
      calc.resultData.materials.forEach((mat: any) => {
        materials.push({
          Material: mat.name,
          Quantidade: mat.quantity,
          Unidade: mat.unit,
          Status: mat.isPurchased ? 'Comprado' : 'Pendente',
          Origem: calc.name || 'Assistente',
          Valor: mat.unitPrice || 0,
          Total: (mat.quantity || 0) * (mat.unitPrice || 0)
        });
      });
    }
  });

  exportToExcel({
    filename: `Lista_de_Compras_${(activeWork.name || 'obra').replace(/\s+/g, '_')}`,
    sheetName: 'Compras',
    title: 'Lista de Compras & Materiais',
    subtitle: `Obra: ${activeWork.name}`,
    columns: [
      { header: 'Material', key: 'Material', width: 40 },
      { header: 'Quantidade', key: 'Quantidade', width: 15 },
      { header: 'Unidade', key: 'Unidade', width: 15 },
      { header: 'Valor Unitário', key: 'Valor', width: 20 },
      { header: 'Valor Total', key: 'Total', width: 20 },
      { header: 'Status', key: 'Status', width: 20 },
      { header: 'Origem', key: 'Origem', width: 30 }
    ],
    data: materials
  });
};

export const exportFinanceToExcel = async (activeWork: Work) => {
  const qExp = query(collection(db, `works/${activeWork.id}/expenses`), orderBy('date', 'desc'));
  const snap = await getDocs(qExp);
  const expenses = snap.docs.map(d => d.data() as Expense);

  const data = expenses.map(e => ({
    Data: e.date?.toDate ? e.date.toDate().toLocaleDateString('pt-BR') : new Date(e.date).toLocaleDateString('pt-BR'),
    Descricao: e.title,
    Categoria: e.category,
    Status: e.status,
    Valor: Number(e.amount)
  }));

  exportToExcel({
    filename: `Financeiro_${(activeWork.name || 'obra').replace(/\s+/g, '_')}`,
    sheetName: 'Financeiro',
    title: 'Relatório Financeiro',
    subtitle: `Obra: ${activeWork.name}`,
    columns: [
      { header: 'Data', key: 'Data', width: 15 },
      { header: 'Descrição', key: 'Descricao', width: 40 },
      { header: 'Categoria', key: 'Categoria', width: 20 },
      { header: 'Status', key: 'Status', width: 15 },
      { header: 'Valor', key: 'Valor', width: 20 }
    ],
    data
  });
};
