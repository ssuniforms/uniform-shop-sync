import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Image, Package, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ItemInput, SectionType, SizePriceInput } from '@/types';

const ItemManagement = () => {
  const { catalogues, addItem, updateItem, deleteItem, loading } = useData()!;
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedCatalogue, setSelectedCatalogue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState<string>('all');
  const [formData, setFormData] = useState<ItemInput>({
    catalogue_id: '',
    name: '',
    material: '',
    location: '',
    stock: 0,
    price: 0,
    image: '',
    section_type: 'summer',
    sizes: []
  });
  const [sizePrices, setSizePrices] = useState<SizePriceInput[]>([]);

  const allItems = catalogues.flatMap(catalogue =>
    catalogue.sections.flatMap(section =>
      section.items.map(item => ({
        ...item,
        catalogueName: catalogue.name,
        sectionName: section.name
      }))
    )
  );

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.catalogueName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = filterSection === 'all' || item.section_type === filterSection;
    return matchesSearch && matchesSection;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.catalogue_id) {
      toast({
        title: "Validation Error",
        description: "Please select a catalogue",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Creating item with data:', formData);
    console.log('Size prices:', sizePrices);
    
    const itemData = { ...formData, sizes: sizePrices };
    const id = await addItem(itemData);
    if (id) {
      toast({
        title: "Success",
        description: "Item created successfully",
      });
      setIsCreateOpen(false);
      resetForm();
    } else {
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = { ...formData, sizes: sizePrices };
    const success = await updateItem(selectedItem.id, itemData);
    if (success) {
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setIsEditOpen(false);
      setSelectedItem(null);
      resetForm();
    } else {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const success = await deleteItem(id);
      if (success) {
        toast({
          title: "Success",
          description: "Item deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete item",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      catalogue_id: '',
      name: '',
      material: '',
      location: '',
      stock: 0,
      price: 0,
      image: '',
      section_type: 'summer',
      sizes: []
    });
    setSizePrices([]);
  };

  const openEditDialog = (item: any) => {
    setSelectedItem(item);
    setFormData({
      catalogue_id: item.catalogue_id,
      name: item.name,
      material: item.material,
      location: item.location,
      stock: item.stock,
      price: item.price,
      image: item.image,
      section_type: item.section_type,
      sizes: item.sizes || []
    });
    setSizePrices(item.sizes || []);
    setIsEditOpen(true);
  };

  const addSizePrice = () => {
    setSizePrices([...sizePrices, { size: '', price: 0 }]);
  };

  const updateSizePrice = (index: number, field: 'size' | 'price', value: string | number) => {
    const updated = sizePrices.map((sp, i) => 
      i === index ? { ...sp, [field]: value } : sp
    );
    setSizePrices(updated);
  };

  const removeSizePrice = (index: number) => {
    setSizePrices(sizePrices.filter((_, i) => i !== index));
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
          <h1 className="text-3xl font-bold text-foreground">Item Management</h1>
          <p className="text-muted-foreground">Manage uniform items and inventory</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
              <DialogDescription>
                Add a new uniform item to the inventory
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="catalogue">Catalogue</Label>
                  <Select 
                    value={formData.catalogue_id} 
                    onValueChange={(value) => setFormData({ ...formData, catalogue_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select catalogue" />
                    </SelectTrigger>
                    <SelectContent>
                      {catalogues.map(catalogue => (
                        <SelectItem key={catalogue.id} value={catalogue.id}>
                          {catalogue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="section_type">Section Type</Label>
                  <Select 
                    value={formData.section_type} 
                    onValueChange={(value: SectionType) => setFormData({ ...formData, section_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., White Shirt"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g., Cotton blend"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Storage Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Shelf A-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Base Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/item-image.jpg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Size Variants & Pricing</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSizePrice}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Size
                  </Button>
                </div>
                <div className="space-y-2">
                  {sizePrices.map((sp, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Size (e.g., S, M, L)"
                        value={sp.size}
                        onChange={(e) => updateSizePrice(index, 'size', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Price"
                        type="number"
                        step="0.01"
                        value={sp.price}
                        onChange={(e) => updateSizePrice(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSizePrice(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Item</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterSection} onValueChange={setFilterSection}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            <SelectItem value="summer">Summer</SelectItem>
            <SelectItem value="winter">Winter</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square bg-muted relative">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              {item.stock < 6 && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Low Stock
                </Badge>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex justify-between items-start">
                <span>{item.name}</span>
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(item)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="text-xs">
                {item.catalogueName} - {item.sectionName}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stock:</span>
                <span className={item.stock < 6 ? 'text-destructive font-medium' : ''}>
                  {item.stock}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Price:</span>
                <span>${item.price}</span>
              </div>
              {item.material && (
                <div className="text-xs text-muted-foreground">
                  Material: {item.material}
                </div>
              )}
              {item.location && (
                <div className="text-xs text-muted-foreground">
                  Location: {item.location}
                </div>
              )}
              {item.sizes && item.sizes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.sizes.map((size, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {size.size}: ${size.price}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update item information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            {/* Same form fields as create, but with edit values */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-catalogue">Catalogue</Label>
                <Select 
                  value={formData.catalogue_id} 
                  onValueChange={(value) => setFormData({ ...formData, catalogue_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select catalogue" />
                  </SelectTrigger>
                  <SelectContent>
                    {catalogues.map(catalogue => (
                      <SelectItem key={catalogue.id} value={catalogue.id}>
                        {catalogue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-section_type">Section Type</Label>
                <Select 
                  value={formData.section_type} 
                  onValueChange={(value: SectionType) => setFormData({ ...formData, section_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summer">Summer</SelectItem>
                    <SelectItem value="winter">Winter</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-name">Item Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-material">Material</Label>
                <Input
                  id="edit-material"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Storage Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  min="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Base Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Size Variants & Pricing</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSizePrice}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Size
                </Button>
              </div>
              <div className="space-y-2">
                {sizePrices.map((sp, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Size (e.g., S, M, L)"
                      value={sp.size}
                      onChange={(e) => updateSizePrice(index, 'size', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Price"
                      type="number"
                      step="0.01"
                      value={sp.price}
                      onChange={(e) => updateSizePrice(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSizePrice(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemManagement;