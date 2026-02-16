
import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: 'https://api.dicebear.com/7.x/initials/svg?seed=RF' },
  address: { type: String, required: true },
  currency: { type: String, default: '$' },
  taxRate: { type: Number, default: 0.1 },
  plan: { type: String, enum: ['BASIC', 'PRO', 'ENTERPRISE'], default: 'BASIC' },
  createdAt: { type: Date, default: Date.now }
});

export const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
