
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
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'CASHIER'] },
    { id: 'pos', label: 'POS Terminal', icon: ShoppingCart, roles: ['RESTAURANT_ADMIN', 'CASHIER'] },
    { id: 'billing', label: 'Billing & History', icon: ReceiptText, roles: ['RESTAURANT_ADMIN', 'CASHIER'] },
    { id: 'inventory', label: 'Menu Catalog', icon: Package, roles: ['RESTAURANT_ADMIN'] },
    { id: 'analytics', label: 'Insights', icon: BarChart3, roles: ['RESTAURANT_ADMIN'] },
    { id: 'tenants', label: 'Marketplace', icon: Store, roles: ['SUPER_ADMIN'] },
    { id: 'users', label: 'Staff Hub', icon: Users, roles: ['RESTAURANT_ADMIN', 'SUPER_ADMIN'] },
    { id: 'settings', label: 'Preferences', icon: Settings, roles: ['SUPER_ADMIN', 'RESTAURANT_ADMIN', 'CASHIER'] },
  ];

  return (
    <aside className="w-72 bg-[#0f172a] text-white h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-50 no-print border-r border-white/5">
      <div className="p-8">
        <div className="flex items-center gap-3 font-extrabold text-2xl tracking-tighter">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white">R</span>
          </div>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">RestoFlow</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">SaaS Infrastructure</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide py-4">
        {menuItems.filter(item => item.roles.includes(role)).map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between group px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-500 text-white' : 'bg-transparent text-slate-500 group-hover:text-indigo-400'}`}>
                    <item.icon size={20} />
                </div>
                <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="text-indigo-400" />}
            </button>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="bg-white/5 rounded-[24px] p-5 border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-xl shadow-inner">
                    S
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest truncate">Administrator</p>
                    <p className="text-sm font-bold text-white truncate">Main System</p>
                </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-widest border border-red-500/20"
            >
              <LogOut size={16} />
              Sign Out
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;