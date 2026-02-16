
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  Moon, 
  Sun,
  ChevronDown,
  Globe,
  Loader2,
  Cpu,
  ShieldCheck,
  LayoutGrid,
  Zap,
  Activity,
  Command,
  Menu
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import POSTerminal from './components/POSTerminal';
import Inventory from './components/Inventory';
import StaffManagement from './components/StaffManagement';
import TenantManagement from './components/TenantManagement';
import Analytics from './components/Analytics';
import Billing from './components/Billing';
import Login from './components/Login';
import { User, Restaurant, Item, Category, Order } from './types';
import { MOCK_USER, MOCK_RESTAURANTS, MOCK_CATEGORIES } from './constants';
import { api } from './services/api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle Online Auto-Sync
  useEffect(() => {
    const handleOnline = async () => {
      const offlineOrders = JSON.parse(localStorage.getItem('restoflow_offline_orders') || '[]');
      if (offlineOrders.length > 0 && currentRestaurant) {
        for (const order of offlineOrders) {
          try {
            await api.placeOrder(order, currentRestaurant.id);
          } catch (err) {
            console.error("Sync error:", err);
          }
        }
        localStorage.removeItem('restoflow_offline_orders');
        const freshOrders = await api.getOrders(currentRestaurant.id);
        setOrders(freshOrders);
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [currentRestaurant]);

  useEffect(() => {
    const savedUser = localStorage.getItem('restoflow_user');
    const savedRestaurant = localStorage.getItem('restoflow_restaurant');
    if (savedUser && savedRestaurant) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentRestaurant(JSON.parse(savedRestaurant));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && currentRestaurant) {
      const fetchData = async () => {
        try {
          const [fetchedItems, fetchedOrders] = await Promise.all([
            api.getItems(currentRestaurant.id),
            api.getOrders(currentRestaurant.id)
          ]);
          setItems(fetchedItems);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Fetch failed:", error);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, currentRestaurant]);

  const handleLogin = (user: User, restaurant: Restaurant) => {
    setCurrentUser(user);
    setCurrentRestaurant(restaurant);
    setIsAuthenticated(true);
    localStorage.setItem('restoflow_user', JSON.stringify(user));
    localStorage.setItem('restoflow_restaurant', JSON.stringify(restaurant));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentRestaurant(null);
    localStorage.removeItem('restoflow_user');
    localStorage.removeItem('restoflow_restaurant');
    setActiveTab('dashboard');
  };

  const handlePlaceOrder = async (order: Order) => {
    if (!currentRestaurant) return;
    setOrders(prev => [order, ...prev]);
    if (!navigator.onLine) {
      const offline = JSON.parse(localStorage.getItem('restoflow_offline_orders') || '[]');
      localStorage.setItem('restoflow_offline_orders', JSON.stringify([...offline, order]));
      return;
    }
    try {
      await api.placeOrder(order, currentRestaurant.id);
      const updated = await api.getItems(currentRestaurant.id);
      setItems(updated);
    } catch {
      const offline = JSON.parse(localStorage.getItem('restoflow_offline_orders') || '[]');
      localStorage.setItem('restoflow_offline_orders', JSON.stringify([...offline, order]));
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  const renderContent = () => {
    if (!currentRestaurant) return null;
    switch (activeTab) {
      case 'dashboard': return <Dashboard orders={orders} items={items} restaurant={currentRestaurant} />;
      case 'pos': return <POSTerminal items={items} categories={categories} restaurant={currentRestaurant} onPlaceOrder={handlePlaceOrder} />;
      case 'billing': return <Billing orders={orders} restaurant={currentRestaurant} />;
      case 'inventory': return <Inventory items={items} categories={categories} restaurant={currentRestaurant} onUpdateItems={setItems} />;
      case 'users': return <StaffManagement restaurant={currentRestaurant} />;
      case 'tenants': return <TenantManagement />;
      case 'analytics': return <Analytics orders={orders} restaurant={currentRestaurant} />;
      default: return null;
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <Sidebar 
        role={currentUser?.role || 'CASHIER'} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        restaurant={currentRestaurant}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="main-content flex-1 flex flex-col min-h-screen overflow-x-hidden transition-all duration-500">
        <header className="h-20 lg:h-24 sticky top-0 z-40 px-4 md:px-8 lg:px-12 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl">
          <div className="flex items-center gap-3 lg:gap-10">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-900 rounded-xl">
              <Menu size={20} />
            </button>
            <div className="flex flex-col">
                <span className="text-[8px] lg:text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-0.5 lg:mb-1">RestoFlow SaaS</span>
                <h2 className="text-base lg:text-2xl font-black text-slate-900 dark:text-white capitalize tracking-tighter">{activeTab.replace('-', ' ')}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 dark:text-amber-400 transition-all">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {currentUser && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 group">
                <div className="text-right hidden sm:block">
                  <p className="text-xs lg:text-sm font-black text-slate-900 dark:text-white leading-none tracking-tight">{currentUser.name}</p>
                  <p className="text-[8px] lg:text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">{currentUser.role.replace('_', ' ')}</p>
                </div>
                <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-slate-950 dark:bg-slate-800 text-white flex items-center justify-center font-black text-base shadow-lg">
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
