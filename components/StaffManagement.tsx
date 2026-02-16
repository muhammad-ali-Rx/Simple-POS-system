
import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Shield, Trash2, Search, MoreVertical } from 'lucide-react';
import { User, Restaurant } from '../types';
import { api } from '../services/api';

interface StaffProps {
  restaurant: Restaurant;
}

const StaffManagement: React.FC<StaffProps> = ({ restaurant }) => {
  const [staff, setStaff] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers(restaurant.id).then(data => {
      setStaff(data);
      setLoading(false);
    });
  }, [restaurant]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-500">Manage access and roles for {restaurant.name}.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
          <UserPlus size={20} /> Invite Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : staff.map(member => (
          <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                {member.name.charAt(0)}
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <h3 className="font-bold text-gray-800 text-lg">{member.name}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <Mail size={14} /> {member.email}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                member.role === 'RESTAURANT_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {member.role.replace('_', ' ')}
              </span>
              <button className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffManagement;
