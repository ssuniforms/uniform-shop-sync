import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { CartProvider } from "@/contexts/CartContext";

// Components
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AdminSetup from "@/pages/AdminSetup";
import Dashboard from "@/pages/Dashboard";
import CatalogueManagement from "@/pages/admin/CatalogueManagement";
import ItemManagement from "@/pages/admin/ItemManagement";
import EmployeeManagement from "@/pages/admin/EmployeeManagement";
import SalesManagement from "@/pages/admin/SalesManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <CartProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/admin-setup" element={<AdminSetup />} />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/catalogues" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <CatalogueManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/items" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <ItemManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/employees" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <EmployeeManagement />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/sales" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <SalesManagement />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Public routes for future implementation */}
                  <Route path="/catalogues" element={<div className="p-8 text-center">Public catalogues page coming soon!</div>} />
                  <Route path="/cart" element={<div className="p-8 text-center">Cart page coming soon!</div>} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </CartProvider>
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
