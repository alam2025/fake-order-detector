import { Order } from '../types';

const STORAGE_KEY = 'fake_order_detection_orders';

export function saveOrder(order: Order): void {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function getOrders(): Order[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const orders = JSON.parse(stored);
    return orders.map((order: any) => ({
      ...order,
      timestamp: new Date(order.timestamp)
    }));
  } catch {
    return [];
  }
}

export function clearOrders(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteOrder(orderId: string): void {
  const orders = getOrders().filter(order => order.id !== orderId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}