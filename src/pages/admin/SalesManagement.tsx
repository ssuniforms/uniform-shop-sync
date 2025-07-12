import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, DollarSign, ShoppingCart, User, Phone, Clock } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { Sale } from '@/types';

const SalesManagement = () => {
  const { sales, loading } = useData()!;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterEmployee, setFilterEmployee] = useState('all');

  const getFilteredSales = () => {
    let filtered = [...sales];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sale => 
        sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer_phone?.includes(searchTerm) ||
        sale.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Period filter
    if (filterPeriod !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (filterPeriod) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(sale => 
        new Date(sale.created_at) >= startDate
      );
    }

    // Employee filter
    if (filterEmployee !== 'all') {
      filtered = filtered.filter(sale => sale.employee_id === filterEmployee);
    }

    return filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  const getUniqueEmployees = () => {
    const employeeIds = [...new Set(sales.map(sale => sale.employee_id))];
    return employeeIds;
  };

  const getTotalRevenue = (salesList: Sale[]) => {
    return salesList.reduce((total, sale) => total + sale.total_amount, 0);
  };

  const filteredSales = getFilteredSales();
  const totalRevenue = getTotalRevenue(filteredSales);
  const averageOrderValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales Management</h1>
          <p className="text-muted-foreground">View and analyze sales transactions</p>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSales.length}</div>
            <p className="text-xs text-muted-foreground">
              Transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From filtered sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{filterPeriod}</div>
            <p className="text-xs text-muted-foreground">
              Time range
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, phone, or sale ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
        </div>
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterEmployee} onValueChange={setFilterEmployee}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {getUniqueEmployees().map(employeeId => (
              <SelectItem key={employeeId} value={employeeId}>
                Employee {employeeId.slice(0, 8)}...
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sales List */}
      <div className="space-y-4">
        {filteredSales.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No sales found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filterPeriod !== 'all' || filterEmployee !== 'all' 
                    ? "Try adjusting your filters to see more results." 
                    : "No sales have been recorded yet."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredSales.map((sale) => (
            <Card key={sale.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sale ID:</span>
                      <span className="font-mono text-sm">{sale.id.slice(0, 8)}...</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(sale.created_at).toLocaleString()}
                      </div>
                      {sale.customer_name && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {sale.customer_name}
                        </div>
                      )}
                      {sale.customer_phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {sale.customer_phone}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(sale.total_amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Items Purchased:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {sale.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Size: {item.size} • Qty: {item.quantity}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {formatPrice(item.price * item.quantity)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Employee: {sale.employee_id.slice(0, 8)}...
                  </div>
                  <div className="text-lg font-semibold">
                    Total: {formatPrice(sale.total_amount)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SalesManagement;