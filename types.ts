
export type UserRole = 'SUPER_ADMIN' | 'RESTAURANT_ADMIN' | 'CASHIER';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for mock login logic
  role: UserRole;
  restaurantId?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  address: string;
  currency: string;
  taxRate: number;
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
}

export interface Category {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  image: string;
  available: boolean;
  stock: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: string;
  cashierId: string;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}
