export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeRecord {
  id: number;
  user_id: number;
  name: string;
  email: string;
  role: string;
  employee_code?: string;
  department?: string;
  designation?: string;
  phone?: string;
  address?: string;
  salary?: number;
  hire_date?: string;
  status?: string;
  manager_name?: string;
}

export interface LoginActivityRecord {
  id: number;
  userId: number;
  email: string;
  lastLoginTime: string;
}

export interface FinancialRecord {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  user_role?: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: Array<{
    category: string;
    type: string;
    totalAmount: number;
  }>;
  recentTransactions: FinancialRecord[];
}

export interface DashboardTrends {
  monthlyTotals: Array<{
    period: string;
    type: string;
    totalAmount: number;
  }>;
  weeklyTotals: Array<{
    year: number;
    week: number;
    type: string;
    totalAmount: number;
  }>;
}
