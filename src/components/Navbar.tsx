import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth, hasAdminPermissions, hasStaffPermissions } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut, 
  Settings, 
  Package,
  Home
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text-primary">
              SS Uniforms
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'business' : 'ghost'} 
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            
            <Link to="/catalogues">
              <Button 
                variant={isActive('/catalogues') ? 'blue' : 'ghost'} 
                size="sm"
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Catalogues
              </Button>
            </Link>

            {user && hasStaffPermissions(profile) && (
              <Link to="/cart">
                <Button 
                  variant={isActive('/cart') ? 'green' : 'ghost'} 
                  size="sm" 
                  className="flex items-center gap-2 relative"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                  {totalItems > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {user && hasAdminPermissions(profile) && (
              <Link to="/admin">
                <Button 
                  variant={isActive('/admin') ? 'purple' : 'ghost'} 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="text-sm">
                  <p className="font-medium text-foreground">{profile?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="business" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive('/') ? 'business' : 'ghost'} 
                  className="w-full justify-start"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              
              <Link to="/catalogues" onClick={() => setIsMenuOpen(false)}>
                <Button 
                  variant={isActive('/catalogues') ? 'blue' : 'ghost'} 
                  className="w-full justify-start"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Catalogues
                </Button>
              </Link>

              {user && hasStaffPermissions(profile) && (
                <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant={isActive('/cart') ? 'green' : 'ghost'} 
                    className="w-full justify-start relative"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {totalItems > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {user && hasAdminPermissions(profile) && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    variant={isActive('/admin') ? 'purple' : 'ghost'} 
                    className="w-full justify-start"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Dashboard
                  </Button>
                </Link>
              )}

              {user ? (
                <div className="pt-4 border-t border-border/50">
                  <div className="px-3 py-2">
                    <p className="font-medium text-foreground">{profile?.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground capitalize">{profile?.role}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="business" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;