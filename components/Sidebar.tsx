
import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut, 
  Store,
  Users,
  ReceiptText,
  ChevronRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { UserRole, Restaurant } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  role, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  restaurant, 
  isOpen, 
  onClose 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'CASHIER'] },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingCart, roles: ['RESTAURANT_ADMIN', 'CASHIER'] },
    { id: 'billing', label: 'Invoices', icon: ReceiptText, roles: ['RESTAURANT_ADMIN', 'CASHIER'] },
    { id: 'inventory', label: 'Menu Catalog', icon: Package, roles: ['RESTAURANT_ADMIN'] },
    { id: 'analytics', label: 'Growth Hub', icon: BarChart3, roles: ['RESTAURANT_ADMIN'] },
    { id: 'tenants', label: 'Multi-Tenant', icon: Store, roles: ['SUPER_ADMIN'] },
    { id: 'users', label: 'Team', icon: Users, roles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`w-72 bg-white dark:bg-[#020617] h-screen fixed left-0 top-0 flex flex-col transition-transform duration-500 z-[70] border-r border-slate-100 dark:border-white/5 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        
        <button onClick={onClose} className="lg:hidden absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <X size={24} />
        </button>

        <div className="p-8 pb-10">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10">
                {restaurant?.logo ? (
                  <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-indigo-600 dark:text-white font-black text-xl">R</span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-lg tracking-tight leading-none text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {restaurant?.name || 'RestoFlow'}
              </h1>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <p className="text-slate-500 dark:text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">{restaurant?.plan || 'Standard'} NODE</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide py-2">
          <div className="px-4 mb-4">
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">Operational Core</p>
          </div>
          {menuItems.filter(item => item.roles.includes(role)).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center justify-between group px-5 py-4 rounded-2xl transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-white border border-indigo-100 dark:border-indigo-500/20 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full shadow-[4px_0_12px_rgba(99,102,241,0.5)]"></div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl transition-all duration-500 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' : 'bg-transparent text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-white dark:group-hover:bg-slate-800'}`}>
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-sm font-bold tracking-tight`}>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-indigo-600 dark:text-indigo-400" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-md rounded-[32px] p-5 border border-slate-100 dark:border-white/5 group hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all duration-500">
              <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-indigo-500/20">
                        {role.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white dark:border-[#020617] flex items-center justify-center">
                      <ShieldCheck size={10} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest truncate">Authorized</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{role.replace('_', ' ')}</p>
                  </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full mt-5 flex items-center justify-center gap-3 px-4 py-3.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-2xl transition-all duration-500 font-black text-[10px] uppercase tracking-[0.3em] border border-rose-500/10 hover:shadow-xl hover:shadow-rose-500/20 active:scale-95"
              >
                <LogOut size={16} />
                Session End
              </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
