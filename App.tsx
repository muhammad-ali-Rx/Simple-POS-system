
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Settings, 
  Moon, 
  Sun,
  ChevronDown,
  Globe,
  Loader2
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
  const [isLoading, setIsLoading] = useState(true);
  const [showTenantList, setShowTenantList] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    // Check for existing session
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
          const [fetchedItems, fetchedOrders, fetchedRestaurants] = await Promise.all([
            api.getItems(currentRestaurant.id),
            api.getOrders(currentRestaurant.id),
            api.getRestaurants()
          ]);
          setItems(fetchedItems);
          setOrders(fetchedOrders);
          setAllRestaurants(fetchedRestaurants);
        } catch (error) {
          console.error("Failed to fetch data:", error);
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
    const savedOrder = await api.placeOrder(order, currentRestaurant.id);
    setOrders(prev => [savedOrder, ...prev]);
    const updatedItems = await api.getItems(currentRestaurant.id);
    setItems(updatedItems);
  };

  const handleUpdateItems = async (newItems: Item[]) => {
    setItems(newItems);
  };

  const handleSwitchTenant = (res: Restaurant) => {
    setCurrentRestaurant(res);
    setShowTenantList(false);
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (!currentRestaurant) return null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard orders={orders} items={items} restaurant={currentRestaurant} />;
      case 'pos':
        return <POSTerminal items={items} categories={categories} restaurant={currentRestaurant} onPlaceOrder={handlePlaceOrder} />;
      case 'billing':
        return <Billing orders={orders} restaurant={currentRestaurant} />;
      case 'inventory':
        return <Inventory items={items} categories={categories} restaurant={currentRestaurant} onUpdateItems={handleUpdateItems} />;
      case 'users':
        return <StaffManagement restaurant={currentRestaurant} />;
      case 'tenants':
        return <TenantManagement />;
      case 'analytics':
        return <Analytics orders={orders} restaurant={currentRestaurant} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
            <Settings size={64} className="animate-pulse" />
            <h2 className="text-xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon</h2>
            <p>Module configuration in progress.</p>
          </div>
        );
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50'}`}>
      <Sidebar role={currentUser?.role || 'CASHIER'} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 ml-64 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between border-b border-gray-100 dark:border-slate-700 no-print">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white capitalize">
              {activeTab.replace('-', ' ')}
            </h2>
            
            {currentUser?.role === 'SUPER_ADMIN' && currentRestaurant && (
              <div className="relative">
                <button 
                  onClick={() => setShowTenantList(!showTenantList)}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-100 uppercase tracking-tighter"
                >
                  <Globe size={14} />
                  Active: {currentRestaurant.name}
                  <ChevronDown size={14} />
                </button>
                {showTenantList && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase p-2 tracking-widest">Select Tenant</p>
                    {allRestaurants.map(r => (
                      <button 
                        key={r.id} 
                        onClick={() => handleSwitchTenant(r)}
                        className={`w-full text-left p-3 rounded-xl text-sm font-bold flex items-center gap-3 hover:bg-gray-50 transition-colors ${currentRestaurant.id === r.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600'}`}
                      >
                        <img src={r.logo} className="w-6 h-6 rounded-md object-cover" />
                        {r.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentUser?.role !== 'SUPER_ADMIN' && currentRestaurant && (
               <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <img src={currentRestaurant.logo} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{currentRestaurant.name}</span>
               </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Global search..." className="bg-gray-100 dark:bg-slate-700 border-none rounded-xl pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-500" />
            </div>

            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500"><Moon size={20} /></button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 relative"><Bell size={20} /><span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full"></span></button>

            {currentUser && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                  <p className="text-[10px] text-indigo-600 font-black uppercase">{currentUser.role.replace('_', ' ')}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-200">
                  {currentUser.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
