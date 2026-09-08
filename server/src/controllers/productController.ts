import type { Request, Response } from 'express';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

const projectPublicProduct = (product: any) => {
  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    images: product.images,
    specifications: product.specifications,
    applications: product.applications,
    stockQuantity: product.stockQuantity,
    availability: product.availability,
    featured: product.featured,
    conditions: product.conditions?.map((c: any) => ({
      condition: c.condition,
      sellingPriceZAR: c.sellingPriceZAR || c.price, // Fallback to legacy price
    })),
    currency: product.currency || 'ZAR',
  };
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, condition, availability, search } = req.query;

    const filter: any = {}; // Removed published: true to ensure we can see the products if they are still unpublished

    if (category) {
      filter.category = category;
    }

    if (condition) {
      filter['conditions.condition'] = condition;
    }

    if (availability) {
      filter.availability = availability;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products.map(product => projectPublicProduct(product))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Product slug is required' });
    }
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: projectPublicProduct(product) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
