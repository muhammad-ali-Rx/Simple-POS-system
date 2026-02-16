
import 'dotenv/config'; // Load .env variables first
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/api';
import { connectDB } from './config/db';

const app = express();

// Initialize Database
connectDB();

// Standard Middleware
app.use(cors() as any);
app.use(express.json() as any);
app.use(express.urlencoded({ extended: true }) as any);

// Dynamic Upload Directory Creation
const uploadDir = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files for uploaded images
app.use(`/${process.env.UPLOAD_PATH || 'uploads'}`, express.static(uploadDir) as any);

// API Routes
app.use('/api/v1', apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
    🚀 RestoFlow SaaS Backend (MVC)
    ================================
    Status: Active
    Port: ${PORT}
    Environment: ${process.env.NODE_ENV}
    Multer Storage: ${uploadDir}
    ================================
    `);
});
