
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Trash2, Printer, Plus, Minus, CreditCard, X, CheckCircle2, Tag } from 'lucide-react';
import { Item, Category, OrderItem, Restaurant, Order } from '../types';

interface POSProps {
  items: Item[];
  categories: Category[];
  restaurant: Restaurant;
  onPlaceOrder: (order: Order) => void;
}

const POSTerminal: React.FC<POSProps> = ({ items, categories, restaurant, onPlaceOrder }) => {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const searchTerm = search.toLowerCase();
      const category = categories.find(c => c.id === item.categoryId);
      const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                            (category?.name.toLowerCase().includes(searchTerm));
      const matchesCategory = selectedCategory ? item.categoryId === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [items, categories, selectedCategory, search]);

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const tax = subtotal * restaurant.taxRate;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      restaurantId: restaurant.id,
      items: [...cart],
      subtotal,
      tax,
      discount: 0,
      total,
      status: 'PAID',
      createdAt: new Date().toISOString(),
      cashierId: 'u1'
    };
    setLastOrder(newOrder);
    onPlaceOrder(newOrder);
    setCart([]);
    setShowReceipt(true);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-8 animate-slideUp overflow-hidden">
      {/* Items Section */}
      <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
        <div className="flex items-center gap-4 no-print">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Quick search menu items..." 
              className="w-full pl-12 pr-6 py-4 rounded-[20px] bg-white border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm font-semibold transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 bg-white p-2 rounded-[22px] border border-slate-100 shadow-sm overflow-x-auto scrollbar-hide no-print">
            <button 
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2 rounded-[16px] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === null ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50'
                }`}
            >
                All
            </button>
            {categories.map(cat => (
                <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-[16px] text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50'
                }`}
                >
                {cat.name}
                </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pr-2 scrollbar-thin pb-6">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col active:scale-95 relative"
            >
              <div className="aspect-[4/3] w-full rounded-[24px] overflow-hidden mb-4 bg-slate-50 relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-3 right-3 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-2xl text-indigo-600 shadow-xl border border-white/50">
                        <Plus size={20} strokeWidth={3} />
                    </div>
                </div>
                {!item.available && (
                  <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-white font-black text-[10px] uppercase tracking-[0.3em] backdrop-blur-[4px]">
                    Paused
                  </div>
                )}
              </div>
              <div className="px-1 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                </div>
                <div className="flex items-center gap-2 mb-3">
                    <Tag size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {categories.find(c => c.id === item.categoryId)?.name}
                    </span>
                </div>
                <div className="flex justify-between items-center mt-auto">
                    <p className="text-indigo-600 font-black text-lg">{restaurant.currency}{item.price.toFixed(2)}</p>
                    <div className="px-3 py-1 bg-slate-50 rounded-full">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">{item.stock} left</p>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-[440px] bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-slate-100 no-print">
        <div className="p-10 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                <ShoppingCart size={24} strokeWidth={2.5} />
            </div>
            <div>
                <h3 className="font-black text-xl tracking-tight">Checkout</h3>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                    <p className="text-[10px] text-indigo-300 uppercase tracking-[0.2em] font-black">Active Terminal</p>
                </div>
            </div>
          </div>
          <div className="relative z-10 bg-white/10 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest">{cart.length} items</div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-200 space-y-4">
              <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center border-2 border-dashed border-slate-100">
                <ShoppingCart size={32} className="text-slate-200" strokeWidth={1.5} />
              </div>
              <p className="font-black text-sm uppercase tracking-widest text-slate-300">Bag is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-5 group animate-fadeIn">
                <div className="flex-1 min-w-0">
                  <h5 className="font-black text-slate-800 truncate text-sm mb-1">{item.name}</h5>
                  <p className="text-[11px] text-indigo-500 font-black uppercase tracking-tight">{restaurant.currency}{item.price.toFixed(2)} unit</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-1.5 border border-slate-100 shadow-inner">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 hover:text-rose-500 rounded-xl transition-all shadow-sm text-slate-400"><Minus size={16} /></button>
                  <span className="text-sm font-black w-6 text-center text-slate-800">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-100 hover:text-indigo-600 rounded-xl transition-all shadow-sm text-slate-400"><Plus size={16} /></button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="font-black text-slate-900 text-sm">{restaurant.currency}{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-10 bg-slate-50/50 border-t border-slate-100 space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-slate-800">{restaurant.currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <span>Tax ({(restaurant.taxRate * 100).toFixed(0)}%)</span>
              <span className="text-slate-800">{restaurant.currency}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-3xl font-black text-slate-900 pt-6 border-t-4 border-double border-slate-200">
              <span className="tracking-tight">Total</span>
              <span>{restaurant.currency}{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setCart([])}
              className="flex-1 py-4 px-4 rounded-2xl bg-white border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95"
            >
              Flush
            </button>
            <button 
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`flex-[2] flex items-center justify-center gap-3 py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all ${
                cart.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/30 active:scale-[0.98]'
              }`}
            >
              <CreditCard size={20} strokeWidth={2.5} /> Pay Now
            </button>
          </div>
        </div>
      </div>

      {/* Modern Receipt Modal */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl no-print animate-fadeIn">
            <div className="bg-white rounded-[48px] w-full max-w-lg overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] animate-popIn">
                <div className="p-12 text-center bg-emerald-50 text-emerald-700 border-b border-emerald-100">
                    <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/20">
                        <CheckCircle2 size={40} strokeWidth={2.5} className="text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-1">Transaction Confirmed</h3>
                    <p className="text-xs font-black opacity-50 uppercase tracking-widest">ID: {lastOrder.id}</p>
                </div>
                
                <div className="p-12">
                    <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-50">
                        <img src={restaurant.logo} alt="" className="w-16 h-16 rounded-3xl object-cover shadow-xl border border-white" />
                        <div>
                            <h4 className="font-black text-xl text-slate-900 leading-none">{restaurant.name}</h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-1">{restaurant.address}</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        {lastOrder.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 font-semibold flex items-center gap-3">
                                    <span className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl text-[11px] font-black text-indigo-600">{item.quantity}x</span>
                                    {item.name}
                                </span>
                                <span className="font-black text-slate-900">{restaurant.currency}{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 p-8 bg-slate-50 rounded-[32px] border border-slate-100 mb-10">
                        <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-slate-900">{restaurant.currency}{lastOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                            <span>Taxes</span>
                            <span className="text-slate-900">{restaurant.currency}{lastOrder.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-2xl font-black text-indigo-600 pt-3 mt-3 border-t border-slate-200">
                            <span>TOTAL</span>
                            <span>{restaurant.currency}{lastOrder.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setShowReceipt(false)}
                            className="py-5 bg-white border-2 border-slate-100 text-slate-500 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Next Customer
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="py-5 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Printer size={18} strokeWidth={2.5} /> Print Bill
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default POSTerminal;