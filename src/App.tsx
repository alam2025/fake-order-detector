import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { OrderForm } from './components/OrderForm';
import { DetectionResult } from './components/DetectionResult';
import { OrderHistory } from './components/OrderHistory';
import { AdminDashboard } from './components/AdminDashboard';
import { detectFakeOrder } from './utils/detectionLogic';
import { saveOrder, getOrders } from './utils/storage';
import { Order, DetectionResult as DetectionResultType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('detector');
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentResult, setCurrentResult] = useState<DetectionResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = getOrders();
    setOrders(storedOrders);
  };

  const handleOrderSubmit = async (orderData: {
    customerName: string;
    phoneNumber: string;
    address: string;
    paymentMethod: 'COD' | 'Prepaid';
  }) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = detectFakeOrder(
      orderData.customerName,
      orderData.phoneNumber,
      orderData.address,
      orderData.paymentMethod,
      orders
    );

    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
      timestamp: new Date(),
      status: result.status,
      riskScore: result.riskScore,
      detectionReasons: result.reasons
    };

    saveOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
    setCurrentResult(result);
    setIsAnalyzing(false);
  };

  const handleNewOrder = () => {
    setCurrentResult(null);
    setActiveTab('detector');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        orderCount={orders.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'detector' && (
          <div className="max-w-2xl mx-auto">
            {currentResult ? (
              <DetectionResult result={currentResult} onNewOrder={handleNewOrder} />
            ) : (
              <OrderForm onSubmit={handleOrderSubmit} isLoading={isAnalyzing} />
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <OrderHistory orders={orders} onOrdersChange={loadOrders} />
        )}

        {activeTab === 'dashboard' && (
          <AdminDashboard orders={orders} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 FakeGuard. Advanced order detection system for e-commerce security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;