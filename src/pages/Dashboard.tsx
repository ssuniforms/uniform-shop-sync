import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/contexts/DataContext';
import { formatPrice } from '@/utils/formatters';
import {
  Package,
  Plus,
  Users,
  ShoppingCart,
  TrendingUp,
  Activity,
  Award,
  AlertTriangle,
  Calendar,
  BarChart3,
  DollarSign,
  Box,
  Layers,
  ArrowRight,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    dashboardStats, 
    salesAnalytics, 
    bestSellers, 
    lowStockItems, 
    catalogues, 
    loading 
  } = useData();
  const navigate = useNavigate();

  const handleSalesCardClick = (period: string) => {
    navigate(`/admin/sales?filter=${period}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text-primary mb-2">
              Admin Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your uniform shop inventory and operations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <Activity className="w-4 h-4 mr-1" />
              System Online
            </Badge>
            <Button variant="outline" size="sm" className="bg-white/50">
              <Calendar className="w-4 h-4 mr-2" />
              Today: {new Date().toLocaleDateString()}
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/catalogues">
            <Card className="shadow-business hover:shadow-business-hover transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Manage Catalogues</p>
                    <p className="text-3xl font-bold text-blue-800 mt-2">
                      {catalogues.length}
                    </p>
                  </div>
                  <Box className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/items">
            <Card className="shadow-business hover:shadow-business-hover transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Manage Items</p>
                    <p className="text-3xl font-bold text-green-800 mt-2">
                      {dashboardStats.totalItems}
                    </p>
                  </div>
                  <Package className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/employees">
            <Card className="shadow-business hover:shadow-business-hover transition-all duration-300 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-700">Manage Staff</p>
                    <p className="text-3xl font-bold text-indigo-800 mt-2">
                      <Users className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/sales">
            <Card className="shadow-business hover:shadow-business-hover transition-all duration-300 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-rose-700">View Sales</p>
                    <p className="text-3xl font-bold text-rose-800 mt-2">
                      {dashboardStats.salesCount}
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-rose-600 group-hover:scale-110 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-business hover:shadow-business-hover transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Total Revenue</p>
                  <p className="text-3xl font-bold text-yellow-800 mt-2">
                    {formatPrice(dashboardStats.revenue)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-business hover:shadow-business-hover transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Low Stock Items</p>
                  <p className="text-3xl font-bold text-red-800 mt-2">
                    {dashboardStats.lowStockCount}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-business hover:shadow-business-hover transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Stock</p>
                  <p className="text-3xl font-bold text-purple-800 mt-2">
                    {dashboardStats.totalStock.toLocaleString()}
                  </p>
                </div>
                <Layers className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-business hover:shadow-business-hover transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-orange-800 mt-2">
                    {formatPrice(salesAnalytics.monthlySales)}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="shadow-business bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => handleSalesCardClick('today')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Today's Sales
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-800">
                {formatPrice(salesAnalytics.dailySales)}
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                Daily transactions
              </p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-business bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => handleSalesCardClick('month')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-cyan-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  This Month
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-cyan-800">
                {formatPrice(salesAnalytics.monthlySales)}
              </p>
              <p className="text-sm text-cyan-600 mt-1">
                Monthly revenue
              </p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-business bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 cursor-pointer hover:shadow-lg transition-all duration-300 group"
            onClick={() => handleSalesCardClick('year')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-violet-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  This Year
                </div>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-violet-800">
                {formatPrice(salesAnalytics.yearlySales)}
              </p>
              <p className="text-sm text-violet-600 mt-1">
                Annual revenue
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Sellers */}
          <Card className="shadow-business">
            <CardHeader>
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Best Sellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bestSellers.length > 0 ? (
                <div className="space-y-3">
                  {bestSellers.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge 
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.material}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Stock: {item.stock}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No sales data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="shadow-business">
            <CardHeader>
              <CardTitle className="text-xl text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="space-y-3">
                  {lowStockItems.slice(0, 5).map((item) => {
                    const stockNumber = Number(item.stock);
                    const progressValue = Math.min((stockNumber / 20) * 100, 100);
                    return (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.location}</p>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {stockNumber} left
                          </Badge>
                        </div>
                        <Progress value={progressValue} className="h-2 bg-red-100" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-green-600 font-medium">All items well stocked!</p>
                  <p className="text-sm text-muted-foreground mt-1">No items below threshold</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Catalogue Overview */}
        {catalogues.length > 0 && (
          <Card className="shadow-business">
            <CardHeader>
              <CardTitle className="text-xl text-foreground flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Catalogue Overview
                </span>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {catalogues.length} Catalogues
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catalogues.map((catalogue) => {
                  const totalItems = catalogue.sections.reduce((sum, section) => sum + section.items.length, 0);
                  const totalStock = catalogue.sections.reduce((sum, section) => 
                    sum + section.items.reduce((itemSum, item) => itemSum + item.stock, 0), 0
                  );
                  
                  return (
                    <Card key={catalogue.id} className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {catalogue.image && (
                            <img 
                              src={catalogue.image} 
                              alt={catalogue.name}
                              className="w-12 h-12 rounded-lg object-cover border"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{catalogue.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {catalogue.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-slate-600">
                                {totalItems} items
                              </span>
                              <span className="text-xs text-slate-600">
                                {totalStock} in stock
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;