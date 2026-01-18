import { 
  LayoutDashboard, 
  DollarSign, 
  Receipt, 
  FileText, 
  Tags, 
  Settings,
  List,
  ChevronLeft
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Add Sales', url: '/add-sales', icon: DollarSign },
  { title: 'Add Expense', url: '/add-expense', icon: Receipt },
  { title: 'Transactions', url: '/transactions', icon: List },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Categories & Tags', url: '/categories', icon: Tags },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const { currentBusiness, setCurrentBusiness } = useBusinessContext();
  const [collapsed, setCollapsed] = useState(false);

  const businessColors: Record<string, string> = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
  };

  return (
    <aside 
      className={cn(
        "bg-secondary text-secondary-foreground min-h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm",
                businessColors[currentBusiness?.colorTheme || 'blue']
              )}>
                {currentBusiness?.icon || '📊'}
              </div>
              <div>
                <h2 className="font-semibold text-sm truncate">{currentBusiness?.name || 'Financial'}</h2>
                <p className="text-xs text-muted">Dashboard</p>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-secondary-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted hover:bg-sidebar-accent hover:text-secondary-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={() => setCurrentBusiness(null)}
          className={cn(
            "w-full justify-start gap-2 text-muted hover:text-secondary-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          {!collapsed && <span>Switch Business</span>}
        </Button>
      </div>
    </aside>
  );
}
