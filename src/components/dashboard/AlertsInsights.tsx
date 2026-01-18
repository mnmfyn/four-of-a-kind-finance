import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
}

interface AlertsInsightsProps {
  alerts: Alert[];
}

export function AlertsInsights({ alerts }: AlertsInsightsProps) {
  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-500/10',
      text: 'text-amber-600',
      border: 'border-l-amber-500',
    },
    info: {
      icon: TrendingUp,
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-l-primary',
    },
    success: {
      icon: Target,
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      border: 'border-l-emerald-500',
    },
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Alerts & Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          
          return (
            <div
              key={alert.id}
              className={cn(
                "p-3 rounded-lg border-l-4",
                config.bg,
                config.border
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn("h-5 w-5 mt-0.5", config.text)} />
                <div>
                  <p className={cn("text-sm font-medium", config.text)}>
                    {alert.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
