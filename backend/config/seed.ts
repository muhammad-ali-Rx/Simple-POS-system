
import { User } from '../models/User';
import { Restaurant } from '../models/Restaurant';

/**
 * Automatically seeds initial data if the database is empty.
 */
export const seedData = async () => {
  try {
    // 1. Check if a Super Admin already exists
    const adminExists = await User.findOne({ role: 'SUPER_ADMIN' });
    
    if (adminExists) {
      console.log('ℹ️  System check: Super Admin already exists. Skipping seed.');
      return;
    }

    console.log('🌱 No Super Admin found. Starting initial system seeding...');

    // 2. Create a default System Restaurant for the Super Admin
    const systemRestaurant = new Restaurant({
      name: 'RestoFlow Cloud HQ',
      address: 'Global SaaS Infrastructure',
      currency: '$',
      taxRate: 0,
      plan: 'ENTERPRISE',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=system'
    });
    await systemRestaurant.save();

    // 3. Create the Master Super Admin account
    const superAdmin = new User({
      name: 'System Root',
      email: process.env.SEED_ADMIN_EMAIL || 'superadmin@gmail.com',
      password: process.env.SEED_ADMIN_PASSWORD || 'password123',
      role: 'SUPER_ADMIN',
      restaurantId: systemRestaurant._id
    });
    await superAdmin.save();

    console.log(`
    ✅ Seeding Complete!
    =========================================
    Default Login Created:
    Email: ${superAdmin.email}
    Pass:  ${process.env.SEED_ADMIN_PASSWORD || 'password123'}
    Role:  SUPER_ADMIN
    =========================================
    `);

  } catch (error: any) {
    console.error('❌ Seeding Error:', error.message);
  }
};
