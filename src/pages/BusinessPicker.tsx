import { useBusinessContext } from '@/contexts/BusinessContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const businessStyles: Record<string, { gradient: string; bg: string }> = {
  emerald: { 
    gradient: 'from-emerald-500 to-emerald-600', 
    bg: 'bg-emerald-500/10 hover:bg-emerald-500/20' 
  },
  blue: { 
    gradient: 'from-blue-500 to-blue-600', 
    bg: 'bg-blue-500/10 hover:bg-blue-500/20' 
  },
  amber: { 
    gradient: 'from-amber-500 to-amber-600', 
    bg: 'bg-amber-500/10 hover:bg-amber-500/20' 
  },
  rose: { 
    gradient: 'from-rose-500 to-rose-600', 
    bg: 'bg-rose-500/10 hover:bg-rose-500/20' 
  },
};

export default function BusinessPicker() {
  const { businesses, setCurrentBusiness, sales, expenses } = useBusinessContext();
  const navigate = useNavigate();

  const getBusinessStats = (businessId: string) => {
    const businessSales = sales.filter(s => s.businessId === businessId);
    const businessExpenses = expenses.filter(e => e.businessId === businessId);
    
    const totalSales = businessSales.reduce((sum, s) => sum + s.amount, 0);
    const totalExpenses = businessExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    return {
      sales: totalSales,
      expenses: totalExpenses,
      profit: totalSales - totalExpenses,
    };
  };

  const handleSelectBusiness = (business: typeof businesses[0]) => {
    setCurrentBusiness(business);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Financial Dashboard</h1>
            <p className="text-xs text-muted-foreground">Multi-Business Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container max-w-6xl py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">Select a Business</h2>
          <p className="text-muted-foreground">
            Choose one of your businesses to view dashboard, add entries, and generate reports
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {businesses.map((business) => {
            const stats = getBusinessStats(business.id);
            const style = businessStyles[business.colorTheme];
            
            return (
              <Card 
                key={business.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary/20"
                onClick={() => handleSelectBusiness(business)}
              >
                <div className={cn("h-2 bg-gradient-to-r", style.gradient)} />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg",
                        style.gradient
                      )}>
                        {business.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-card-foreground">
                          {business.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Financial Overview
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-emerald-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Sales</p>
                      <p className="text-lg font-bold text-emerald-600">
                        ${stats.sales.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-rose-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Expenses</p>
                      <p className="text-lg font-bold text-rose-600">
                        ${stats.expenses.toLocaleString()}
                      </p>
                    </div>
                    <div className={cn(
                      "text-center p-3 rounded-lg",
                      stats.profit >= 0 ? 'bg-primary/10' : 'bg-destructive/10'
                    )}>
                      <p className="text-xs text-muted-foreground mb-1">Profit</p>
                      <p className={cn(
                        "text-lg font-bold",
                        stats.profit >= 0 ? 'text-primary' : 'text-destructive'
                      )}>
                        ${stats.profit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
