import { Bell, Download, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBusinessContext } from '@/contexts/BusinessContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRangeOption } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopBar() {
  const { currentBusiness, dateRangeOption, setDateRangeOption } = useBusinessContext();

  const dateOptions: { value: DateRangeOption; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground">
          {currentBusiness?.name || 'Dashboard'}
        </h1>
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-10 w-64 bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select 
          value={dateRangeOption} 
          onValueChange={(v) => setDateRangeOption(v as DateRangeOption)}
        >
          <SelectTrigger className="w-36 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="bg-background">
          <Download className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" className="bg-background relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            2
          </span>
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
