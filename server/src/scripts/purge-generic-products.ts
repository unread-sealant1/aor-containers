import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

async function purgeGenericProducts() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Find products that don't have a location specified in specifications
    // Generic products typically have specifications.location as undefined or missing
    const genericProducts = await Product.find({
      'specifications.location': { $exists: false }
    });

    console.log(`Found ${genericProducts.length} generic products to purge.`);

    for (const product of genericProducts) {
      await Product.deleteOne({ _id: product._id });
      console.log(`Purged generic product: ${product.name} (${product.slug})`);
    }

    console.log('Generic product purge completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error purging generic products:', error);
    process.exit(1);
  }
}

purgeGenericProducts();
