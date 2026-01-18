import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  type: 'sale' | 'expense' | 'purchase';
  description: string;
  amount: number;
  date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const typeStyles = {
    sale: { 
      badge: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
      icon: ArrowUpRight,
      prefix: '+'
    },
    expense: { 
      badge: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20',
      icon: ArrowDownRight,
      prefix: '-'
    },
    purchase: { 
      badge: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20',
      icon: ArrowDownRight,
      prefix: '-'
    },
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((transaction) => {
          const style = typeStyles[transaction.type];
          const Icon = style.icon;
          
          return (
            <div 
              key={transaction.id} 
              className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  transaction.type === 'sale' ? 'bg-emerald-500/10' : 'bg-rose-500/10'
                )}>
                  <Icon className={cn(
                    "h-4 w-4",
                    transaction.type === 'sale' ? 'text-emerald-600' : 'text-rose-600'
                  )} />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-sm font-semibold",
                  transaction.type === 'sale' ? 'text-emerald-600' : 'text-rose-600'
                )}>
                  {style.prefix}${transaction.amount.toLocaleString()}
                </p>
                <Badge variant="secondary" className={style.badge}>
                  {transaction.type}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
