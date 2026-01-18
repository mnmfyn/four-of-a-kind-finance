import { MainLayout } from '@/components/layout/MainLayout';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PieChart, Users, TrendingUp, Download } from 'lucide-react';
import { useMemo } from 'react';
import { format, parseISO, isWithinInterval } from 'date-fns';

export default function Reports() {
  const { currentBusiness, sales, expenses, categories, getDateRange } = useBusinessContext();

  const { from: dateFrom, to: dateTo } = getDateRange();

  const businessSales = sales.filter(s => s.businessId === currentBusiness?.id);
  const businessExpenses = expenses.filter(e => e.businessId === currentBusiness?.id);
  const businessCategories = categories.filter(c => c.businessId === currentBusiness?.id);

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

  const categorySpending = businessCategories.map(cat => {
    const spent = filteredExpenses
      .filter(e => e.categoryId === cat.id)
      .reduce((sum, e) => sum + e.amount, 0);
    return { category: cat.name, color: cat.color, spent, budget: cat.budgetMonthly || 0 };
  }).filter(c => c.spent > 0).sort((a, b) => b.spent - a.spent);

  const vendorSpending = useMemo(() => {
    const vendorMap = new Map<string, number>();
    filteredExpenses.forEach(e => {
      if (e.vendor) {
        vendorMap.set(e.vendor, (vendorMap.get(e.vendor) || 0) + e.amount);
      }
    });
    return Array.from(vendorMap.entries())
      .map(([vendor, amount]) => ({ vendor, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [filteredExpenses]);

  const reportCards = [
    {
      title: 'Profit & Loss Summary',
      description: 'Complete income and expense breakdown',
      icon: FileText,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Category Spending',
      description: 'Expenses broken down by category',
      icon: PieChart,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: 'Vendor Report',
      description: 'Top vendors by spending amount',
      icon: Users,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      title: 'Sales Summary',
      description: 'Daily and monthly sales trends',
      icon: TrendingUp,
      color: 'bg-blue-500/10 text-blue-600',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">
              {format(dateFrom, 'MMM d, yyyy')} - {format(dateTo, 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Report Type Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportCards.map((report) => (
            <Card key={report.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center mb-4`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
                <Button variant="ghost" size="sm" className="mt-4 gap-2 p-0">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profit & Loss */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Profit & Loss Summary
            </CardTitle>
            <CardDescription>Financial overview for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10">
                <span className="font-medium text-foreground">Total Sales</span>
                <span className="text-xl font-bold text-emerald-600">+${totalSales.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-rose-500/10">
                <span className="font-medium text-foreground">Total Expenses</span>
                <span className="text-xl font-bold text-rose-600">-${totalExpenses.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-amber-500/10">
                <span className="font-medium text-foreground">Total Purchases</span>
                <span className="text-xl font-bold text-amber-600">-${totalPurchases.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className={`flex items-center justify-between p-4 rounded-lg ${netProfit >= 0 ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                  <span className="text-lg font-semibold text-foreground">Net Profit</span>
                  <span className={`text-2xl font-bold ${netProfit >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {netProfit >= 0 ? '+' : '-'}${Math.abs(netProfit).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Spending */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald-600" />
                Category Spending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categorySpending.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No spending data</p>
              ) : (
                categorySpending.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-foreground">{cat.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">${cat.spent.toLocaleString()}</span>
                      {cat.budget > 0 && (
                        <span className="text-sm text-muted-foreground ml-2">
                          / ${cat.budget.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Vendor Spending */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                Top Vendors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vendorSpending.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No vendor data</p>
              ) : (
                vendorSpending.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                      </div>
                      <span className="text-foreground">{v.vendor}</span>
                    </div>
                    <span className="font-semibold text-foreground">${v.amount.toLocaleString()}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
