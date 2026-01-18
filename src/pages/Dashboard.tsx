import { useBusinessContext } from '@/contexts/BusinessContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { SalesExpensesChart } from '@/components/dashboard/SalesExpensesChart';
import { ExpensesPurchasesChart } from '@/components/dashboard/ExpensesPurchasesChart';
import { CategoryDonutChart } from '@/components/dashboard/CategoryDonutChart';
import { TopCategoriesList } from '@/components/dashboard/TopCategoriesList';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { AlertsInsights } from '@/components/dashboard/AlertsInsights';
import { DollarSign, TrendingDown, ShoppingCart, TrendingUp, BarChart3, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns';

export default function Dashboard() {
  const { currentBusiness, sales, expenses, categories, getDateRange, dateRangeOption } = useBusinessContext();

  const businessSales = useMemo(() => 
    sales.filter(s => s.businessId === currentBusiness?.id),
    [sales, currentBusiness]
  );

  const businessExpenses = useMemo(() => 
    expenses.filter(e => e.businessId === currentBusiness?.id),
    [expenses, currentBusiness]
  );

  const businessCategories = useMemo(() => 
    categories.filter(c => c.businessId === currentBusiness?.id),
    [categories, currentBusiness]
  );

  const { from: dateFrom, to: dateTo } = getDateRange();

  const filteredSales = useMemo(() => 
    businessSales.filter(s => {
      const saleDate = parseISO(s.date);
      return isWithinInterval(saleDate, { start: dateFrom, end: dateTo });
    }),
    [businessSales, dateFrom, dateTo]
  );

  const filteredExpenses = useMemo(() => 
    businessExpenses.filter(e => {
      const expenseDate = parseISO(e.date);
      return isWithinInterval(expenseDate, { start: dateFrom, end: dateTo });
    }),
    [businessExpenses, dateFrom, dateTo]
  );

  const totalSales = filteredSales.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = filteredExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const totalPurchases = filteredExpenses.filter(e => e.type === 'purchase').reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses - totalPurchases;
  const avgDailySales = filteredSales.length > 0 ? totalSales / Math.max(1, new Set(filteredSales.map(s => s.date)).size) : 0;

  const chartData = useMemo(() => {
    const getIntervals = () => {
      if (dateRangeOption === 'today' || dateRangeOption === 'week') {
        return eachDayOfInterval({ start: dateFrom, end: dateTo });
      } else if (dateRangeOption === 'month') {
        return eachWeekOfInterval({ start: dateFrom, end: dateTo });
      } else {
        return eachMonthOfInterval({ start: dateFrom, end: dateTo });
      }
    };

    const intervals = getIntervals();
    
    return intervals.slice(0, 12).map((date, idx) => {
      const nextDate = intervals[idx + 1] || dateTo;
      const intervalSales = filteredSales.filter(s => {
        const saleDate = parseISO(s.date);
        return saleDate >= date && saleDate < nextDate;
      });
      const intervalExpenses = filteredExpenses.filter(e => {
        const expenseDate = parseISO(e.date);
        return expenseDate >= date && expenseDate < nextDate;
      });

      return {
        name: format(date, dateRangeOption === 'year' || dateRangeOption === 'quarter' ? 'MMM' : 'MMM d'),
        sales: intervalSales.reduce((sum, s) => sum + s.amount, 0),
        expenses: intervalExpenses.reduce((sum, e) => sum + e.amount, 0),
      };
    });
  }, [filteredSales, filteredExpenses, dateFrom, dateTo, dateRangeOption]);

  const expensesPurchasesData = useMemo(() => {
    return chartData.map(d => ({
      name: d.name,
      expenses: filteredExpenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0) / Math.max(1, chartData.length),
      purchases: filteredExpenses.filter(e => e.type === 'purchase').reduce((sum, e) => sum + e.amount, 0) / Math.max(1, chartData.length),
    }));
  }, [chartData, filteredExpenses]);

  const categoryData = useMemo(() => {
    const categoryTotals = businessCategories.map(cat => {
      const total = filteredExpenses
        .filter(e => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return { name: cat.name, value: total, color: cat.color };
    }).filter(c => c.value > 0);

    return categoryTotals.sort((a, b) => b.value - a.value).slice(0, 5);
  }, [businessCategories, filteredExpenses]);

  const topCategoriesList = useMemo(() => {
    const maxAmount = Math.max(...categoryData.map(c => c.value), 1);
    return categoryData.map(c => ({
      ...c,
      amount: c.value,
      percentage: (c.value / maxAmount) * 100,
    }));
  }, [categoryData]);

  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...filteredSales.map(s => ({
        id: s.id,
        type: 'sale' as const,
        description: s.notes || 'Daily Sale',
        amount: s.amount,
        date: format(parseISO(s.date), 'MMM d, yyyy'),
      })),
      ...filteredExpenses.map(e => ({
        id: e.id,
        type: e.type as 'expense' | 'purchase',
        description: e.notes || businessCategories.find(c => c.id === e.categoryId)?.name || 'Expense',
        amount: e.amount,
        date: format(parseISO(e.date), 'MMM d, yyyy'),
      })),
    ];

    return allTransactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [filteredSales, filteredExpenses, businessCategories]);

  const alerts = [
    { id: '1', type: 'warning' as const, title: 'Budget Alert', description: 'Utilities category is at 85% of monthly budget' },
    { id: '2', type: 'info' as const, title: 'Sales Trend', description: 'Sales are up 12% compared to last week' },
    { id: '3', type: 'success' as const, title: 'Target Met', description: 'Monthly profit target achieved!' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <KPICard
            title="Total Sales"
            value={`$${totalSales.toLocaleString()}`}
            change={12}
            icon={DollarSign}
            variant="success"
          />
          <KPICard
            title="Total Expenses"
            value={`$${totalExpenses.toLocaleString()}`}
            change={-5}
            icon={TrendingDown}
            variant="danger"
          />
          <KPICard
            title="Total Purchases"
            value={`$${totalPurchases.toLocaleString()}`}
            change={8}
            icon={ShoppingCart}
            variant="warning"
          />
          <KPICard
            title="Net Profit"
            value={`$${netProfit.toLocaleString()}`}
            change={netProfit >= 0 ? 15 : -10}
            icon={TrendingUp}
            variant={netProfit >= 0 ? 'success' : 'danger'}
          />
          <KPICard
            title="Avg Daily Sales"
            value={`$${Math.round(avgDailySales).toLocaleString()}`}
            icon={BarChart3}
          />
          <KPICard
            title="Top Category"
            value={categoryData[0]?.name || 'N/A'}
            icon={Wallet}
          />
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <SalesExpensesChart data={chartData} />
          <ExpensesPurchasesChart data={expensesPurchasesData} />
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-4 gap-6">
          <CategoryDonutChart data={categoryData} />
          <TopCategoriesList categories={topCategoriesList} />
          <RecentTransactions transactions={recentTransactions} />
          <AlertsInsights alerts={alerts} />
        </div>
      </div>
    </MainLayout>
  );
}
