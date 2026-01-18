import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Download, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

type SortField = 'date' | 'amount' | 'type';
type SortDirection = 'asc' | 'desc';

export default function Transactions() {
  const { currentBusiness, sales, expenses, categories, tags } = useBusinessContext();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const businessCategories = categories.filter(c => c.businessId === currentBusiness?.id);

  const allTransactions = useMemo(() => {
    const salesData = sales
      .filter(s => s.businessId === currentBusiness?.id)
      .map(s => ({
        id: s.id,
        date: s.date,
        type: 'sale' as const,
        category: 'Sales',
        categoryColor: '#10b981',
        tags: [] as string[],
        amount: s.amount,
        paymentMethod: s.paymentMethod,
        vendor: undefined,
        notes: s.notes,
      }));

    const expensesData = expenses
      .filter(e => e.businessId === currentBusiness?.id)
      .map(e => {
        const cat = businessCategories.find(c => c.id === e.categoryId);
        const entryTags = tags
          .filter(t => e.tags.includes(t.id))
          .map(t => t.name);
        
        return {
          id: e.id,
          date: e.date,
          type: e.type,
          category: cat?.name || 'Uncategorized',
          categoryColor: cat?.color || '#6b7280',
          tags: entryTags,
          amount: e.amount,
          paymentMethod: e.paymentMethod,
          vendor: e.vendor,
          notes: e.notes,
        };
      });

    return [...salesData, ...expensesData];
  }, [sales, expenses, currentBusiness, businessCategories, tags]);

  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.notes?.toLowerCase().includes(searchLower) ||
        t.vendor?.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower) ||
        t.paymentMethod.toLowerCase().includes(searchLower)
      );
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allTransactions, typeFilter, categoryFilter, search, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const typeStyles = {
    sale: 'bg-emerald-500/10 text-emerald-600',
    expense: 'bg-rose-500/10 text-rose-600',
    purchase: 'bg-amber-500/10 text-amber-600',
  };

  const uniqueCategories = [...new Set(allTransactions.map(t => t.category))];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground">View and manage all transactions</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by vendor, notes, category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sale">Sales</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                    <SelectItem value="purchase">Purchases</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        Date
                        <SortIcon field="date" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center">
                        Type
                        <SortIcon field="type" />
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-muted text-right"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center justify-end">
                        Amount
                        <SortIcon field="amount" />
                      </div>
                    </TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Vendor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell className="font-medium">
                          {format(parseISO(transaction.date), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("capitalize", typeStyles[transaction.type])}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: transaction.categoryColor }}
                            />
                            {transaction.category}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {transaction.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {transaction.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{transaction.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-semibold",
                          transaction.type === 'sale' ? 'text-emerald-600' : 'text-rose-600'
                        )}>
                          {transaction.type === 'sale' ? '+' : '-'}${transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {transaction.paymentMethod}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {transaction.vendor || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {allTransactions.length} transactions
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
