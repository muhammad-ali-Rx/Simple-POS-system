
import { Request, Response } from 'express';
import { User } from '../models/User';
import { Restaurant } from '../models/Restaurant';

// Fix: Use any for req and res to bypass environment-specific Express type errors (e.g., missing body, status, json properties)
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    // Fix: Cast the findOne result to any to allow access to populated fields like restaurantId._id
    const user = await User.findOne({ email, password }).populate('restaurantId') as any;
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId?._id
      },
      restaurant: user.restaurantId
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
