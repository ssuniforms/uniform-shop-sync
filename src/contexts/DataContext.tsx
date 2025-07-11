import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Catalogue, 
  UniformItem, 
  Sale, 
  CatalogueInput, 
  ItemInput, 
  SaleInput,
  DbCatalogue,
  DbItem,
  DbItemSize,
  DbSale,
  CatalogueSection,
  SectionType,
  DashboardStats,
  SalesAnalytics
} from '@/types';
import { toast } from '@/hooks/use-toast';

interface DataContextType {
  // Data
  catalogues: Catalogue[];
  sales: Sale[];
  dashboardStats: DashboardStats;
  salesAnalytics: SalesAnalytics;
  bestSellers: UniformItem[];
  lowStockItems: UniformItem[];
  loading: boolean;

  // Methods
  fetchCatalogues: () => Promise<void>;
  fetchSales: () => Promise<void>;
  addCatalogue: (catalogue: CatalogueInput) => Promise<string | null>;
  updateCatalogue: (id: string, catalogue: Partial<CatalogueInput>) => Promise<boolean>;
  deleteCatalogue: (id: string) => Promise<boolean>;
  addItem: (item: ItemInput) => Promise<string | null>;
  updateItem: (id: string, item: Partial<ItemInput>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  updateStock: (itemId: string, quantity: number) => Promise<boolean>;
  addSale: (sale: SaleInput) => Promise<string | null>;
  calculateDashboardStats: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalStockValue: 0,
    totalItems: 0,
    totalStock: 0,
    lowStockCount: 0,
    salesCount: 0,
    revenue: 0,
  });
  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics>({
    dailySales: 0,
    weeklySales: 0,
    monthlySales: 0,
    yearlySales: 0,
    topSellingItems: [],
    recentSales: [],
  });
  const [bestSellers, setBestSellers] = useState<UniformItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<UniformItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalogues();
    fetchSales();
  }, []);

  useEffect(() => {
    calculateDashboardStats();
  }, [catalogues, sales]);

  const fetchCatalogues = async () => {
    try {
      setLoading(true);
      
      // Fetch catalogues
      const { data: cataloguesData, error: cataloguesError } = await supabase
        .from('catalogues')
        .select('*')
        .order('order');

      if (cataloguesError) throw cataloguesError;

      // Fetch all items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*');

      if (itemsError) throw itemsError;

      // Fetch all item sizes
      const { data: sizesData, error: sizesError } = await supabase
        .from('item_sizes')
        .select('*');

      if (sizesError) throw sizesError;

      // Transform and combine data
      const transformedCatalogues: Catalogue[] = cataloguesData?.map((cat: DbCatalogue) => {
        const sections: CatalogueSection[] = [
          { id: `${cat.id}-summer`, name: 'summer', items: [] },
          { id: `${cat.id}-winter`, name: 'winter', items: [] },
          { id: `${cat.id}-house`, name: 'house', items: [] },
          { id: `${cat.id}-other`, name: 'other', items: [] },
        ];

        // Populate sections with items
        const catalogueItems = itemsData?.filter((item: DbItem) => item.catalogue_id === cat.id) || [];
        
        catalogueItems.forEach((item: DbItem) => {
          const itemSizes = sizesData?.filter((size: DbItemSize) => size.item_id === item.id) || [];
          
          const transformedItem: UniformItem = {
            ...item,
            sizes: itemSizes,
          };

          const section = sections.find(s => s.name === item.section_type);
          if (section) {
            section.items.push(transformedItem);
          }
        });

        return {
          ...cat,
          sections,
        };
      }) || [];

      setCatalogues(transformedCatalogues);
    } catch (error) {
      console.error('Error fetching catalogues:', error);
      toast({
        title: "Error",
        description: "Failed to fetch catalogues",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSales = async () => {
    try {
      const { data: salesData, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedSales: Sale[] = salesData?.map((sale: DbSale) => ({
        ...sale,
        items: typeof sale.items === 'string' ? JSON.parse(sale.items) : sale.items,
      })) || [];

      setSales(transformedSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const addCatalogue = async (catalogue: CatalogueInput): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('catalogues')
        .insert(catalogue)
        .select()
        .single();

      if (error) throw error;

      await fetchCatalogues();
      toast({
        title: "Success",
        description: "Catalogue added successfully",
      });
      
      return data.id;
    } catch (error) {
      console.error('Error adding catalogue:', error);
      toast({
        title: "Error",
        description: "Failed to add catalogue",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCatalogue = async (id: string, catalogue: Partial<CatalogueInput>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('catalogues')
        .update(catalogue)
        .eq('id', id);

      if (error) throw error;

      await fetchCatalogues();
      toast({
        title: "Success",
        description: "Catalogue updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating catalogue:', error);
      toast({
        title: "Error",
        description: "Failed to update catalogue",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCatalogue = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('catalogues')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCatalogues();
      toast({
        title: "Success",
        description: "Catalogue deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting catalogue:', error);
      toast({
        title: "Error",
        description: "Failed to delete catalogue",
        variant: "destructive",
      });
      return false;
    }
  };

  const addItem = async (item: ItemInput): Promise<string | null> => {
    try {
      // Add item
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert({
          catalogue_id: item.catalogue_id,
          name: item.name,
          material: item.material,
          location: item.location,
          stock: item.stock,
          price: item.price,
          image: item.image,
          section_type: item.section_type,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Add sizes
      if (item.sizes.length > 0) {
        const sizesData = item.sizes.map(size => ({
          item_id: itemData.id,
          size: size.size,
          price: size.price,
        }));

        const { error: sizesError } = await supabase
          .from('item_sizes')
          .insert(sizesData);

        if (sizesError) throw sizesError;
      }

      await fetchCatalogues();
      toast({
        title: "Success",
        description: "Item added successfully",
      });
      
      return itemData.id;
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateItem = async (id: string, item: Partial<ItemInput>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('items')
        .update({
          name: item.name,
          material: item.material,
          location: item.location,
          stock: item.stock,
          price: item.price,
          image: item.image,
          section_type: item.section_type,
        })
        .eq('id', id);

      if (error) throw error;

      // Update sizes if provided
      if (item.sizes) {
        // Delete existing sizes
        await supabase
          .from('item_sizes')
          .delete()
          .eq('item_id', id);

        // Insert new sizes
        if (item.sizes.length > 0) {
          const sizesData = item.sizes.map(size => ({
            item_id: id,
            size: size.size,
            price: size.price,
          }));

          await supabase
            .from('item_sizes')
            .insert(sizesData);
        }
      }

      await fetchCatalogues();
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCatalogues();
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateStock = async (itemId: string, quantity: number): Promise<boolean> => {
    try {
      // For now, we'll manually update the item stock
      // In a real implementation, you'd create an RPC function
      const { data: item } = await supabase
        .from('items')
        .select('stock')
        .eq('id', itemId)
        .single();

      if (item) {
        const newStock = Math.max(0, item.stock - quantity);
        const { error } = await supabase
          .from('items')
          .update({ stock: newStock })
          .eq('id', itemId);
        
        if (error) throw error;
      }

      await fetchCatalogues();
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      return false;
    }
  };

  const addSale = async (sale: SaleInput): Promise<string | null> => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return null;
    }

    try {
      const totalAmount = sale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const saleData = {
        employee_id: user.id,
        customer_name: sale.customer_name || null,
        customer_phone: sale.customer_phone || null,
        total_amount: totalAmount,
        items: sale.items.map(item => ({
          id: item.id,
          name: item.item.name,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const { data, error } = await supabase
        .from('sales')
        .insert(saleData)
        .select()
        .single();

      if (error) throw error;

      // Update stock for each item
      for (const item of sale.items) {
        await updateStock(item.item.id, item.quantity);
      }

      await fetchSales();
      toast({
        title: "Sale Complete",
        description: `Sale recorded successfully. Total: ₹${totalAmount}`,
      });
      
      return data.id;
    } catch (error) {
      console.error('Error adding sale:', error);
      toast({
        title: "Error",
        description: "Failed to record sale",
        variant: "destructive",
      });
      return null;
    }
  };

  const calculateDashboardStats = () => {
    // Get all items from all catalogues
    const allItems: UniformItem[] = [];
    catalogues.forEach(catalogue => {
      catalogue.sections.forEach(section => {
        allItems.push(...section.items);
      });
    });

    // Calculate basic stats
    const totalItems = allItems.length;
    const totalStock = allItems.reduce((sum, item) => sum + item.stock, 0);
    const totalStockValue = allItems.reduce((sum, item) => sum + (item.stock * item.price), 0);
    const lowStockCount = allItems.filter(item => item.stock < 6).length;
    
    // Sales stats
    const today = new Date().toDateString();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const dailySales = sales.filter(sale => 
      new Date(sale.created_at).toDateString() === today
    ).reduce((sum, sale) => sum + sale.total_amount, 0);
    
    const monthlySales = sales.filter(sale => 
      new Date(sale.created_at).getMonth() === thisMonth &&
      new Date(sale.created_at).getFullYear() === thisYear
    ).reduce((sum, sale) => sum + sale.total_amount, 0);
    
    const yearlySales = sales.filter(sale => 
      new Date(sale.created_at).getFullYear() === thisYear
    ).reduce((sum, sale) => sum + sale.total_amount, 0);

    // Best sellers (items with highest stock)
    const sortedByStock = [...allItems].sort((a, b) => b.stock - a.stock);
    const bestSellersItems = sortedByStock.slice(0, 5);
    
    // Low stock items
    const lowStockItemsList = allItems.filter(item => item.stock < 6);

    setDashboardStats({
      totalStockValue,
      totalItems,
      totalStock,
      lowStockCount,
      salesCount: sales.length,
      revenue: yearlySales,
    });

    setSalesAnalytics({
      dailySales,
      weeklySales: 0, // Calculate weekly if needed
      monthlySales,
      yearlySales,
      topSellingItems: bestSellersItems,
      recentSales: sales.slice(0, 10),
    });

    setBestSellers(bestSellersItems);
    setLowStockItems(lowStockItemsList);
  };

  const value = {
    catalogues,
    sales,
    dashboardStats,
    salesAnalytics,
    bestSellers,
    lowStockItems,
    loading,
    fetchCatalogues,
    fetchSales,
    addCatalogue,
    updateCatalogue,
    deleteCatalogue,
    addItem,
    updateItem,
    deleteItem,
    updateStock,
    addSale,
    calculateDashboardStats,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};