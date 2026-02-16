
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Package, Sparkles, 
  ArrowUpRight, Zap, Clock, ChevronRight, Activity 
} from 'lucide-react';
import { Order, Item, Restaurant } from '../types';
import { api } from '../services/api';

interface DashboardProps {
  orders: Order[];
  items: Item[];
  restaurant: Restaurant;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, items, restaurant }) => {
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChartsReady(true), 300);
    
    const fetchInsights = async () => {
      setLoadingInsights(true);
      try {
        const insights = await api.getAIInsights(restaurant.id);
        setAiInsights(insights);
      } catch (error) {
        setAiInsights("AI Analysis currently unavailable. Please try again later.");
      } finally {
        setLoadingInsights(false);
      }
    };
    
    fetchInsights();
    return () => clearTimeout(timer);
  }, [restaurant.id, orders.length]);

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="space-y-10 animate-slideUp pb-20">
      {/* Welcome Header - Enhanced Contrast */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-100 dark:border-indigo-900/50">
             <Sparkles size={14} className="text-indigo-700 dark:text-indigo-400" />
             <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Enterprise Intelligence</span>
          </div>
          <h1 className="text-5xl font-black text-slate-950 dark:text-white tracking-tight leading-none">
            Operational <span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
            Managing throughput for <span className="font-bold text-slate-900 dark:text-slate-200 underline decoration-indigo-500/40 underline-offset-4">{restaurant.name}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-[28px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
           <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + restaurant.id}`} alt="Staff" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                +4
              </div>
           </div>
           <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-2"></div>
           <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
             Live View
           </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Gross Revenue', value: `${restaurant.currency}${totalRevenue.toLocaleString()}`, trend: '+18.4%', icon: DollarSign, color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
          { label: 'Order Velocity', value: totalOrders, trend: '+5.2%', icon: TrendingUp, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { label: 'Average Ticket', value: `${restaurant.currency}${avgOrderValue.toFixed(2)}`, trend: '-2.1%', icon: Activity, color: 'text-violet-700 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/40' },
          { label: 'Inventory SKU', value: items.length, trend: 'Healthy', icon: Package, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-12 -mt-12 opacity-40 dark:opacity-20 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className={`${stat.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                        <stat.icon className={stat.color} size={28} strokeWidth={2.5} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${stat.trend.startsWith('+') ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'}`}>
                        {stat.trend} {stat.trend.startsWith('+') && <ArrowUpRight size={12} />}
                    </div>
                </div>
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-slate-950 dark:text-white tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Chart Section */}
        <div className="xl:col-span-8 bg-white dark:bg-slate-900 p-12 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Revenue Trajectory</h3>
                <p className="text-slate-500 dark:text-slate-500 font-medium italic">Advanced real-time sync enabled</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                {['24h', '7d', '30d'].map(range => (
                    <button key={range} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${range === '7d' ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-slate-300'}`}>
                        {range}
                    </button>
                ))}
              </div>
           </div>
           
           <div className="h-[400px] w-full">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[{n:'Mon',v:1400},{n:'Tue',v:2100},{n:'Wed',v:1800},{n:'Thu',v:2900},{n:'Fri',v:3600},{n:'Sat',v:4800},{n:'Sun',v:4200}]}>
                     <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                     <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 800}} dy={20} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 800}} dx={-15} />
                     <Tooltip 
                        contentStyle={{ 
                          borderRadius: '28px', 
                          border: 'none', 
                          boxShadow: '0 30px 60px -12px rgba(0,0,0,0.25)', 
                          padding: '24px',
                          backgroundColor: '#0f172a',
                          color: '#fff'
                        }}
                        itemStyle={{ fontWeight: 900, color: '#818cf8', fontSize: '16px' }}
                        labelStyle={{ fontWeight: 800, color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' }}
                     />
                     <Area type="monotone" dataKey="v" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={6} />
                   </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-[40px] animate-pulse">
                    <div className="flex flex-col items-center gap-3">
                        <Activity className="text-slate-300 dark:text-slate-700 animate-spin-slow" size={48} />
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Compiling Analytics...</span>
                    </div>
                </div>
              )}
           </div>
        </div>

        {/* AI Sidebar */}
        <div className="xl:col-span-4 space-y-8">
            <div className="bg-[#0f172a] text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] group-hover:bg-indigo-500/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-500/20 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10 flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                                <Sparkles size={28} className="text-indigo-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl tracking-tight leading-none">GenAI Consultant</h3>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                                    Autonomous v3.5
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {loadingInsights ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 border-[6px] border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-indigo-300 text-sm font-black tracking-widest uppercase animate-pulse">Scanning Cloud Data...</p>
                    </div>
                    ) : (
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 bg-white/[0.03] p-8 rounded-[32px] border border-white/10 text-slate-300 leading-relaxed overflow-y-auto scrollbar-thin mb-10 font-medium italic">
                            {aiInsights || "Collecting cross-tenant benchmarks to provide actionable intelligence..."}
                        </div>
                        <button className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-indigo-600/40 active:scale-95 flex items-center justify-center gap-3 border border-indigo-500/50">
                            Refine Strategy <ChevronRight size={16} />
                        </button>
                    </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="text-lg font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-3">
                        <Activity size={20} className="text-rose-500" />
                        Live Feed
                    </h4>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">Recent Session</span>
                </div>
                <div className="space-y-6">
                    {orders.slice(0, 4).map((order, i) => (
                        <div key={i} className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition-colors">
                                <Clock size={20} className="text-slate-500 dark:text-slate-600 group-hover:text-indigo-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between mb-0.5">
                                    <p className="font-bold text-slate-900 dark:text-slate-200 truncate text-sm">#{order.id}</p>
                                    <p className="font-black text-emerald-700 dark:text-emerald-400 text-xs">{restaurant.currency}{order.total.toFixed(2)}</p>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase truncate">{order.items.length} units • Validated</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
