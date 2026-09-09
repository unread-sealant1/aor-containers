import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';
import { storageService } from '../services/storageService.js';

export const getAllMedia = async (req: AuthRequest, res: Response) => {
  try {
    const products = await Product.find({}, 'name images');
    const allImages: any[] = [];

    products.forEach(product => {
      product.images.forEach((img, index) => {
        allImages.push({
          _id: `${product._id}_${index}`,
          url: img.url,
          productId: product._id,
          productName: product.name,
          isPrimary: img.isPrimary
        });
      });
    });

    res.json({ success: true, data: allImages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMedia = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Image ID is required' });
    }

    // The ID is formatted as 'productId_index'
    const [productId, indexStr] = id.split('_');
    if (indexStr === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid image ID format' });
    }
    const index = parseInt(indexStr);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const image = product.images[index];
    if (!image || !image.url) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // 1. Remove from physical storage
    await storageService.deleteImage(image.url);

    // 2. Remove reference from product
    product.images.splice(index, 1);
    await product.save();

    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
