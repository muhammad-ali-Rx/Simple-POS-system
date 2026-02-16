
import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { User, Restaurant } from '../types';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User, restaurant: Restaurant) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // Syncing with your MongoDB Atlas data
  const [email, setEmail] = useState('superadmin@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await api.login(email, password);
      
      if (result) {
        const restaurantContext = result.restaurant || {
          id: 'system',
          name: 'RestoFlow SaaS',
          logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=system',
          address: 'Cloud HQ',
          currency: '$',
          taxRate: 0,
          plan: 'ENTERPRISE'
        } as Restaurant;
        
        onLogin(result.user, restaurantContext);
      } else {
        setError('Verification Failed: Access Denied');
      }
    } catch (err) {
      setError('System Error: Check Backend Connection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[160px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[160px] animate-pulse"></div>

      <div className="w-full max-w-xl p-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[32px] shadow-2xl mb-8 animate-popIn">
            <span className="text-4xl font-black text-indigo-600">R</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">RestoFlow <span className="text-indigo-500">SaaS</span></h1>
          <p className="text-slate-400 font-bold tracking-[0.3em] text-[10px] uppercase">Decentralized Management Gateway</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-12 rounded-[48px] shadow-2xl animate-slideUp">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2 group-focus-within:text-indigo-400">Credential Email</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-xl border border-white/5">
                    <Mail className="text-slate-400 group-focus-within:text-indigo-400" size={18} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 text-white pl-16 pr-6 py-5 rounded-[24px] focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-lg"
                    placeholder="superadmin@gmail.com"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-2 group-focus-within:text-indigo-400">Access Keycode</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-xl border border-white/5">
                    <Lock className="text-slate-400 group-focus-within:text-indigo-400" size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 text-white pl-16 pr-6 py-5 rounded-[24px] focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-lg"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Initialize Session <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-10 flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure Node
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase">
                <Globe size={14} className="text-indigo-500" /> Global Instance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
  