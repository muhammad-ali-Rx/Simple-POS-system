
import React, { useState } from 'react';
import { Search, Printer, FileDown, Eye, Filter, CheckCircle2, MoreHorizontal, Loader2 } from 'lucide-react';
import { Order, Restaurant } from '../types';
import { jsPDF } from 'jspdf';

interface BillingProps {
  orders: Order[];
  restaurant: Restaurant;
}

const Billing: React.FC<BillingProps> = ({ orders, restaurant }) => {
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(search.toLowerCase())
  );

  const handlePrint = (order: Order) => {
    setSelectedOrder(order);
    setTimeout(() => window.print(), 100);
  };

  const handleDownloadPDF = (order: Order) => {
    setIsGenerating(order.id);
    
    // Simulate slight delay for professional feel
    setTimeout(() => {
      const doc = new jsPDF({
        unit: 'mm',
        format: [80, 200] // Thermal roll width
      });

      const currency = restaurant.currency;
      
      doc.setFontSize(14);
      doc.text(restaurant.name.toUpperCase(), 40, 15, { align: 'center' });
      
      doc.setFontSize(8);
      doc.text(restaurant.address, 40, 20, { align: 'center' });
      doc.text('-------------------------------------------', 40, 25, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`INVOICE: #${order.id}`, 5, 32);
      doc.setFontSize(8);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 5, 37);
      
      doc.text('-------------------------------------------', 40, 42, { align: 'center' });
      
      let y = 48;
      doc.setFont('helvetica', 'bold');
      doc.text('QTY', 5, y);
      doc.text('ITEM', 15, y);
      doc.text('TOTAL', 75, y, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      
      y += 5;
      order.items.forEach((item) => {
        doc.text(`${item.quantity}x`, 5, y);
        doc.text(item.name.substring(0, 25), 15, y);
        doc.text(`${currency}${(item.price * item.quantity).toFixed(2)}`, 75, y, { align: 'right' });
        y += 5;
      });
      
      y += 5;
      doc.text('-------------------------------------------', 40, y, { align: 'center' });
      y += 5;
      
      doc.text('SUBTOTAL:', 5, y);
      doc.text(`${currency}${order.subtotal.toFixed(2)}`, 75, y, { align: 'right' });
      y += 5;
      
      doc.text(`TAX (${(restaurant.taxRate * 100).toFixed(0)}%):`, 5, y);
      doc.text(`${currency}${order.tax.toFixed(2)}`, 75, y, { align: 'right' });
      y += 7;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL:', 5, y);
      doc.text(`${currency}${order.total.toFixed(2)}`, 75, y, { align: 'right' });
      
      y += 15;
      doc.setFontSize(10);
      doc.text('THANK YOU FOR YOUR VISIT!', 40, y, { align: 'center' });
      
      doc.save(`Invoice_${order.id}.pdf`);
      setIsGenerating(null);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      <div className="flex justify-between items-center no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Billing System</h1>
          <p className="text-gray-500">Track all invoices, handle refunds, and re-print receipts.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all">
            <Filter size={18} /> Advance Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden no-print">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
              <tr>
                <th className="px-8 py-5">Invoice ID</th>
                <th className="px-8 py-5">Date & Time</th>
                <th className="px-8 py-5">Items</th>
                <th className="px-8 py-5">Total Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400">
                    <p className="font-bold text-lg">No transactions found</p>
                    <p className="text-sm">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <p className="font-black text-slate-800 text-sm">#{order.id}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs text-gray-500 font-bold">
                        {new Date(order.createdAt).toLocaleDateString()}
                        <span className="block text-[10px] text-gray-400 opacity-60">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0, 2).map((item, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-[9px] font-bold text-gray-600 rounded">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="px-2 py-0.5 bg-indigo-50 text-[9px] font-black text-indigo-600 rounded">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-indigo-600">
                      {restaurant.currency}{order.total.toFixed(2)}
                    </td>
                    <td className="px-8 py-5">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <CheckCircle2 size={12} /> Paid
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handlePrint(order)}
                          className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all"
                        >
                          <Printer size={18} />
                        </button>
                        <button 
                          disabled={isGenerating === order.id}
                          onClick={() => handleDownloadPDF(order)}
                          className={`p-2 rounded-xl transition-all ${isGenerating === order.id ? 'text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-indigo-600'}`}
                        >
                          {isGenerating === order.id ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional Thermal Receipt for Print View */}
      {selectedOrder && (
        <div className="print-only fixed inset-0 z-[200] bg-white p-6 font-mono text-[9pt] leading-snug">
          <div className="max-w-[80mm] mx-auto">
            <div className="text-center mb-6">
                <img src={restaurant.logo} className="w-12 h-12 rounded-full mx-auto mb-2 grayscale" />
                <h1 className="font-bold text-lg uppercase tracking-widest">{restaurant.name}</h1>
                <p className="text-[7pt] opacity-80">{restaurant.address}</p>
                <div className="my-2 border-t-2 border-dashed border-black"></div>
                <p className="text-[8pt] font-bold">INVOICE: #{selectedOrder.id}</p>
                <p className="text-[7pt]">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>
            
            <div className="border-t border-b border-black py-4 my-2">
                <div className="flex justify-between font-bold text-[7pt] uppercase mb-2">
                    <span className="w-10">QTY</span>
                    <span className="flex-1">DESCRIPTION</span>
                    <span className="w-20 text-right">TOTAL</span>
                </div>
                {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between mb-1">
                        <span className="w-10">{item.quantity}x</span>
                        <span className="flex-1 truncate pr-2">{item.name}</span>
                        <span className="w-20 text-right">{restaurant.currency}{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="text-right space-y-1 mb-6">
                <p className="flex justify-between"><span>SUBTOTAL:</span> <span>{restaurant.currency}{selectedOrder.subtotal.toFixed(2)}</span></p>
                <p className="flex justify-between"><span>TAX ({(restaurant.taxRate * 100).toFixed(0)}%):</span> <span>{restaurant.currency}{selectedOrder.tax.toFixed(2)}</span></p>
                <div className="border-t border-black pt-1 mt-1">
                    <p className="flex justify-between font-black text-base italic"><span>TOTAL:</span> <span>{restaurant.currency}{selectedOrder.total.toFixed(2)}</span></p>
                </div>
            </div>

            <div className="text-center mt-8 pt-4 border-t-2 border-dashed border-black">
                <p className="font-bold">THANK YOU!</p>
                <p className="text-[7pt] mt-1">Follow us on Social Media</p>
                <div className="mt-4 opacity-50 text-[6pt]">
                  RestoFlow SaaS POS v2.5
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;