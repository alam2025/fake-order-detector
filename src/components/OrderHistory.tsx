import React, { useState } from 'react';
import { History, Search, Filter, Trash2, Calendar, Phone, MapPin, CreditCard } from 'lucide-react';
import { Order } from '../types';
import { deleteOrder } from '../utils/storage';

interface OrderHistoryProps {
  orders: Order[];
  onOrdersChange: () => void;
}

export function OrderHistory({ orders, onOrdersChange }: OrderHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Genuine' | 'Fake'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'riskScore'>('newest');

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phoneNumber.includes(searchTerm) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'riskScore':
          return b.riskScore - a.riskScore;
        default:
          return 0;
      }
    });

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
      onOrdersChange();
    }
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600">Start analyzing orders to see them appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <History className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
          {orders.length} orders
        </span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Genuine' | 'Fake')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="All">All Status</option>
          <option value="Genuine">Genuine Only</option>
          <option value="Fake">Fake Only</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'riskScore')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="riskScore">Risk Score</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'Genuine' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.timestamp).toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${
                  order.riskScore < 30 ? 'text-green-600' :
                  order.riskScore < 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {order.riskScore}
                </span>
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete order"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Customer</div>
                <div className="font-medium">{order.customerName}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Phone</div>
                <div className="font-medium flex items-center gap-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {order.phoneNumber}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Payment</div>
                <div className="font-medium flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  {order.paymentMethod}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Risk Score</div>
                <div className={`font-bold ${
                  order.riskScore < 30 ? 'text-green-600' :
                  order.riskScore < 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {order.riskScore}/100
                </div>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Address</div>
              <div className="flex items-start gap-1">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{order.address}</span>
              </div>
            </div>

            {order.detectionReasons.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500 mb-2">Detection Reasons</div>
                <div className="flex flex-wrap gap-2">
                  {order.detectionReasons.slice(0, 3).map((reason, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {reason}
                    </span>
                  ))}
                  {order.detectionReasons.length > 3 && (
                    <span className="text-gray-500 text-xs">
                      +{order.detectionReasons.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8">
          <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching orders</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}