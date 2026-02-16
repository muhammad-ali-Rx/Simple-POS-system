
import { Restaurant, Item, Category, User } from './types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Gourmet Kitchen',
    logo: 'https://picsum.photos/seed/gourmet/200',
    address: '123 Culinary St, Food City',
    currency: '$',
    taxRate: 0.08,
    plan: 'PRO'
  },
  {
    id: 'rest-2',
    name: 'Sushi Zen',
    logo: 'https://picsum.photos/seed/sushi/200',
    address: '456 Ocean Ave, Bay View',
    currency: '¥',
    taxRate: 0.1,
    plan: 'ENTERPRISE'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Main Course' },
  { id: 'cat-2', name: 'Beverages' },
  { id: 'cat-3', name: 'Desserts' },
  { id: 'cat-4', name: 'Appetizers' },
];

export const MOCK_ITEMS: Item[] = [
  { id: 'i1', name: 'Classic Burger', price: 12.99, categoryId: 'cat-1', image: 'https://picsum.photos/seed/burger/300', available: true, stock: 50 },
  { id: 'i2', name: 'Pepperoni Pizza', price: 15.50, categoryId: 'cat-1', image: 'https://picsum.photos/seed/pizza/300', available: true, stock: 30 },
  { id: 'i3', name: 'Caesar Salad', price: 9.99, categoryId: 'cat-4', image: 'https://picsum.photos/seed/salad/300', available: true, stock: 20 },
  { id: 'i4', name: 'Coca Cola', price: 2.50, categoryId: 'cat-2', image: 'https://picsum.photos/seed/coke/300', available: true, stock: 100 },
  { id: 'i5', name: 'Cheesecake', price: 6.99, categoryId: 'cat-3', image: 'https://picsum.photos/seed/cake/300', available: true, stock: 15 },
  { id: 'i6', name: 'Fresh Orange Juice', price: 4.50, categoryId: 'cat-2', image: 'https://picsum.photos/seed/juice/300', available: true, stock: 40 },
  { id: 'i7', name: 'Grilled Salmon', price: 22.00, categoryId: 'cat-1', image: 'https://picsum.photos/seed/salmon/300', available: true, stock: 12 },
  { id: 'i8', name: 'Bruschetta', price: 7.50, categoryId: 'cat-4', image: 'https://picsum.photos/seed/bruschetta/300', available: true, stock: 25 },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@gourmetkitchen.com',
  role: 'RESTAURANT_ADMIN',
  restaurantId: 'rest-1'
};
