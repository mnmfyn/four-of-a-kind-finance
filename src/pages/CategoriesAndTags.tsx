import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useBusinessContext } from '@/contexts/BusinessContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Tags, FolderOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const colorOptions = [
  '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
];

export default function CategoriesAndTags() {
  const { currentBusiness, categories, tags, addCategory, addTag, updateCategory, updateTag, deleteCategory, deleteTag } = useBusinessContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(colorOptions[0]);
  const [newCategoryBudget, setNewCategoryBudget] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(colorOptions[0]);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);

  const businessCategories = categories.filter(c => c.businessId === currentBusiness?.id);
  const businessTags = tags.filter(t => t.businessId === currentBusiness?.id);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }

    addCategory({
      businessId: currentBusiness!.id,
      name: newCategoryName,
      color: newCategoryColor,
      budgetMonthly: newCategoryBudget ? parseFloat(newCategoryBudget) : undefined,
    });

    setNewCategoryName('');
    setNewCategoryBudget('');
    setCategoryDialogOpen(false);
    toast({ title: 'Category Added', description: `${newCategoryName} created successfully` });
  };

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast({ title: 'Error', description: 'Tag name is required', variant: 'destructive' });
      return;
    }

    addTag({
      businessId: currentBusiness!.id,
      name: newTagName,
      color: newTagColor,
    });

    setNewTagName('');
    setTagDialogOpen(false);
    toast({ title: 'Tag Added', description: `${newTagName} created successfully` });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    deleteCategory(id);
    toast({ title: 'Category Deleted', description: `${name} has been removed` });
  };

  const handleDeleteTag = (id: string, name: string) => {
    deleteTag(id);
    toast({ title: 'Tag Deleted', description: `${name} has been removed` });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories & Tags</h1>
          <p className="text-muted-foreground">Manage expense categories and tags for {currentBusiness?.name}</p>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="bg-card">
            <TabsTrigger value="categories" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="tags" className="gap-2">
              <Tags className="h-4 w-4" />
              Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          placeholder="Category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                newCategoryColor === color ? 'border-foreground scale-110' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewCategoryColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Budget (Optional)</Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newCategoryBudget}
                          onChange={(e) => setNewCategoryBudget(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddCategory}>Add Category</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {businessCategories.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No categories yet. Create one to get started.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {businessCategories.map((category) => (
                      <div
                        key={category.id}
                        className="p-4 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <div>
                              <h3 className="font-medium text-foreground">{category.name}</h3>
                              {category.budgetMonthly && (
                                <p className="text-sm text-muted-foreground">
                                  Budget: ${category.budgetMonthly.toLocaleString()}/mo
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteCategory(category.id, category.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tags</CardTitle>
                <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Tag</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          placeholder="Tag name"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                newTagColor === color ? 'border-foreground scale-110' : 'border-transparent'
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewTagColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTagDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddTag}>Add Tag</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {businessTags.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tags yet. Create one to get started.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {businessTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="text-foreground">{tag.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteTag(tag.id, tag.name)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
