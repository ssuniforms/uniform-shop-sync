import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  CreditCard, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const { addSale } = useData();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleQuantityChange = (itemId: string, size: string, change: number) => {
    const cartItem = items.find(item => item.item.id === itemId && item.size === size);
    if (cartItem) {
      const newQuantity = Math.max(1, cartItem.quantity + change);
      updateQuantity(itemId, size, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      // Show error for missing customer name
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const saleData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items
      };

      const saleId = await addSale(saleData);
      
      if (saleId) {
        clearCart();
        // Show success message and redirect
        navigate('/admin/sales');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button onClick={() => navigate('/catalogues')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold gradient-text-primary mb-2">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground">
              {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/catalogues')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((cartItem) => (
              <Card key={cartItem.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-24 h-24 bg-muted relative flex-shrink-0">
                    {cartItem.item.image ? (
                      <img
                        src={cartItem.item.image}
                        alt={cartItem.item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{cartItem.item.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          Size: {cartItem.size}
                        </p>
                        {cartItem.item.material && (
                          <p className="text-muted-foreground text-sm">
                            Material: {cartItem.item.material}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(cartItem.price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          per item
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(cartItem.item.id, cartItem.size, -1)}
                          disabled={cartItem.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(cartItem.item.id, cartItem.size, 1)}
                          disabled={cartItem.quantity >= cartItem.item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {formatPrice(cartItem.price * cartItem.quantity)}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeItem(cartItem.item.id, cartItem.size)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Details */}
                <div className="space-y-3">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                  
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <Separator />

                {/* Items Summary */}
                <div className="space-y-2">
                  {items.map((cartItem) => (
                    <div key={cartItem.id} className="flex justify-between text-sm">
                      <span className="truncate">
                        {cartItem.item.name} ({cartItem.size}) × {cartItem.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(cartItem.price * cartItem.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalPrice)}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !customerName.trim()}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isCheckingOut ? 'Processing...' : 'Complete Sale'}
                </Button>

                {!customerName.trim() && (
                  <p className="text-sm text-destructive text-center">
                    Please enter customer name to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 