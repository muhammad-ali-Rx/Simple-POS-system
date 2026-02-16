
import 'dotenv/config';
import { connectDB } from '../config/db';
import { seedData } from '../config/seed';
import mongoose from 'mongoose';

/**
 * Manual Seed Runner
 * Connects to DB, runs the seed logic, and exits.
 */
const run = async () => {
  try {
    console.log('🛠️  Starting Manual Seed Process...');
    await connectDB();
    await seedData();
    
    console.log('✅ Seeding sequence finished.');
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Manual Seed Failed:', error.message);
    process.exit(1);
  }
};

run();
