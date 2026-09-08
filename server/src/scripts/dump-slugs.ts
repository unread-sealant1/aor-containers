import mongoose from 'mongoose';
import Product from '../models/Product.js';

async function dumpSlugs() {
  try {
    await mongoose.connect('mongodb://localhost:27017/aor_containers');
    const products = await Product.find({}, { slug: 1, name: 1 });
    console.log('Found products:');
    products.forEach(p => console.log(`${p.slug} | ${p.name}`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
dumpSlugs();
