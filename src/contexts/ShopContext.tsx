import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ShopInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  images: string[];
  justDialUrl?: string;
  businessHours?: {
    weekdays: string;
    weekends: string;
  };
  socialMedia?: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  created_at: string;
}

interface ShopContextType {
  shopInfo: ShopInfo | null;
  loading: boolean;
  updateShopInfo: (data: Partial<ShopInfo>) => Promise<boolean>;
  fetchShopInfo: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchShopInfo = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('shop_info')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching shop info:', error);
        // Set default shop info if none exists
        setShopInfo({
          id: 'default',
          name: 'SS Uniforms',
          description: 'Delhi NCR\'s premier school uniform provider. Quality uniforms, competitive prices, and exceptional service for educational institutions. Trusted by 50+ schools across the region.',
          address: 'Shop No. 123, Uniform Market, Chhawla, Delhi NCR - 110071',
          email: 'info@ssuniforms.com',
          phone: '+91-9876543210',
          images: ['https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg'],
          justDialUrl: 'https://www.justdial.com/Delhi/SS-Uniforms',
          businessHours: {
            weekdays: '9:00 AM - 7:00 PM',
            weekends: '10:00 AM - 4:00 PM'
          },
          socialMedia: {
            facebook: 'https://facebook.com/ssuniforms',
            instagram: 'https://instagram.com/ssuniforms',
            twitter: 'https://twitter.com/ssuniforms'
          },
          location: {
            lat: 28.560651,
            lng: 77.002637
          },
          created_at: new Date().toISOString()
        });
        return;
      }

      // Transform database data to include default values
      const transformedData: ShopInfo = {
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        justDialUrl: 'https://www.justdial.com/Delhi/SS-Uniforms',
        businessHours: {
          weekdays: '9:00 AM - 7:00 PM',
          weekends: '10:00 AM - 4:00 PM'
        },
        socialMedia: {
          facebook: 'https://facebook.com/ssuniforms',
          instagram: 'https://instagram.com/ssuniforms',
          twitter: 'https://twitter.com/ssuniforms'
        },
        location: {
          lat: 28.560651,
          lng: 77.002637
        }
      };

      setShopInfo(transformedData);
    } catch (error) {
      console.error('Error fetching shop info:', error);
      toast({
        title: "Error",
        description: "Failed to load shop information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateShopInfo = async (data: Partial<ShopInfo>): Promise<boolean> => {
    try {
      if (!shopInfo) return false;

      const { error } = await supabase
        .from('shop_info')
        .update({
          name: data.name,
          description: data.description,
          address: data.address,
          email: data.email,
          phone: data.phone,
          images: data.images
        })
        .eq('id', shopInfo.id);

      if (error) {
        console.error('Error updating shop info:', error);
        toast({
          title: "Error",
          description: "Failed to update shop information",
          variant: "destructive",
        });
        return false;
      }

      // Update local state
      setShopInfo(prev => prev ? { ...prev, ...data } : null);
      
      toast({
        title: "Success",
        description: "Shop information updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating shop info:', error);
      toast({
        title: "Error",
        description: "Failed to update shop information",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  const value = {
    shopInfo,
    loading,
    updateShopInfo,
    fetchShopInfo,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};