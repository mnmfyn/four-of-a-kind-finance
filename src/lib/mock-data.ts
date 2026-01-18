import { Business, Sale, Expense, Category, Tag } from './types';

export const businesses: Business[] = [
  { id: '1', name: 'Mezan', colorTheme: 'emerald', icon: '🏪' },
  { id: '2', name: 'Sheffield Trading', colorTheme: 'blue', icon: '📦' },
  { id: '3', name: 'Esso Petrol Site', colorTheme: 'amber', icon: '⛽' },
  { id: '4', name: 'Spar Bid', colorTheme: 'rose', icon: '🛒' },
];

export const categories: Category[] = [
  { id: '1', businessId: '1', name: 'Utilities', color: '#3b82f6', budgetMonthly: 500 },
  { id: '2', businessId: '1', name: 'Rent', color: '#ef4444', budgetMonthly: 2000 },
  { id: '3', businessId: '1', name: 'Supplies', color: '#10b981', budgetMonthly: 800 },
  { id: '4', businessId: '1', name: 'Marketing', color: '#f59e0b', budgetMonthly: 300 },
  { id: '5', businessId: '1', name: 'Payroll', color: '#8b5cf6', budgetMonthly: 5000 },
  { id: '6', businessId: '2', name: 'Inventory', color: '#3b82f6', budgetMonthly: 3000 },
  { id: '7', businessId: '2', name: 'Shipping', color: '#10b981', budgetMonthly: 600 },
  { id: '8', businessId: '3', name: 'Fuel Stock', color: '#f59e0b', budgetMonthly: 10000 },
  { id: '9', businessId: '3', name: 'Equipment', color: '#8b5cf6', budgetMonthly: 1000 },
  { id: '10', businessId: '4', name: 'Stock', color: '#3b82f6', budgetMonthly: 5000 },
];

export const tags: Tag[] = [
  { id: '1', businessId: '1', name: 'Recurring', color: '#3b82f6' },
  { id: '2', businessId: '1', name: 'One-time', color: '#10b981' },
  { id: '3', businessId: '1', name: 'Urgent', color: '#ef4444' },
  { id: '4', businessId: '2', name: 'Recurring', color: '#3b82f6' },
  { id: '5', businessId: '3', name: 'Maintenance', color: '#f59e0b' },
  { id: '6', businessId: '4', name: 'Seasonal', color: '#8b5cf6' },
];

const generateRandomDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Other'];

export const generateSales = (businessId: string, count: number): Sale[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `sale-${businessId}-${i}`,
    businessId,
    date: generateRandomDate(90),
    amount: Math.floor(Math.random() * 2000) + 100,
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    notes: Math.random() > 0.7 ? 'Regular customer' : undefined,
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
  }));
};

export const generateExpenses = (businessId: string, count: number): Expense[] => {
  const businessCategories = categories.filter(c => c.businessId === businessId);
  const businessTags = tags.filter(t => t.businessId === businessId);
  const vendors = ['Supplier A', 'Vendor B', 'Wholesale Co', 'Local Shop', 'Online Store'];

  return Array.from({ length: count }, (_, i) => ({
    id: `expense-${businessId}-${i}`,
    businessId,
    date: generateRandomDate(90),
    amount: Math.floor(Math.random() * 1500) + 50,
    type: Math.random() > 0.5 ? 'expense' : 'purchase',
    categoryId: businessCategories[Math.floor(Math.random() * businessCategories.length)]?.id || '1',
    tags: businessTags.length > 0 && Math.random() > 0.5 
      ? [businessTags[Math.floor(Math.random() * businessTags.length)].id] 
      : [],
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    notes: Math.random() > 0.8 ? 'Monthly payment' : undefined,
    createdBy: 'user-1',
    createdAt: new Date().toISOString(),
  }));
};

export const allSales: Sale[] = [
  ...generateSales('1', 50),
  ...generateSales('2', 45),
  ...generateSales('3', 60),
  ...generateSales('4', 40),
];

export const allExpenses: Expense[] = [
  ...generateExpenses('1', 40),
  ...generateExpenses('2', 35),
  ...generateExpenses('3', 50),
  ...generateExpenses('4', 30),
];
