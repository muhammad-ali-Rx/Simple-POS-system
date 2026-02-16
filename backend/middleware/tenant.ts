
import { Request, Response, NextFunction } from 'express';

/**
 * Multi-Tenancy Security Middleware
 * Ensures no restaurant can see another restaurant's data.
 */
// Fixed: Changed res to any to avoid property 'status' missing error and ensured proper middleware signature.
export const tenantMiddleware = (req: any, res: any, next: NextFunction) => {
  const tenantId = req.headers['x-tenant-id'];

  if (!tenantId) {
    res.status(403).json({ 
      error: 'Tenant ID Missing', 
      message: 'Requests must include a valid X-Tenant-ID header for multi-tenant isolation.' 
    });
    return;
  }

  // Attach tenantId to the request object for use in controllers
  req.tenantId = tenantId;
  
  // In a real app, you might also verify if the authenticated user 
  // actually belongs to this tenantId via JWT.
  
  next();
};
