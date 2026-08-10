import express from 'express';
import { getProducts, getProductBySlug, createProduct } from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', createProduct); // In production, this would be protected by admin auth

export default router;
