import { useState, useEffect, useCallback } from 'react';
import { detectFakeOrder } from '../utils/detectionLogic';
import { saveOrder, getOrders, deleteOrder, clearOrders } from '../utils/storage';
import { Order, DetectionResult } from '../types';

interface UseFakeOrderDetectorOptions {
  /**
   * Custom storage key for localStorage
   * @default 'fake_order_detection_orders'
   */
  storageKey?: string;
  /**
   * Auto-load orders on hook initialization
   * @default true
   */
  autoLoad?: boolean;
}

interface OrderInput {
  customerName: string;
  phoneNumber: string;
  address: string;
  paymentMethod: 'COD' | 'Prepaid';
}

/**
 * Custom hook for managing fake order detection functionality
 */
export function useFakeOrderDetector(options: UseFakeOrderDetectorOptions = {}) {
  const { storageKey = 'fake_order_detection_orders', autoLoad = true } = options;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<DetectionResult | null>(null);

  // Load orders from storage
  const loadOrders = useCallback(() => {
    const storedOrders = getOrders();
    setOrders(storedOrders);
  }, []);

  // Auto-load orders on mount
  useEffect(() => {
    if (autoLoad) {
      loadOrders();
    }
  }, [autoLoad, loadOrders]);

  // Analyze a single order
  const analyzeOrder = useCallback(async (orderData: OrderInput): Promise<{ order: Order; result: DetectionResult }> => {
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1000));

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
      setLastResult(result);

      return { order: newOrder, result };
    } finally {
      setIsAnalyzing(false);
    }
  }, [orders]);

  // Remove a specific order
  const removeOrder = useCallback((orderId: string) => {
    deleteOrder(orderId);
    setOrders(prev => prev.filter(order => order.id !== orderId));
  }, []);

  // Clear all orders
  const clearAllOrders = useCallback(() => {
    clearOrders();
    setOrders([]);
    setLastResult(null);
  }, []);

  // Get analytics data
  const getAnalytics = useCallback(() => {
    const totalOrders = orders.length;
    const fakeOrders = orders.filter(order => order.status === 'Fake').length;
    const genuineOrders = totalOrders - fakeOrders;
    const fakePercentage = totalOrders > 0 ? Math.round((fakeOrders / totalOrders) * 100) : 0;

    // Phone frequency analysis
    const phoneFrequency: Record<string, number> = {};
    orders.forEach(order => {
      phoneFrequency[order.phoneNumber] = (phoneFrequency[order.phoneNumber] || 0) + 1;
    });

    const suspiciousPhones = Object.entries(phoneFrequency)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5)
      .map(([phone, count]) => ({ phone, count }));

    return {
      totalOrders,
      fakeOrders,
      genuineOrders,
      fakePercentage,
      suspiciousPhones,
      averageRiskScore: totalOrders > 0 
        ? Math.round(orders.reduce((sum, order) => sum + order.riskScore, 0) / totalOrders)
        : 0
    };
  }, [orders]);

  return {
    // State
    orders,
    isAnalyzing,
    lastResult,
    
    // Actions
    analyzeOrder,
    removeOrder,
    clearAllOrders,
    loadOrders,
    
    // Analytics
    analytics: getAnalytics(),
    
    // Utilities
    detectFakeOrder: (customerName: string, phoneNumber: string, address: string, paymentMethod: 'COD' | 'Prepaid') =>
      detectFakeOrder(customerName, phoneNumber, address, paymentMethod, orders)
  };
}