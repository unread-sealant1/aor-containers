import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';
import * as pricingService from '../services/pricingService.js';
import Order from '../models/Order.js';
import Setting from '../models/Setting.js';
import StockHistory from '../models/StockHistory.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getDb } from '../config/db.js';
import { storageService } from '../services/storageService.js';

export const getAnalyticsData = async (req: AuthRequest, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalZAR' }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          date: '$_id',
          orders: '$count',
          revenue: 1,
          _id: 0
        }
      }
    ]);

    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getContainerById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const repriceProducts = async (req: AuthRequest, res: Response) => {
  try {
    const result = await pricingService.repriceAllProducts();
    res.json({ success: true, message: `Repriced ${result.updatedCount} product conditions successfully.` });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req: AuthRequest, res: Response) => {
  try {
    const { id, published } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { published },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const total = await Product.countDocuments();
    const published = await Product.countDocuments({ published: true });
    const available = await Product.countDocuments({ stockQuantity: { $gt: 0 }, published: true });
    const outOfStock = await Product.countDocuments({ stockQuantity: 0, published: true });
    const lowStock = await Product.countDocuments({ stockQuantity: { $gt: 0, $lt: 5 }, published: true });

    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    const recentlyUpdated = await Product.find().sort({ updatedAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          total,
          published,
          available,
          outOfStock,
          lowStock,
        },
        recentProducts,
        recentlyUpdated,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInventoryMetrics = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$specifications.location',
          totalStock: { $sum: '$stockQuantity' }
        }
      },
      {
        $project: {
          location: { $ifNull: ['$_id', 'Unknown'] },
          totalStock: 1,
          _id: 0
        }
      }
    ]);

    const total = stats.reduce((acc, curr) => acc + curr.totalStock, 0);

    res.json({
      success: true,
      data: {
        locationMetrics: stats,
        grandTotal: total
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllContainers = async (req: AuthRequest, res: Response) => {
  try {
    const { category, condition, availability, published, search } = req.query;

    const filter: any = {};

    if (category) filter.category = category;
    if (condition) filter['conditions.condition'] = condition;
    if (availability) filter.availability = availability;
    if (published !== undefined) filter.published = published === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createContainer = async (req: AuthRequest, res: Response) => {
  try {
    const productData = req.body;
    const product = new Product(productData);
    await product.save();

    // Calculate prices for any conditions provided
    if (product.conditions && product.conditions.length > 0) {
      for (const cond of product.conditions) {
        if (cond.ownerCostUSD) {
          await pricingService.updateProductPrice(
            product._id.toString(),
            cond.condition,
            cond.ownerCostUSD,
            {
              ...(cond.markupPercentage !== undefined && { markupPercentage: cond.markupPercentage }),
              ...(cond.isCustomMarkup !== undefined && { isCustomMarkup: cond.isCustomMarkup })
            }
          );
        }
      }
      // Re-fetch to get updated prices
      const updatedProduct = await Product.findById(product._id);
      res.status(201).json({ success: true, data: updatedProduct });
      return;
    }

    res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateContainer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Apply updates to the product instance
    Object.assign(product, updates);

    // Recalculate prices for any conditions that have ownerCostUSD
    if (updates.conditions && Array.isArray(updates.conditions)) {
      const settings = await pricingService.getGlobalPricingSettings();

      product.conditions = updates.conditions.map((cond: any) => {
        if (cond.ownerCostUSD !== undefined) {
          const isCustom = cond.isCustomMarkup ?? false;
          const markupPercentage = isCustom
            ? (cond.markupPercentage ?? settings.defaultMarkupPercentage)
            : settings.defaultMarkupPercentage;

          const exchangeRate = settings.defaultExchangeRate;
          const sellingPriceZAR = pricingService.calculateSellingPrice(
            cond.ownerCostUSD,
            exchangeRate,
            markupPercentage
          );
          const convertedCostZAR = Math.round((cond.ownerCostUSD * exchangeRate) * 100) / 100;

          return {
            ...cond,
            exchangeRateUsed: exchangeRate,
            markupPercentage: markupPercentage as number,
            isCustomMarkup: isCustom,
            convertedCostZAR,
            sellingPriceZAR,
            calculatedAt: new Date(),
          };
        }
        return cond;
      });
    }

    // Use findByIdAndUpdate to bypass version check conflicts for admin updates
    await Product.findByIdAndUpdate(id, product);

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteContainer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Container deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const folder = `container-${productId}`;
    const result = await storageService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      folder
    );

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.images.push({
      url: result.url,
      isPrimary: product.images.length === 0
    });

    await product.save();

    res.json({
      success: true,
      data: {
        url: result.url,
        isPrimary: product.images.length === 1
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const setPrimaryImage = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, imageIndex } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.images.forEach((img, idx) => {
      img.isPrimary = idx === parseInt(imageIndex);
    });

    await product.save();
    res.json({ success: true, message: 'Primary image updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteImage = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, imageIndex } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const image = product.images[imageIndex];
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await storageService.deleteImage(image.url);

    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecentActivity = async (req: AuthRequest, res: Response) => {
  try {
    const activity = await StockHistory.find()
      .sort({ changedAt: -1 })
      .limit(5)
      .populate('productId', 'name');

    const formattedActivity = activity.map(item => ({
      _id: item._id,
      product: (item.productId as any)?.name || 'Unknown Product',
      action: `Quantity changed from ${item.previousQuantity} to ${item.newQuantity}`,
      timestamp: item.changedAt,
      note: item.note
    }));

    res.json({ success: true, data: formattedActivity });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: [
      'Standard Containers',
      'High Cube Containers',
      'Refrigerated Containers',
      'Open Top Containers',
      'Flat Rack Containers',
      'Side Opening Containers',
      'Storage Containers'
    ]
  });
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ success: false, message: 'Categories are now hard-coded in the Product model' });
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ success: false, message: 'Categories are now hard-coded in the Product model' });
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  res.status(501).json({ success: false, message: 'Categories are now hard-coded in the Product model' });
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'Confirmed' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const declineOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'Cancelled' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const allOrders = await Order.find({});
    const customersMap = new Map();

    allOrders.forEach(order => {
      const email = order.customer.email;
      if (!customersMap.has(email)) {
        customersMap.set(email, {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          totalOrders: 0
        });
      }
      customersMap.get(email)!.totalOrders++;
    });

    res.json({ success: true, data: Array.from(customersMap.values()) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await StockHistory.find()
      .sort({ changedAt: -1 })
      .populate('productId', 'name');

    res.json({ success: true, data: logs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const settings = await Setting.find();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: setting });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAdmins = async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const admins = await db.collection('admins').find().toArray();
    const sanitizedAdmins = admins.map(({ password, ...rest }) => rest);
    res.json({ success: true, data: sanitizedAdmins });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const db = getDb();
    const existingAdmin = await db.collection('admins').findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('admins').insertOne({
      email,
      password: hashedPassword,
      role: role || 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json({ success: true, message: 'Admin created successfully', adminId: result.insertedId });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const result = await db.collection('admins').deleteOne({ _id: new mongoose.Types.ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
