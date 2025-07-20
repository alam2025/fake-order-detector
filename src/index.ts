// Main exports for the npm package
export { FakeOrderDetector } from './components/FakeOrderDetector';
export { OrderForm } from './components/OrderForm';
export { DetectionResult } from './components/DetectionResult';
export { OrderHistory } from './components/OrderHistory';
export { AdminDashboard } from './components/AdminDashboard';

// Utility exports
export { detectFakeOrder } from './utils/detectionLogic';
export { saveOrder, getOrders, clearOrders, deleteOrder } from './utils/storage';

// Type exports
export type { Order, DetectionResult as DetectionResultType, Analytics } from './types';

// Hook exports
export { useFakeOrderDetector } from './hooks/useFakeOrderDetector';