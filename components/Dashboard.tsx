
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Package, Sparkles, Loader2, ArrowUpRight, Zap } from 'lucide-react';
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
    const timer = setTimeout(() => setChartsReady(true), 200);
    
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
    <div className="space-y-8 animate-slideUp pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Business Intelligence</h1>
          <p className="text-slate-500 font-medium">Real-time pulse of <span className="text-indigo-600 font-bold">@{restaurant.name}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Syncing</span>
          </div>
          <span className="px-4 py-2 bg-indigo-600 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-lg shadow-indigo-200">
            {restaurant.plan} PLAN
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Net Revenue', value: `${restaurant.currency}${totalRevenue.toFixed(2)}`, trend: '+12%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Total Volume', value: totalOrders, trend: '+5.4%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Basket Size', value: `${restaurant.currency}${avgOrderValue.toFixed(2)}`, trend: '-1.2%', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
          { label: 'Stock Health', value: items.length, trend: 'Optimal', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-7 rounded-[32px] border ${stat.border} shadow-sm group hover:shadow-xl transition-all duration-300 card-hover`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl transition-transform group-hover:scale-110`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-full">
                <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-emerald-500' : stat.trend === 'Optimal' ? 'text-indigo-500' : 'text-rose-500'}`}>
                    {stat.trend}
                </span>
                <ArrowUpRight size={10} className={stat.trend.startsWith('+') ? 'text-emerald-500' : 'hidden'} />
              </div>
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Dynamics</h3>
                <p className="text-sm text-slate-500 font-medium">Monitoring hourly throughput</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-500 uppercase">Weekly</button>
                <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-tight">Monthly</button>
              </div>
           </div>
           <div className="h-[320px] w-full">
              {chartsReady ? (
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[{n:'Mon',v:1400},{n:'Tue',v:1900},{n:'Wed',v:1600},{n:'Thu',v:2400},{n:'Fri',v:3200},{n:'Sat',v:4100},{n:'Sun',v:3800}]}>
                     <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dx={-10} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                        itemStyle={{ fontWeight: 800, color: '#6366f1' }}
                     />
                     <Area type="monotone" dataKey="v" stroke="#6366f1" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={4} />
                   </AreaChart>
                </ResponsiveContainer>
              ) : <div className="animate-pulse bg-slate-50 h-full w-full rounded-[32px]" />}
           </div>
        </div>

        <div className="lg:col-span-4 bg-[#0f172a] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative z-10 flex flex-col h-full">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                    <Sparkles size={22} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-black text-lg leading-none">AI Business Pilot</h3>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">Smart Engine v3.1</p>
                    </div>
                </div>
                <Zap size={20} className="text-yellow-400 animate-pulse" />
             </div>
             
             {loadingInsights ? (
               <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={24} />
                  </div>
                  <p className="text-indigo-300 text-sm font-black tracking-tight">Harvesting POS Intelligence...</p>
               </div>
             ) : (
               <div className="flex-1 flex flex-col">
                  <div className="flex-1 bg-white/5 p-6 rounded-[28px] border border-white/5 text-sm text-slate-300 leading-relaxed overflow-y-auto scrollbar-thin mb-8 italic">
                     {aiInsights || "Awaiting transaction data to generate breakthrough insights..."}
                  </div>
                  <button className="w-full py-5 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2">
                     <Sparkles size={16} /> Regnerate Wisdom
                  </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;