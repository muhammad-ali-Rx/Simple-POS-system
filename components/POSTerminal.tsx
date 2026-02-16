
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Printer, Plus, Minus, CreditCard, X, CheckCircle2, Tag, LayoutGrid, List, ChevronRight, ArrowLeft } from 'lucide-react';
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
  const [showCartOnMobile, setShowCartOnMobile] = useState(false);

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
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + tax + serviceCharge;

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
    setShowCartOnMobile(false);
  };

  return (
    <div className="flex h-full lg:h-[calc(100vh-140px)] gap-6 lg:gap-10 animate-slideUp overflow-hidden relative">
      
      {/* Menu Navigation & Grid */}
      <div className={`flex-1 flex flex-col space-y-6 lg:space-y-8 overflow-hidden transition-opacity ${showCartOnMobile ? 'opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto' : 'opacity-100'}`}>
        <div className="space-y-4 lg:space-y-6 no-print">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-4xl font-black text-slate-950 dark:text-white tracking-tight">Market <span className="text-indigo-600">Menu</span></h1>
                    <p className="text-slate-500 text-sm font-medium">Terminal A-1 Ordering Session</p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-indigo-600 shadow-sm"><LayoutGrid size={18} /></button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Search size={18} />
                    </div>
                    <input 
                    type="text" 
                    placeholder="Search dishes..." 
                    className="w-full pl-12 pr-6 py-3.5 lg:py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-900 dark:text-white transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-hide no-print">
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                        selectedCategory === null ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button 
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                            selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                        >
                        {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Item Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8 pr-2 scrollbar-thin pb-24 lg:pb-12">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => item.available && addToCart(item)}
              className={`bg-white dark:bg-slate-900 p-3 lg:p-5 rounded-[28px] lg:rounded-[40px] border border-slate-100 dark:border-slate-800 transition-all duration-300 cursor-pointer active:scale-95 group ${!item.available ? 'opacity-50' : 'hover:shadow-xl'}`}
            >
              <div className="aspect-square w-full rounded-[20px] lg:rounded-[32px] overflow-hidden mb-4 bg-slate-50 dark:bg-slate-800">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="px-2">
                <h4 className="font-black text-slate-950 dark:text-white text-sm lg:text-base leading-tight truncate mb-1">{item.name}</h4>
                <div className="flex justify-between items-center mt-3">
                    <p className="text-base lg:text-xl font-black text-slate-950 dark:text-white tracking-tighter">
                        <span className="text-indigo-600 text-[10px] lg:text-xs align-top mr-0.5">{restaurant.currency}</span>
                        {item.price.toFixed(2)}
                    </p>
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Plus size={16} />
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer (Responsive Toggle) */}
      <div className={`fixed inset-0 lg:relative lg:inset-auto z-50 lg:z-0 w-full lg:w-[420px] bg-[#0f172a] lg:rounded-[48px] flex flex-col overflow-hidden border border-white/5 no-print transition-transform duration-500 ${showCartOnMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        
        <div className="p-8 lg:p-10 text-white flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowCartOnMobile(false)} className="lg:hidden p-2 bg-white/5 rounded-xl text-white">
                <ArrowLeft size={20} />
            </button>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                <ShoppingCart size={24} />
            </div>
            <div>
                <h3 className="font-black text-xl tracking-tight">Checkout</h3>
                <p className="text-[8px] text-indigo-400 uppercase tracking-widest font-black">Ready for Session</p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{cart.length} Unit</div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-6 lg:space-y-8 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-30">
              <ShoppingCart size={48} className="mb-4" strokeWidth={1.5} />
              <p className="font-black text-xs uppercase tracking-widest">Cart is Empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h5 className="font-black text-white truncate text-sm mb-1">{item.name}</h5>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{restaurant.currency}{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1.5">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-rose-600 rounded-lg text-white transition-all"><Minus size={14} /></button>
                  <span className="text-sm font-black w-4 text-center text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-indigo-600 rounded-lg text-white transition-all"><Plus size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 lg:p-10 bg-white/[0.02] border-t border-white/5 space-y-6 lg:space-y-8 backdrop-blur-3xl">
          <div className="space-y-2 lg:space-y-3">
            <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase">
              <span>Subtotal</span>
              <span className="text-slate-300">{restaurant.currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-[10px] font-black uppercase">
              <span>Taxes</span>
              <span className="text-slate-300">{restaurant.currency}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-3xl lg:text-4xl font-black text-white pt-4 border-t border-white/10">
              <span className="tracking-tighter">Total</span>
              <span className="text-indigo-400">{restaurant.currency}{total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className={`w-full flex items-center justify-center gap-4 py-5 lg:py-6 rounded-[24px] lg:rounded-[32px] font-black text-xs lg:text-sm uppercase tracking-widest shadow-2xl transition-all ${
              cart.length === 0 ? 'bg-slate-800 text-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            Process Order <CheckCircle2 size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Floating Cart Trigger */}
      {!showCartOnMobile && cart.length > 0 && (
        <button 
            onClick={() => setShowCartOnMobile(true)}
            className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-indigo-600 text-white px-8 py-4 rounded-full shadow-2xl z-40 animate-slideUp font-black text-sm uppercase tracking-widest border-2 border-indigo-400/30"
        >
            <ShoppingCart size={20} />
            Review Cart • {cart.length}
        </button>
      )}

      {/* Confirmation Modal */}
      {showReceipt && lastOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 bg-slate-900/90 backdrop-blur-3xl no-print">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] lg:rounded-[56px] w-full max-w-xl overflow-hidden shadow-2xl animate-popIn">
                <div className="p-10 lg:p-12 text-center bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border-b border-emerald-100 dark:border-emerald-900/50">
                    <CheckCircle2 size={48} className="mx-auto mb-4" />
                    <h3 className="text-3xl font-black uppercase tracking-tight italic">Success!</h3>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-2">Order ID: {lastOrder.id}</p>
                </div>
                
                <div className="p-10 lg:p-12">
                    <div className="p-6 lg:p-8 bg-slate-50 dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 mb-10 space-y-3">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-slate-900 dark:text-white">{restaurant.currency}{lastOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-2xl lg:text-3xl font-black text-indigo-600 dark:text-indigo-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <span>Total</span>
                            <span>{restaurant.currency}{lastOrder.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button onClick={() => window.print()} className="py-5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3">
                            <Printer size={18} /> Print Invoice
                        </button>
                        <button onClick={() => setShowReceipt(false)} className="py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200">
                            Back to Terminal
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
