import express from 'express';
import path from 'path';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app: Application = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "blob:", "http://localhost:5000", "https://via.placeholder.com"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;
