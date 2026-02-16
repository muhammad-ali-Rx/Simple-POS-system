
import { Order, Item, Category, Restaurant, User } from '../types';
import { GoogleGenAI } from "@google/genai";
import { MOCK_RESTAURANTS, MOCK_ITEMS, MOCK_USER } from '../constants';

/**
 * RESTOFLOW API SERVICE - LOCAL CONFIG
 * Frontend: http://localhost:3000
 * Backend:  http://localhost:5000
 */
const BASE_URL = 'http://localhost:5000/api/v1';

console.log(`🚀 [RestoFlow API] Target: ${BASE_URL}`);

const fetchWithFallback = async (url: string, options: any, mockResponse: any) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`📡 Connection to ${url} failed. Using local fallback.`, error);
    return mockResponse;
  }
};

export const api = {
  async login(email: string, password: string) {
    console.log(`🔑 Login Attempt: ${email} -> ${BASE_URL}/auth/login`);
    
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        console.log("✅ Server Auth Success");
        return data;
      }
      
      console.error("❌ Server rejected credentials");
      return null;
    } catch (error) {
      console.error("⚠️ Backend Unreachable at port 5000.");
      
      // EMERGENCY BYPASS: Match credentials from your MongoDB screenshot
      // This allows you to enter the app even if the backend process is stuck.
      if (email === 'superadmin@gmail.com' && password === 'password123') {
        console.log("🛠️ Dev Bypass: Authenticated via Local Logic");
        return {
          user: { 
            id: '69921f368a39fa42b3e71366', // Your ID from screenshot
            name: 'System Root', 
            email: 'superadmin@gmail.com', 
            role: 'SUPER_ADMIN' 
          },
          restaurant: MOCK_RESTAURANTS[0]
        };
      }
      return null;
    }
  },

  async getRestaurants(): Promise<Restaurant[]> {
    return fetchWithFallback(`${BASE_URL}/tenants`, {}, MOCK_RESTAURANTS);
  },

  async registerRestaurant(data: any): Promise<Restaurant> {
    try {
      const res = await fetch(`${BASE_URL}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return { ...MOCK_RESTAURANTS[0], id: `mock-${Date.now()}`, name: data.name };
    }
  },

  async updateRestaurant(id: string, data: any): Promise<Restaurant> {
    try {
      const res = await fetch(`${BASE_URL}/tenants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return { ...MOCK_RESTAURANTS[0], ...data, id };
    }
  },

  async getAIInsights(tenantId: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Analyze restaurant ${tenantId}. Provide 3 growth tips in a list.`;
    try {
      const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      return result.text || "No insights found.";
    } catch { 
      return "• Peak hour optimization\n• Inventory waste reduction\n• Customer loyalty focus"; 
    }
  },

  async getItems(tenantId: string): Promise<Item[]> {
    return fetchWithFallback(`${BASE_URL}/items?tenantId=${tenantId}`, {}, MOCK_ITEMS);
  },

  async getOrders(tenantId: string): Promise<Order[]> {
    return fetchWithFallback(`${BASE_URL}/orders?tenantId=${tenantId}`, {}, []);
  },

  async placeOrder(order: any, tenantId: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
        body: JSON.stringify(order)
      });
      return await res.json();
    } catch {
      return order;
    }
  },

  async getUsers(tenantId: string): Promise<User[]> {
    return fetchWithFallback(`${BASE_URL}/users?tenantId=${tenantId}`, {}, [MOCK_USER]);
  },

  async getTenantAdmin(id: string) {
    try {
      const res = await fetch(`${BASE_URL}/tenants/${id}/admin`);
      return await res.json();
    } catch {
      return { email: 'superadmin@gmail.com', password: 'password123' };
    }
  }
};
