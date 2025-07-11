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
import Dashboard from "@/pages/Dashboard";
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
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Placeholder routes for future implementation */}
                  <Route path="/catalogues" element={<div className="p-8 text-center">Catalogues page coming soon!</div>} />
                  <Route path="/login" element={<div className="p-8 text-center">Login page coming soon!</div>} />
                  <Route path="/signup" element={<div className="p-8 text-center">Signup page coming soon!</div>} />
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
