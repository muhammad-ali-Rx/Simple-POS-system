
import mongoose from 'mongoose';

/**
 * Connects to MongoDB using the URI provided in environment variables.
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`
    🍀 MongoDB Connected
    ================================
    Host: ${conn.connection.host}
    Database: ${conn.connection.name}
    ================================
    `);
  } catch (error: any) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
