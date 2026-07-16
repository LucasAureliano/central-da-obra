export interface Work {
  id: string;
  name?: string;
  title?: string; // Some old docs might use title instead of name
  location?: string;
  address?: string;
  status?: 'Em Andamento' | 'Concluída' | 'Pausada' | string;
  budget?: number; // Changed from string to number
  spent?: number;
  progress?: number;
  image?: string;
  deadline?: string;
  createdAt?: any;
  userId?: string;
}

// ------------------------------------------------------------------
// Types added for Material Assistant and Finance integration
export type Category =
  | 'Materiais'
  | 'Mão de obra'
  | 'Fretes'
  | 'Locação'
  | 'Ferramentas'
  | 'Acabamentos'
  | 'Elétrica'
  | 'Hidráulica'
  | 'Pintura'
  | 'Outros';

export type ExpenseStatus = 'Pago' | 'Pendente' | 'Parcelado' | 'Cancelado';

export type Unit =
  | 'Unidade'
  | 'Saco'
  | 'Caixa'
  | 'Pacote'
  | 'Barra'
  | 'Peça'
  | 'Metro'
  | 'Metro²'
  | 'Metro³'
  | 'Quilograma'
  | 'Grama'
  | 'Litro'
  | 'Mililitro';

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  unitValue?: number;
  totalValue?: number;
  category: Category;
  status: 'Pendente' | 'Comprado' | 'Cancelado';
  createdAt: any; // firebase.firestore.Timestamp
  updatedAt: any; // firebase.firestore.Timestamp
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: any; // firebase.firestore.Timestamp
  paymentMethod?: string;
  supplier?: string;
  notes?: string;
  workId: string;
  status: ExpenseStatus;
  createdAt: any; // firebase.firestore.Timestamp
}
