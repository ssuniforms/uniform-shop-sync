import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Image, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CatalogueInput } from '@/types';

const CatalogueManagement = () => {
  const { catalogues, addCatalogue, updateCatalogue, deleteCatalogue, loading } = useData()!;
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCatalogue, setSelectedCatalogue] = useState<any>(null);
  const [formData, setFormData] = useState<CatalogueInput>({
    name: '',
    description: '',
    image: ''
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Creating catalogue with data:', formData);
    
    const id = await addCatalogue(formData);
    if (id) {
      toast({
        title: "Success",
        description: "Catalogue created successfully",
      });
      setIsCreateOpen(false);
      setFormData({ name: '', description: '', image: '' });
      console.log('Catalogue created successfully, ID:', id);
    } else {
      console.error('Failed to create catalogue');
      toast({
        title: "Error",
        description: "Failed to create catalogue",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateCatalogue(selectedCatalogue.id, formData);
    if (success) {
      toast({
        title: "Success",
        description: "Catalogue updated successfully",
      });
      setIsEditOpen(false);
      setSelectedCatalogue(null);
      setFormData({ name: '', description: '', image: '' });
    } else {
      toast({
        title: "Error",
        description: "Failed to update catalogue",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will also delete all items in this catalogue.`)) {
      const success = await deleteCatalogue(id);
      if (success) {
        toast({
          title: "Success",
          description: "Catalogue deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete catalogue",
          variant: "destructive",
        });
      }
    }
  };

  const openEditDialog = (catalogue: any) => {
    setSelectedCatalogue(catalogue);
    setFormData({
      name: catalogue.name,
      description: catalogue.description,
      image: catalogue.image
    });
    setIsEditOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Catalogue Management</h1>
          <p className="text-muted-foreground">Manage school uniform catalogues</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Catalogue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Catalogue</DialogTitle>
              <DialogDescription>
                Add a new school or organization catalogue
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">School/Organization Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Greenwood High School"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the uniform collection"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/catalogue-image.jpg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Catalogue</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogues.map((catalogue) => (
          <Card key={catalogue.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {catalogue.image ? (
                <img
                  src={catalogue.image}
                  alt={catalogue.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Image className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {catalogue.name}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(catalogue)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(catalogue.id, catalogue.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{catalogue.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {catalogue.sections?.reduce((total, section) => total + section.items.length, 0) || 0} items
                </div>
                <div className="text-xs">
                  Order: {catalogue.order}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Catalogue</DialogTitle>
            <DialogDescription>
              Update catalogue information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">School/Organization Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Catalogue</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatalogueManagement;