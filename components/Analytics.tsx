
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Calendar, Filter, FileText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Order, Restaurant } from '../types';

interface AnalyticsProps {
  orders: Order[];
  restaurant: Restaurant;
}

const Analytics: React.FC<AnalyticsProps> = ({ orders, restaurant }) => {
  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Subtotal', 'Tax', 'Total', 'Status'];
    const rows = orders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleDateString(),
      o.subtotal.toFixed(2),
      o.tax.toFixed(2),
      o.total.toFixed(2),
      o.status
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `sales_report_${restaurant.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartData = [
    { name: 'Week 1', sales: 4200 },
    { name: 'Week 2', sales: 3800 },
    { name: 'Week 3', sales: 5100 },
    { name: 'Week 4', sales: 4800 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
          <p className="text-gray-500">In-depth performance analysis for {restaurant.name}.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all">
            <Calendar size={18} /> Last 30 Days
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Net Revenue</span>
            </div>
            <h2 className="text-4xl font-black text-gray-800">{restaurant.currency}{orders.reduce((a,b)=>a+b.total,0).toFixed(2)}</h2>
            <div className="flex items-center gap-1.5 text-emerald-500 text-sm font-bold mt-2">
              <ArrowUpRight size={16} /> +12.5% vs last month
            </div>
          </div>
          <div className="h-20 mt-6">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData}>
                 <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={false} />
               </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Sales Volume</h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase">Weekly Performance</span>
              </div>
           </div>
           <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} hide />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Bar dataKey="sales" fill="#6366f1" radius={[10, 10, 10, 10]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Recent Transactions</h3>
          <button className="text-indigo-600 text-xs font-bold hover:underline">View All History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead className="bg-gray-50/50">
               <tr>
                 <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                 <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                 <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                 <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                 <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
               {orders.slice(0, 10).map(order => (
                 <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                   <td className="px-6 py-4 font-bold text-gray-800 text-sm">#{order.id}</td>
                   <td className="px-6 py-4 text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                   <td className="px-6 py-4 text-xs text-gray-500 font-medium">{order.items.length} units</td>
                   <td className="px-6 py-4 font-black text-indigo-600 text-sm">{restaurant.currency}{order.total.toFixed(2)}</td>
                   <td className="px-6 py-4 text-right">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-black uppercase">Paid</span>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
