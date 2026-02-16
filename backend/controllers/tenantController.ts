
import { Request, Response } from 'express';
import { Restaurant } from '../models/Restaurant';
import { User } from '../models/User';

// Fix: Use any for req and res to bypass environment-specific Express type errors
export const getAllTenants = async (req: any, res: any) => {
  try {
    const tenants = await Restaurant.find();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

// Fix: Use any for req and res to bypass environment-specific Express type errors
export const createTenant = async (req: any, res: any) => {
  try {
    const { name, address, currency, taxRate, plan, adminEmail, adminPassword } = req.body;
    
    // 1. Create Restaurant
    const restaurant = new Restaurant({
      name, address, currency, taxRate, plan,
      logo: req.file ? `/uploads/${req.file.filename}` : undefined
    });
    await restaurant.save();

    // 2. Create associated Admin User
    const admin = new User({
      name: `${name} Admin`,
      email: adminEmail,
      password: adminPassword,
      role: 'RESTAURANT_ADMIN',
      restaurantId: restaurant._id
    });
    await admin.save();

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: 'Tenant creation failed' });
  }
};

// Fix: Use any for req and res to bypass environment-specific Express type errors
export const updateTenant = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, address, currency, taxRate, plan, adminEmail, adminPassword } = req.body;

    // Update Restaurant
    const updateData: any = { name, address, currency, taxRate, plan };
    if (req.file) updateData.logo = `/uploads/${req.file.filename}`;
    
    const restaurant = await Restaurant.findByIdAndUpdate(id, updateData, { new: true });

    // Update Admin User (Email & Password change support)
    if (adminEmail || adminPassword) {
      const userUpdate: any = {};
      if (adminEmail) userUpdate.email = adminEmail;
      if (adminPassword) userUpdate.password = adminPassword;
      if (name) userUpdate.name = `${name} Admin`;

      await User.findOneAndUpdate(
        { restaurantId: id, role: 'RESTAURANT_ADMIN' },
        userUpdate
      );
    }

    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ error: 'Update failed' });
  }
};
