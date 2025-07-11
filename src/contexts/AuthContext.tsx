import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile, UserRole, EmployeeInput } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createEmployee: (data: EmployeeInput) => Promise<boolean>;
  getAllEmployees: () => Promise<Profile[]>;
  deleteEmployee: (id: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        return true;
      }

      return false;
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Logout Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged out",
          description: "Successfully logged out.",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const createEmployee = async (data: EmployeeInput): Promise<boolean> => {
    try {
      const { data: result, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role || 'staff',
        },
      });

      if (error) {
        toast({
          title: "Error Creating Employee",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Employee Created",
        description: `Successfully created account for ${data.name}`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create employee account",
        variant: "destructive",
      });
      return false;
    }
  };

  const getAllEmployees = async (): Promise<Profile[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employees:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId: id },
      });

      if (error) {
        toast({
          title: "Error Deleting Employee",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Employee Deleted",
        description: "Employee account successfully deleted",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
      return false;
    }
  };

  const userRole = profile?.role || null;

  const value = {
    session,
    user,
    profile,
    userRole,
    loading,
    login,
    logout,
    createEmployee,
    getAllEmployees,
    deleteEmployee,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper functions for role checking
export const hasAdminPermissions = (profile: Profile | null): boolean => {
  return profile?.role === 'admin';
};

export const hasStaffPermissions = (profile: Profile | null): boolean => {
  return profile?.role === 'admin' || profile?.role === 'staff';
};