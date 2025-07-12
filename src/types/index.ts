// Core type definitions for SS Uniforms Management System

export type UserRole = 'admin' | 'staff';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role?: UserRole;
        };
        Update: {
          name?: string;
          role?: UserRole;
        };
      };
    };
  };
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface Catalogue {
  id: string;
  name: string;
  description: string;
  image: string;
  order: number;
  created_at: string;
  sections: CatalogueSection[];
}

export interface CatalogueSection {
  id: string;
  name: SectionType;
  items: UniformItem[];
}

export type SectionType = 'summer' | 'winter' | 'house' | 'other';

export interface UniformItem {
  id: string;
  name: string;
  material: string;
  location: string;
  stock: number;
  price: number;
  image: string;
  catalogue_id: string;
  section_type: SectionType;
  created_at: string;
  sizes: SizePrice[];
}

export interface SizePrice {
  id: string;
  item_id: string;
  size: string;
  price: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  item: UniformItem;
  size: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: string;
  employee_id: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  items: SaleItem[];
  created_at: string;
}

export interface SaleItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface ShopInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  images: string[];
  created_at: string;
}

// Database table interfaces for Supabase
export interface DbCatalogue {
  id: string;
  name: string;
  description: string;
  image: string;
  order: number;
  created_at: string;
}

export interface DbItem {
  id: string;
  catalogue_id: string;
  name: string;
  material: string;
  location: string;
  stock: number;
  price: number;
  image: string;
  section_type: SectionType;
  created_at: string;
}

export interface DbItemSize {
  id: string;
  item_id: string;
  size: string;
  price: number;
  created_at: string;
}

export interface DbSale {
  id: string;
  employee_id: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  items: any; // JSONB field
  created_at: string;
}

export interface DbProfile {
  id: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface DbShopInfo {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  images: any; // JSONB field
  created_at: string;
}

// Form input types
export interface CatalogueInput {
  name: string;
  description: string;
  image: string;
  order?: number;
}

export interface ItemInput {
  catalogue_id: string;
  name: string;
  material: string;
  location: string;
  stock: number | '';
  price: number | '';
  image: string;
  section_type: SectionType;
  sizes: SizePriceInput[];
}

export interface SizePriceInput {
  size: string;
  price: number | '';
}

export interface SaleInput {
  customer_name?: string;
  customer_phone?: string;
  items: CartItem[];
}

export interface EmployeeInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// Dashboard analytics types
export interface DashboardStats {
  totalStockValue: number;
  totalItems: number;
  totalStock: number;
  lowStockCount: number;
  salesCount: number;
  revenue: number;
}

export interface SalesAnalytics {
  dailySales: number;
  weeklySales: number;
  monthlySales: number;
  yearlySales: number;
  topSellingItems: UniformItem[];
  recentSales: Sale[];
}