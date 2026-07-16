// src/utils/finance.ts

import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import type { Expense, Material, Category } from '../types';

/** Create an expense from a purchased material */
export async function createExpenseFromMaterial(
  workId: string,
  material: Material,
  paymentInfo: { amount?: number; supplier?: string; paymentMethod?: string; date?: Timestamp }
) {
  const amount =
    paymentInfo.amount ??
    material.totalValue ??
    (material.unitValue ? material.unitValue * material.quantity : 0);

  const expense: Omit<Expense, 'id'> = {
    title: material.name,
    amount,
    category: material.category as Category,
    date: paymentInfo.date ?? Timestamp.now(),
    paymentMethod: paymentInfo.paymentMethod,
    supplier: paymentInfo.supplier,
    createdAt: Timestamp.now(),
    status: 'Pago',
    workId: workId
  };

  await addDoc(collection(db, 'works', workId, 'expenses'), expense);
}

/** Aggregate expenses by category */
export function aggregateExpensesByCategory(expenses: Expense[]) {
  const map: Record<string, number> = {};
  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
  });
  return map;
}

/** Total spent */
export function totalSpentFromExpenses(expenses: Expense[]) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}
