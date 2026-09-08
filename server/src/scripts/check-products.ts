import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function checkProducts() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found');
    await mongoose.connect(uri);
    const count = await Product.countDocuments();
    console.log('Total products in DB:', count);
    const products = await Product.find({}).limit(5);
    products.forEach(p => console.log(`Slug: ${p.slug} | Name: ${p.name}`));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
checkProducts();
