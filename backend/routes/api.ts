
import express from 'express';
import * as authController from '../controllers/authController';
import * as tenantController from '../controllers/tenantController';
import { tenantMiddleware } from '../middleware/tenant';
import { upload } from '../middleware/upload';

const router = express.Router();

// Public Routes
router.post('/auth/login', authController.login as any);

// SaaS Admin Routes (Tenant Management)
router.get('/tenants', tenantController.getAllTenants as any);
// Fixed: Cast multer middleware to any to resolve Type incompatibility in routing overloads
router.post('/tenants', upload.single('logo') as any, tenantController.createTenant as any);
// Fixed: Cast multer middleware to any to resolve Type incompatibility in routing overloads
router.put('/tenants/:id', upload.single('logo') as any, tenantController.updateTenant as any);

// Protected Tenant Routes (POS, Inventory, etc.)
// These would be expanded similarly into controllers
// router.get('/items', tenantMiddleware, itemController.getItems);
// router.post('/orders', tenantMiddleware, orderController.createOrder);

export default router;
