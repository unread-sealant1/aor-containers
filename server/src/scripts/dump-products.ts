import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function dumpProducts() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found');
    await mongoose.connect(uri);
    const products = await Product.find({}, { slug: 1, name: 1, 'specifications.location': 1 });
    console.log('All products in DB:');
    products.forEach(p => {
      console.log(`Slug: ${p.slug} | Name: ${p.name} | Loc: ${p.specifications?.location}`);
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
dumpProducts();
