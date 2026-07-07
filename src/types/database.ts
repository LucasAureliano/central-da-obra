// Central da Obra - Database Types (Supabase)

export type UserRole = 'ADMIN' | 'ENGENHEIRO' | 'PROPRIETARIO' | 'FUNCIONARIO';
export type WorkStatus = 'PLANNING' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED';
export type PhaseType = 'ANTES' | 'DURANTE' | 'DEPOIS';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  subscription_plan: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  company_id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
}

export interface Client {
  id: string;
  company_id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface Work {
  id: string;
  company_id: string;
  client_id: string;
  name: string;
  address?: string;
  status: WorkStatus;
  start_date?: string;
  estimated_end_date?: string;
  total_budget?: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  company_id: string;
  name: string;
  role: string;
  daily_rate?: number;
  phone?: string;
  status: string;
}

export interface WorkStage {
  id: string;
  work_id: string;
  name: string;
  order_index: number;
  start_date?: string;
  end_date?: string;
  progress_percentage: number;
}

export interface Checklist {
  id: string;
  stage_id: string;
  description: string;
  is_completed: boolean;
  completed_at?: string;
  completed_by?: string;
}

export interface DailyReport {
  id: string;
  work_id: string;
  author_id: string;
  report_date: string;
  weather_condition?: string;
  description?: string;
  created_at: string;
}

export interface Gallery {
  id: string;
  work_id: string;
  report_id?: string;
  image_url: string;
  phase?: PhaseType;
  upload_date: string;
}

export interface FinancialTransaction {
  id: string;
  work_id: string;
  type: TransactionType;
  category?: string;
  amount: number;
  transaction_date: string;
  description?: string;
}
