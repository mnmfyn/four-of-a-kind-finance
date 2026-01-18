import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CategoryItem {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface TopCategoriesListProps {
  categories: CategoryItem[];
}

export function TopCategoriesList({ categories }: TopCategoriesListProps) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Top Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-card-foreground">{category.name}</span>
              </div>
              <span className="font-semibold text-card-foreground">
                ${category.amount.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={category.percentage} 
              className="h-2"
              style={{ 
                ['--progress-color' as string]: category.color 
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
