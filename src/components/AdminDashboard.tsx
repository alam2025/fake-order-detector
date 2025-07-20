import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Phone, CreditCard } from 'lucide-react';
import { Order, Analytics } from '../types';

interface AdminDashboardProps {
  orders: Order[];
}

export function AdminDashboard({ orders }: AdminDashboardProps) {
  const analytics: Analytics = useMemo(() => {
    const totalOrders = orders.length;
    const fakeOrders = orders.filter(order => order.status === 'Fake').length;
    const genuineOrders = totalOrders - fakeOrders;
    const fakePercentage = totalOrders > 0 ? Math.round((fakeOrders / totalOrders) * 100) : 0;

    // Phone frequency analysis
    const phoneFrequency: Record<string, number> = {};
    orders.forEach(order => {
      phoneFrequency[order.phoneNumber] = (phoneFrequency[order.phoneNumber] || 0) + 1;
    });

    const topSuspiciousPhones = Object.entries(phoneFrequency)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5)
      .map(([phone, count]) => ({ phone, count }));

    // Payment method stats
    const codOrders = orders.filter(order => order.paymentMethod === 'COD');
    const prepaidOrders = orders.filter(order => order.paymentMethod === 'Prepaid');

    const paymentMethodStats = {
      cod: {
        total: codOrders.length,
        fake: codOrders.filter(order => order.status === 'Fake').length
      },
      prepaid: {
        total: prepaidOrders.length,
        fake: prepaidOrders.filter(order => order.status === 'Fake').length
      }
    };

    return {
      totalOrders,
      fakeOrders,
      genuineOrders,
      fakePercentage,
      topSuspiciousPhones,
      paymentMethodStats
    };
  }, [orders]);

  const getRecentTrend = () => {
    const recentOrders = orders
      .filter(order => new Date().getTime() - new Date(order.timestamp).getTime() < 24 * 60 * 60 * 1000)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const recentFake = recentOrders.filter(order => order.status === 'Fake').length;
    const recentTotal = recentOrders.length;
    
    return recentTotal > 0 ? Math.round((recentFake / recentTotal) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-blue-900">{analytics.totalOrders}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Genuine Orders</p>
              <p className="text-3xl font-bold text-green-900">{analytics.genuineOrders}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Fake Orders</p>
              <p className="text-3xl font-bold text-red-900">{analytics.fakeOrders}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Fake Rate</p>
              <p className="text-3xl font-bold text-orange-900">{analytics.fakePercentage}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Trends and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Payment Method Analysis */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Method Analysis
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Cash on Delivery</span>
                <span className="text-sm text-gray-600">
                  {analytics.paymentMethodStats.cod.total} orders
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${analytics.paymentMethodStats.cod.total > 0 
                      ? (analytics.paymentMethodStats.cod.fake / analytics.paymentMethodStats.cod.total) * 100 
                      : 0}%` 
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics.paymentMethodStats.cod.fake} fake orders 
                ({analytics.paymentMethodStats.cod.total > 0 
                  ? Math.round((analytics.paymentMethodStats.cod.fake / analytics.paymentMethodStats.cod.total) * 100) 
                  : 0}% fake rate)
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Prepaid</span>
                <span className="text-sm text-gray-600">
                  {analytics.paymentMethodStats.prepaid.total} orders
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${analytics.paymentMethodStats.prepaid.total > 0 
                      ? (analytics.paymentMethodStats.prepaid.fake / analytics.paymentMethodStats.prepaid.total) * 100 
                      : 0}%` 
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics.paymentMethodStats.prepaid.fake} fake orders 
                ({analytics.paymentMethodStats.prepaid.total > 0 
                  ? Math.round((analytics.paymentMethodStats.prepaid.fake / analytics.paymentMethodStats.prepaid.total) * 100) 
                  : 0}% fake rate)
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trend */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            24-Hour Trend
          </h3>
          
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${
              getRecentTrend() > analytics.fakePercentage ? 'text-red-600' : 'text-green-600'
            }`}>
              {getRecentTrend()}%
            </div>
            <p className="text-gray-600 text-sm">
              Fake order rate in the last 24 hours
            </p>
            
            {getRecentTrend() > analytics.fakePercentage ? (
              <div className="mt-4 p-3 bg-red-100 rounded-lg">
                <p className="text-red-800 text-sm">
                  ⚠️ Increased fake order activity detected
                </p>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-green-800 text-sm">
                  ✅ Normal activity levels
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suspicious Phone Numbers */}
      {analytics.topSuspiciousPhones.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Suspicious Phone Numbers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.topSuspiciousPhones.map(({ phone, count }) => (
              <div key={phone} className="bg-white rounded-lg p-4 border border-yellow-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{phone}</span>
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    {count} orders
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Multiple orders detected
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">Start analyzing orders to see analytics and insights.</p>
        </div>
      )}
    </div>
  );
}