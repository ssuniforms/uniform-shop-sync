import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Package, Filter, Grid, List, ShoppingCart, ArrowLeft, Image, Plus, Minus, Sparkles } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { SectionType, Catalogue } from '@/types';

const Catalogues = () => {
  const { catalogues, loading } = useData();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatalogue, setSelectedCatalogue] = useState<Catalogue | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Get items from selected catalogue
  const catalogueItems = selectedCatalogue 
    ? selectedCatalogue.sections.flatMap(section =>
        section.items.map(item => ({
          ...item,
          sectionName: section.name
        }))
      )
    : [];

  // Filter items by search and section
  const filteredItems = catalogueItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || item.section_type === selectedSection;
    return matchesSearch && matchesSection;
  });

  // Filter catalogues by search
  const filteredCatalogues = catalogues.filter(catalogue => 
    catalogue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    catalogue.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCatalogueClick = (catalogue: Catalogue) => {
    setSelectedCatalogue(catalogue);
    setSearchTerm('');
    setSelectedSection('all');
    setSelectedSizes({});
    setQuantities({});
  };

  const handleBackToCatalogues = () => {
    setSelectedCatalogue(null);
    setSearchTerm('');
    setSelectedSection('all');
    setSelectedSizes({});
    setQuantities({});
  };

  const handleSizeSelect = (itemId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }));
    if (!quantities[itemId]) {
      setQuantities(prev => ({
        ...prev,
        [itemId]: 1
      }));
    }
  };

  const handleQuantityChange = (itemId: string, change: number) => {
    const currentQty = quantities[itemId] || 1;
    const newQty = Math.max(1, currentQty + change);
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQty
    }));
  };

  const handleAddToCart = (item: any) => {
    const itemId = item.id;
    const selectedSize = selectedSizes[itemId];
    const quantity = quantities[itemId] || 1;
    if (item.sizes && item.sizes.length > 0) {
      if (!selectedSize) return;
      const sizeObj = item.sizes.find((s: any) => s.size === selectedSize);
      if (sizeObj) {
        addItem(item, selectedSize, sizeObj.price, quantity);
      }
    } else {
      addItem(item, 'Standard', item.price, quantity);
    }
  };

  const getItemPrice = (item: any, selectedSize?: string) => {
    if (item.sizes && item.sizes.length > 0 && selectedSize) {
      const sizeObj = item.sizes.find((s: any) => s.size === selectedSize);
      return sizeObj ? sizeObj.price : item.price;
    }
    return item.price;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading catalogues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background pb-12">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-50 py-12 mb-8 shadow-sm rounded-b-3xl">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 px-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-blue-500 animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-extrabold gradient-text-primary text-center">
              School Uniform Catalogues
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl">
            Discover quality school uniforms for every institution. Browse, filter, and shop with ease!
          </p>
          <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center mt-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={selectedCatalogue ? "Search items..." : "Search catalogues..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full shadow-md"
              />
            </div>
            {selectedCatalogue && (
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-40 shadow-md">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                  <SelectItem value="winter">Winter</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10 px-4">
        {/* Back Button */}
        {selectedCatalogue && (
          <div className="flex justify-start mb-4">
            <Button
              variant="outline"
              onClick={handleBackToCatalogues}
              className="flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalogues
            </Button>
          </div>
        )}

        {/* Show Catalogues or Items */}
        {!selectedCatalogue ? (
          <div>
            {filteredCatalogues.length === 0 ? (
              <Card className="mt-12">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">No catalogues found</h3>
                  <p className="text-muted-foreground text-lg">
                    Try adjusting your search criteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                {filteredCatalogues.map((catalogue) => {
                  const totalItems = catalogue.sections.reduce((sum, section) => sum + section.items.length, 0);
                  const totalStock = catalogue.sections.reduce((sum, section) => 
                    sum + section.items.reduce((itemSum, item) => itemSum + item.stock, 0), 0
                  );
                  return (
                    <Card 
                      key={catalogue.id} 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-400 bg-white/90 rounded-2xl"
                      onClick={() => handleCatalogueClick(catalogue)}
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {catalogue.image ? (
                          <img
                            src={catalogue.image}
                            alt={catalogue.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`flex items-center justify-center h-full ${catalogue.image ? 'hidden' : ''}`}>
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="absolute top-2 left-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                          {totalItems} items
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors font-bold">
                          {catalogue.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base">
                          {catalogue.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {totalStock} in stock
                          </div>
                          <Button className="rounded-full px-4 py-1 text-sm font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 shadow-sm mt-2">
                            View Items
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredItems.length === 0 ? (
              <Card className="mt-12">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-2xl font-semibold mb-2">No items found</h3>
                  <p className="text-muted-foreground text-lg">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                  : "space-y-4"
              }>
                {filteredItems.map((item) => {
                  const itemId = item.id;
                  const selectedSize = selectedSizes[itemId];
                  const quantity = quantities[itemId] || 1;
                  const currentPrice = getItemPrice(item, selectedSize);
                  const hasSizes = item.sizes && item.sizes.length > 0;
                  return (
                    <Card key={item.id} className={`overflow-hidden hover:shadow-xl transition-all duration-300 ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    } border-2 border-transparent hover:border-blue-400 bg-white/90 rounded-2xl`}>
                      <div className={`bg-muted relative ${
                        viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'
                      }`}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`flex items-center justify-center h-full ${item.image ? 'hidden' : ''}`}>
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                        {item.stock < 6 && (
                          <Badge variant="destructive" className="absolute top-2 right-2">
                            Low Stock
                          </Badge>
                        )}
                        <div className="absolute bottom-2 left-2 bg-white/80 text-blue-700 px-2 py-1 rounded text-xs font-semibold shadow">
                          {item.sectionName}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <CardHeader className={viewMode === 'list' ? 'pb-2' : ''}>
                          <CardTitle className="text-lg font-bold text-blue-900">{item.name}</CardTitle>
                          <CardDescription className="text-base text-muted-foreground">
                            {item.material && <span>Material: {item.material}</span>}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(currentPrice)}
                            </span>
                            <Badge variant={item.stock > 10 ? 'default' : 'secondary'}>
                              {item.stock} in stock
                            </Badge>
                          </div>
                          {hasSizes && (
                            <div className="space-y-2">
                              <p className="text-sm font-medium">Select Size:</p>
                              <div className="flex flex-wrap gap-1">
                                {item.sizes.map((size: any, index: number) => (
                                  <Button
                                    key={index}
                                    variant={selectedSize === size.size ? 'default' : 'outline'}
                                    size="sm"
                                    className="text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSizeSelect(itemId, size.size);
                                    }}
                                  >
                                    {size.size}: {formatPrice(size.price)}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Quantity:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(itemId, -1);
                                }}
                                disabled={quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(itemId, 1);
                                }}
                                disabled={quantity >= item.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <Button 
                            className="w-full mt-2 font-semibold rounded-full shadow-md"
                            disabled={item.stock === 0 || (hasSizes && !selectedSize)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {item.stock === 0 
                              ? 'Out of Stock' 
                              : hasSizes && !selectedSize 
                                ? 'Select Size' 
                                : 'Add to Cart'
                            }
                          </Button>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogues;