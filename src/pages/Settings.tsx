import { MainLayout } from '@/components/layout/MainLayout';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building2, Bell, Shield, Palette, Database, Users } from 'lucide-react';

export default function Settings() {
  const { currentBusiness } = useBusinessContext();

  const settingsGroups = [
    {
      title: 'Business Info',
      description: 'Manage your business details',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input defaultValue={currentBusiness?.name} />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input defaultValue="USD" />
          </div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      description: 'Configure alert preferences',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Budget Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when spending exceeds budget</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Daily Summary</p>
              <p className="text-sm text-muted-foreground">Receive daily transaction summary</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Unusual Activity</p>
              <p className="text-sm text-muted-foreground">Alert for unusual spending patterns</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      ),
    },
    {
      title: 'Appearance',
      description: 'Customize the look and feel',
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle dark theme</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Compact View</p>
              <p className="text-sm text-muted-foreground">Show more content in less space</p>
            </div>
            <Switch />
          </div>
        </div>
      ),
    },
    {
      title: 'Data Management',
      description: 'Export and backup options',
      icon: Database,
      content: (
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            Export All Data (CSV)
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2">
            Export All Data (PDF)
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
            Clear All Data
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage preferences for {currentBusiness?.name}</p>
        </div>

        <div className="grid gap-6">
          {settingsGroups.map((group) => (
            <Card key={group.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <group.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{group.title}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{group.content}</CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </MainLayout>
  );
}
