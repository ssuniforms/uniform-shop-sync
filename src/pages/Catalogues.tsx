import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Package, Filter, Grid, List, ShoppingCart, ArrowLeft, Image } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { SectionType, Catalogue } from '@/types';

const Catalogues = () => {
  const { catalogues, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatalogue, setSelectedCatalogue] = useState<Catalogue | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
  };

  const handleBackToCatalogues = () => {
    setSelectedCatalogue(null);
    setSearchTerm('');
    setSelectedSection('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading catalogues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text-primary mb-4">
            {selectedCatalogue ? selectedCatalogue.name : 'School Uniform Catalogues'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {selectedCatalogue 
              ? `Browse ${selectedCatalogue.name} uniforms and accessories`
              : 'Browse our extensive collection of quality school uniforms for various institutions'
            }
          </p>
        </div>

        {/* Back Button */}
        {selectedCatalogue && (
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={handleBackToCatalogues}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalogues
            </Button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={selectedCatalogue ? "Search items..." : "Search catalogues..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            {selectedCatalogue && (
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="w-40">
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

          {selectedCatalogue && (
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {selectedCatalogue && (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredItems.length} of {catalogueItems.length} items
            </p>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {catalogueItems.length} total items
              </span>
            </div>
          </div>
        )}

        {/* Show Catalogues or Items */}
        {!selectedCatalogue ? (
          // Show Catalogues
          <div>
            {filteredCatalogues.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No catalogues found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCatalogues.map((catalogue) => {
                  const totalItems = catalogue.sections.reduce((sum, section) => sum + section.items.length, 0);
                  const totalStock = catalogue.sections.reduce((sum, section) => 
                    sum + section.items.reduce((itemSum, item) => itemSum + item.stock, 0), 0
                  );
                  
                  return (
                    <Card 
                      key={catalogue.id} 
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => handleCatalogueClick(catalogue)}
                    >
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {catalogue.image ? (
                          <img
                            src={catalogue.image}
                            alt={catalogue.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback to placeholder if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`flex items-center justify-center h-full ${catalogue.image ? 'hidden' : ''}`}>
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {catalogue.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {catalogue.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Package className="h-4 w-4" />
                            {totalItems} items
                          </div>
                          <div>
                            {totalStock} in stock
                          </div>
                        </div>
                        
                        <Button className="w-full mt-4" variant="outline">
                          View Items
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          // Show Items from Selected Catalogue
          <div>
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No items found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {filteredItems.map((item) => (
                  <Card key={item.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}>
                    <div className={`bg-muted relative ${
                      viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'
                    }`}>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
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
                    </div>
                    
                    <div className="flex-1">
                      <CardHeader className={viewMode === 'list' ? 'pb-2' : ''}>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>
                          {item.sectionName}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(item.price)}
                          </span>
                          <Badge variant={item.stock > 10 ? 'default' : 'secondary'}>
                            {item.stock} in stock
                          </Badge>
                        </div>
                        
                        {item.material && (
                          <p className="text-sm text-muted-foreground">
                            Material: {item.material}
                          </p>
                        )}
                        
                        {item.sizes && item.sizes.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Available Sizes:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.sizes.map((size, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {size.size}: {formatPrice(size.price)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <Button className="w-full" disabled={item.stock === 0}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogues;