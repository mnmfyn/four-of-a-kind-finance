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
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Receipt, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const paymentMethods = ['Cash', 'Card', 'Bank Transfer', 'Other'];

export default function AddExpense() {
  const { currentBusiness, addExpense, categories, tags } = useBusinessContext();
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'purchase'>('expense');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [vendor, setVendor] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');

  const businessCategories = categories.filter(c => c.businessId === currentBusiness?.id);
  const businessTags = tags.filter(t => t.businessId === currentBusiness?.id);

  const handleSave = (addAnother: boolean = false) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Amount must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return;
    }

    addExpense({
      businessId: currentBusiness!.id,
      date: format(date, 'yyyy-MM-dd'),
      amount: parseFloat(amount),
      type,
      categoryId,
      tags: selectedTags,
      vendor: vendor || undefined,
      paymentMethod,
      notes: notes || undefined,
    });

    toast({
      title: `${type === 'expense' ? 'Expense' : 'Purchase'} Added`,
      description: `$${parseFloat(amount).toLocaleString()} recorded successfully`,
    });

    if (addAnother) {
      setAmount('');
      setNotes('');
      setVendor('');
    } else {
      setAmount('');
      setType('expense');
      setCategoryId('');
      setSelectedTags([]);
      setVendor('');
      setPaymentMethod('Cash');
      setNotes('');
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const quickCategories = businessCategories.slice(0, 4);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add Expense / Purchase</h1>
          <p className="text-muted-foreground">Record expenses and purchases for {currentBusiness?.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              New Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type Toggle */}
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={type === 'expense' ? 'default' : 'outline'}
                  onClick={() => setType('expense')}
                  className="flex-1"
                >
                  Expense
                </Button>
                <Button
                  type="button"
                  variant={type === 'purchase' ? 'default' : 'outline'}
                  onClick={() => setType('purchase')}
                  className="flex-1"
                >
                  Purchase
                </Button>
              </div>
            </div>

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

            {/* Quick Categories */}
            {quickCategories.length > 0 && (
              <div className="space-y-2">
                <Label>Quick Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {quickCategories.map((cat) => (
                    <Button
                      key={cat.id}
                      type="button"
                      variant={categoryId === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCategoryId(cat.id)}
                      className="gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Vendor (Optional)</Label>
                <Input
                  placeholder="Enter vendor name"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {businessTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.id) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
                {businessTags.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                )}
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
                placeholder="Add any notes about this expense..."
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
      </div>
    </MainLayout>
  );
}
