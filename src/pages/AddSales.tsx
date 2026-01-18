import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, DollarSign, Plus, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Other'];

export default function AddSales() {
  const { currentBusiness, addSale, sales } = useBusinessContext();
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');

  const todaySales = sales
    .filter(s => s.businessId === currentBusiness?.id && s.date === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, s) => sum + s.amount, 0);

  const handleSave = (addAnother: boolean = false) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Amount must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    addSale({
      businessId: currentBusiness!.id,
      date: format(date, 'yyyy-MM-dd'),
      amount: parseFloat(amount),
      paymentMethod,
      notes: notes || undefined,
    });

    toast({
      title: 'Sale Added',
      description: `$${parseFloat(amount).toLocaleString()} sale recorded successfully`,
    });

    if (addAnother) {
      setAmount('');
      setNotes('');
    } else {
      setAmount('');
      setPaymentMethod('Cash');
      setNotes('');
    }
  };

  const recentSales = sales
    .filter(s => s.businessId === currentBusiness?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add Sales</h1>
            <p className="text-muted-foreground">Record daily sales for {currentBusiness?.name}</p>
          </div>
          <Card className="bg-emerald-500/10 border-emerald-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Sales</p>
                <p className="text-xl font-bold text-emerald-600">${todaySales.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                New Sale Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any notes about this sale..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={() => handleSave(false)} className="flex-1">
                  Save
                </Button>
                <Button onClick={() => handleSave(true)} variant="secondary" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Save & Add Another
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentSales.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No sales recorded yet
                </p>
              ) : (
                recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {format(parseISO(sale.date), 'MMM d, yyyy')}
                      </p>
                      <p className="text-xs text-muted-foreground">{sale.paymentMethod}</p>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">
                      +${sale.amount.toLocaleString()}
                    </p>
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
