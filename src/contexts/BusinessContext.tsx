import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Business, Sale, Expense, Category, Tag, DateRange, DateRangeOption } from '@/lib/types';
import { businesses, categories as mockCategories, tags as mockTags, allSales, allExpenses } from '@/lib/mock-data';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

interface BusinessContextType {
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business | null) => void;
  businesses: Business[];
  sales: Sale[];
  expenses: Expense[];
  categories: Category[];
  tags: Tag[];
  addSale: (sale: Omit<Sale, 'id' | 'createdAt' | 'createdBy'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'createdBy'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteCategory: (id: string) => void;
  deleteTag: (id: string) => void;
  dateRangeOption: DateRangeOption;
  setDateRangeOption: (option: DateRangeOption) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  getDateRange: () => DateRange;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  return context;
};

export const BusinessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [sales, setSales] = useState<Sale[]>(allSales);
  const [expenses, setExpenses] = useState<Expense[]>(allExpenses);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [dateRangeOption, setDateRangeOption] = useState<DateRangeOption>('month');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const getDateRange = (): DateRange => {
    const now = new Date();
    switch (dateRangeOption) {
      case 'today':
        return { from: startOfDay(now), to: endOfDay(now) };
      case 'week':
        return { from: startOfWeek(now), to: endOfWeek(now) };
      case 'month':
        return { from: startOfMonth(now), to: endOfMonth(now) };
      case 'quarter':
        return { from: startOfQuarter(now), to: endOfQuarter(now) };
      case 'year':
        return { from: startOfYear(now), to: endOfYear(now) };
      case 'custom':
        return dateRange;
      default:
        return { from: startOfMonth(now), to: endOfMonth(now) };
    }
  };

  const addSale = (sale: Omit<Sale, 'id' | 'createdAt' | 'createdBy'>) => {
    const newSale: Sale = {
      ...sale,
      id: `sale-${Date.now()}`,
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
    };
    setSales(prev => [...prev, newSale]);
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'createdBy'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `expense-${Date.now()}`,
      createdBy: 'user-1',
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: `tag-${Date.now()}`,
    };
    setTags(prev => [...prev, newTag]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const updateTag = (id: string, updates: Partial<Tag>) => {
    setTags(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const deleteTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  return (
    <BusinessContext.Provider
      value={{
        currentBusiness,
        setCurrentBusiness,
        businesses,
        sales,
        expenses,
        categories,
        tags,
        addSale,
        addExpense,
        addCategory,
        addTag,
        updateCategory,
        updateTag,
        deleteCategory,
        deleteTag,
        dateRangeOption,
        setDateRangeOption,
        dateRange,
        setDateRange,
        getDateRange,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};
