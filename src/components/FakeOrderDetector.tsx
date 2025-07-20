import React, { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { OrderForm } from "./OrderForm";
import { DetectionResult } from "./DetectionResult";
import { OrderHistory } from "./OrderHistory";
import { AdminDashboard } from "./AdminDashboard";
import { detectFakeOrder } from "../utils/detectionLogic";
import { saveOrder, getOrders } from "../utils/storage";
import { Order, DetectionResult as DetectionResultType } from "../types";

interface FakeOrderDetectorProps {
  /**
   * Custom CSS classes to apply to the container
   */
  className?: string;
  /**
   * Whether to show the navigation tabs
   * @default true
   */
  showNavigation?: boolean;
  /**
   * Default active tab
   * @default 'detector'
   */
  defaultTab?: "detector" | "history" | "dashboard";
  /**
   * Callback when an order is analyzed
   */
  onOrderAnalyzed?: (order: Order, result: DetectionResultType) => void;
  /**
   * Custom storage key for localStorage
   * @default 'fake_order_detection_orders'
   */
  storageKey?: string;
}

/**
 * Main Fake Order Detector component that provides a complete interface
 * for detecting fake orders with analytics and history tracking
 */
export function FakeOrderDetector({
  className = "",
  showNavigation = true,
  defaultTab = "detector",
  onOrderAnalyzed,
  storageKey = "fake_order_detection_orders",
}: FakeOrderDetectorProps) {
  const [activeTab, setActiveTab] = useState<any>(defaultTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentResult, setCurrentResult] =
    useState<DetectionResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [storageKey]);

  const loadOrders = () => {
    const storedOrders = getOrders();
    setOrders(storedOrders);
  };

  const handleOrderSubmit = async (orderData: {
    customerName: string;
    phoneNumber: string;
    address: string;
    paymentMethod: "COD" | "Prepaid";
  }) => {
    setIsAnalyzing(true);

    // Simulate analysis delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
      detectionReasons: result.reasons,
    };

    saveOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentResult(result);
    setIsAnalyzing(false);

    // Call the callback if provided
    if (onOrderAnalyzed) {
      onOrderAnalyzed(newOrder, result);
    }
  };

  const handleNewOrder = () => {
    setCurrentResult(null);
    setActiveTab("detector");
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {showNavigation && (
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orderCount={orders.length}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "detector" && (
          <div className="max-w-2xl mx-auto">
            {currentResult ? (
              <DetectionResult
                result={currentResult}
                onNewOrder={handleNewOrder}
              />
            ) : (
              <OrderForm onSubmit={handleOrderSubmit} isLoading={isAnalyzing} />
            )}
          </div>
        )}

        {activeTab === "history" && (
          <OrderHistory orders={orders} onOrdersChange={loadOrders} />
        )}

        {activeTab === "dashboard" && <AdminDashboard orders={orders} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              © 2025 FakeGuard. Advanced order detection system for e-commerce
              security.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
