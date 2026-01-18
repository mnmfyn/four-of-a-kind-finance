export interface Business {
  id: string;
  name: string;
  colorTheme: string;
  icon: string;
}

export interface Sale {
  id: string;
  businessId: string;
  date: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  businessId: string;
  date: string;
  amount: number;
  type: 'expense' | 'purchase';
  categoryId: string;
  tags: string[];
  vendor?: string;
  paymentMethod: string;
  notes?: string;
  attachmentUrl?: string;
  createdBy: string;
  createdAt: string;
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  color: string;
  budgetMonthly?: number;
}

export interface Tag {
  id: string;
  businessId: string;
  name: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  allowedBusinessIds: string[];
}

export type DateRangeOption = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface DateRange {
  from: Date;
  to: Date;
}
