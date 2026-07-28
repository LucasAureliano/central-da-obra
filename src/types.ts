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

// ------------------------------------------------------------------
// Service Provider Role specific types

export interface Client {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  notes?: string;
  photoUrl?: string;
  servicesCount: number;
  totalContracted: number;
  totalServices?: number;
  totalValue?: number;
  lastVisit?: any;
  nextVisit?: any;
  createdAt: any;
  userId: string;
}

export interface ServiceCatalogItem {
  id?: string;
  title: string;
  description?: string;
  unit: Unit | string;
  suggestedPrice: number;
  averageTimeDays: number;
  notes?: string;
  materialsUsed?: string[];
  userId: string;
  createdAt: any;
}

export interface ProviderService {
  id?: string;
  title: string;
  clientId?: string;
  clientName?: string;
  address?: string;
  value: number;
  progress: number;
  status: 'Agendado' | 'Em Execução' | 'Pausado' | 'Concluído' | 'Cancelado';
  deadline?: any;
  photos?: string[];
  userId: string;
  createdAt: any;
}

export interface Receipt {
  id?: string;
  title: string;
  amount: number;
  status: 'Recebido' | 'Pendente' | 'Vencido';
  date: any; // Timestamp
  paymentMethod?: 'PIX' | 'Dinheiro' | 'Cartão' | 'Transferência' | 'Cheque' | 'Boleto';
  clientId?: string;
  serviceId?: string;
  notes?: string;
  userId: string;
  createdAt: any;
}

export interface AgendaEvent {
  id?: string;
  title: string;
  date: any; // Timestamp
  durationHours: number;
  clientId?: string;
  clientName?: string;
  address?: string;
  serviceId?: string;
  notes?: string;
  userId: string;
  createdAt: any;
}
