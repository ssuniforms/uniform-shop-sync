import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Search, Package, Filter, AlertTriangle, MapPin, TrendingDown, ExternalLink } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { Link } from 'react-router-dom';

const LowStockManagement = () => {
  const { catalogues, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatalogue, setSelectedCatalogue] = useState<string>('all');
  const [stockThreshold, setStockThreshold] = useState<string>('10');
  const [sizeFilter, setSizeFilter] = useState<string>('all');

  // Get all items with their sizes and stock levels
  const allItemsWithSizes = useMemo(() => {
    const items: any[] = [];
    
    catalogues.forEach(catalogue => {
      catalogue.sections.forEach(section => {
        section.items.forEach(item => {
          // Add main item
          if (Number(item.stock) <= Number(stockThreshold)) {
            items.push({
              ...item,
              catalogueName: catalogue.name,
              sectionName: section.name,
              size: 'Standard',
              currentStock: item.stock,
              itemType: 'main'
            });
          }
          
          // Add size variants
          if (item.sizes && item.sizes.length > 0) {
            item.sizes.forEach((size: any) => {
              if (Number(size.stock) <= Number(stockThreshold)) {
                items.push({
                  ...item,
                  catalogueName: catalogue.name,
                  sectionName: section.name,
                  size: size.size,
                  price: size.price,
                  currentStock: size.stock,
                  itemType: 'size_variant'
                });
              }
            });
          }
        });
      });
    });
    
    return items;
  }, [catalogues, stockThreshold]);

  // Filter items
  const filteredItems = useMemo(() => {
    return allItemsWithSizes.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.catalogueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCatalogue = selectedCatalogue === 'all' || item.catalogue_id === selectedCatalogue;
      const matchesSize = sizeFilter === 'all' || item.size === sizeFilter;
      
      return matchesSearch && matchesCatalogue && matchesSize;
    });
  }, [allItemsWithSizes, searchTerm, selectedCatalogue, sizeFilter]);

  // Get unique sizes for filter
  const uniqueSizes = useMemo(() => {
    const sizes = new Set<string>();
    allItemsWithSizes.forEach(item => sizes.add(item.size));
    return Array.from(sizes).sort();
  }, [allItemsWithSizes]);

  const getStockLevel = (stock: number) => {
    if (stock === 0) return { level: 'out', color: 'destructive', text: 'Out of Stock' };
    if (stock <= 3) return { level: 'critical', color: 'destructive', text: 'Critical' };
    if (stock <= 5) return { level: 'low', color: 'destructive', text: 'Very Low' };
    if (stock <= 10) return { level: 'warning', color: 'secondary', text: 'Low' };
    return { level: 'normal', color: 'default', text: 'Normal' };
  };

  const getProgressValue = (stock: number) => {
    return Math.min((stock / 20) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading low stock items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text-primary mb-2 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              Low Stock Management
            </h1>
            <p className="text-xl text-muted-foreground">
              Monitor and manage inventory with low stock levels
            </p>
          </div>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-4 py-2">
            <TrendingDown className="w-4 h-4 mr-2" />
            {filteredItems.length} Low Stock Items
          </Badge>
        </div>

        {/* Filters */}
        <Card className="shadow-business">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items, catalogues, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCatalogue} onValueChange={setSelectedCatalogue}>
                <SelectTrigger>
                  <SelectValue placeholder="All Catalogues" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Catalogues</SelectItem>
                  {catalogues.map((catalogue) => (
                    <SelectItem key={catalogue.id} value={catalogue.id}>
                      {catalogue.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {uniqueSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockThreshold} onValueChange={setStockThreshold}>
                <SelectTrigger>
                  <SelectValue placeholder="Stock Threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Below 5 items</SelectItem>
                  <SelectItem value="10">Below 10 items</SelectItem>
                  <SelectItem value="15">Below 15 items</SelectItem>
                  <SelectItem value="20">Below 20 items</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card className="shadow-business">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Package className="h-16 w-16 text-green-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-green-700">All Items Well Stocked!</h3>
                <p className="text-muted-foreground text-lg">
                  No items found below the current stock threshold
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => {
                const stockInfo = getStockLevel(item.currentStock);
                const progressValue = getProgressValue(item.currentStock);
                
                return (
                  <Card key={`${item.id}-${item.size}-${index}`} className="shadow-business hover:shadow-business-hover transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-bold text-foreground">
                            {item.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {item.catalogueName} • {item.sectionName}
                          </p>
                        </div>
                        <Badge variant={stockInfo.color as any} className="text-xs">
                          {stockInfo.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Current Stock:</span>
                          <span className={`font-bold ${
                            item.currentStock === 0 ? 'text-red-600' : 
                            item.currentStock <= 3 ? 'text-red-500' : 
                            'text-orange-500'
                          }`}>
                            {item.currentStock} units
                          </span>
                        </div>
                        <Progress 
                          value={progressValue} 
                          className={`h-2 ${
                            item.currentStock === 0 ? 'bg-red-100' : 
                            item.currentStock <= 3 ? 'bg-red-100' : 
                            'bg-orange-100'
                          }`}
                        />
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Size:</span>
                          <Badge variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>Price:</span>
                          <span className="font-semibold text-primary">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {item.location}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link to="/admin/items" className="flex-1">
                          <Button size="sm" variant="outline" className="w-full text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Edit Item
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredItems.length > 0 && (
          <Card className="shadow-business bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Stock Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredItems.filter(item => item.currentStock === 0).length}
                  </p>
                  <p className="text-sm text-red-700">Out of Stock</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {filteredItems.filter(item => item.currentStock > 0 && item.currentStock <= 3).length}
                  </p>
                  <p className="text-sm text-red-600">Critical (1-3)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-500">
                    {filteredItems.filter(item => item.currentStock > 3 && item.currentStock <= 10).length}
                  </p>
                  <p className="text-sm text-orange-600">Low (4-10)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredItems.reduce((sum, item) => sum + item.currentStock, 0)}
                  </p>
                  <p className="text-sm text-blue-700">Total Units</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LowStockManagement;