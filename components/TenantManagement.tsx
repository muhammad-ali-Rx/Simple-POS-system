
import React, { useState, useEffect } from 'react';
import { Store, Plus, X, Building2, MapPin, BadgeDollarSign, Percent, Mail, Lock, Edit3, ShieldAlert } from 'lucide-react';
import { Restaurant } from '../types';
import { api } from '../services/api';

const TenantManagement: React.FC = () => {
  const [tenants, setTenants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    currency: '$',
    taxRate: 0.1,
    plan: 'BASIC',
    adminEmail: '',
    adminPassword: ''
  });

  const fetchTenants = async () => {
    setLoading(true);
    const data = await api.getRestaurants();
    setTenants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleEdit = async (tenant: Restaurant) => {
    const admin = await api.getTenantAdmin(tenant.id);
    setEditingId(tenant.id);
    setFormData({
      name: tenant.name,
      address: tenant.address,
      currency: tenant.currency,
      taxRate: tenant.taxRate,
      plan: tenant.plan,
      adminEmail: admin?.email || '',
      adminPassword: admin?.password || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      address: '',
      currency: '$',
      taxRate: 0.1,
      plan: 'BASIC',
      adminEmail: '',
      adminPassword: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.updateRestaurant(editingId, formData);
    } else {
      await api.registerRestaurant(formData);
    }
    setIsModalOpen(false);
    fetchTenants();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">SaaS Command Center</h1>
          <p className="text-gray-500 font-medium">Manage restaurant instances and administrative access.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} /> Add New Restaurant
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Business Info</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Plan</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tenant ID</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tenants.map(tenant => (
              <tr key={tenant.id} className="hover:bg-indigo-50/20 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img src={tenant.logo} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
                    <p className="font-bold text-gray-800 text-lg tracking-tight">{tenant.name}</p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                    tenant.plan === 'ENTERPRISE' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {tenant.plan}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-gray-500 font-medium">{tenant.address}</td>
                <td className="px-8 py-6 font-mono text-xs text-indigo-500 font-bold">{tenant.id}</td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => handleEdit(tenant)}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    <Edit3 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-popIn">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                {editingId ? 'Modify Tenant Instance' : 'Onboard New Restaurant'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                   <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Instance Parameters</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Business Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Pizza Palace" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Currency Symbol</label>
                  <div className="relative">
                    <BadgeDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800"
                      value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})} />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800"
                      value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <div className="col-span-2 mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                   <p className="text-xs font-black text-orange-600 uppercase tracking-widest">Admin Access Keys</p>
                   {editingId && (
                     <div className="flex items-center gap-1.5 text-orange-500 animate-pulse">
                        <ShieldAlert size={14} />
                        <span className="text-[9px] font-black uppercase tracking-tight">Security Sensitive</span>
                     </div>
                   )}
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Login Email (ID)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="email" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800"
                      placeholder="admin@newpizza.com" value={formData.adminEmail} onChange={e => setFormData({...formData, adminEmail: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Login Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="text" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800"
                      placeholder="Update key" value={formData.adminPassword} onChange={e => setFormData({...formData, adminPassword: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 border border-gray-200 text-gray-500 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all">
                    {editingId ? 'Push Global Updates' : 'Initialize SaaS Tenant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;
