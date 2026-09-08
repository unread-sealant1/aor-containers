import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

async function seedDatabase() {
  if (!uri) {
    console.error('Missing MONGODB_URI in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    const db = client.db();

    // 1. Seed Categories
    console.log('📦 Seeding Categories...');
    const categories = [
      { name: 'Standard', created_at: new Date() },
      { name: 'High Cube', created_at: new Date() },
      { name: 'Refrigerated', created_at: new Date() },
      { name: 'Open Top', created_at: new Date() },
      { name: 'Flat Rack', created_at: new Date() },
    ];
    await db.collection('categories').insertMany(categories);
    console.log(`   - Created ${categories.length} categories`);

    // 2. Seed Containers (Products)
    console.log('🚢 Seeding Containers...');
    const containers = [
      {
        name: '20ft Standard Container',
        slug: '20ft-standard',
        categoryId: categories[0].id || 'cat1', // Simplified for seeding
        description: 'Standard shipping container, ideal for general cargo.',
        sku: 'AOR-20STD',
        price: 15000,
        sale_price: 14000,
        pricing_type: 'fixed',
        stock_quantity: 10,
        availability: 'in_stock',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '40ft Standard Container',
        slug: '40ft-standard',
        categoryId: categories[0].id || 'cat1',
        description: 'Large standard container for maximum volume.',
        sku: 'AOR-40STD',
        price: 25000,
        sale_price: 23000,
        pricing_type: 'fixed',
        stock_quantity: 5,
        availability: 'low_stock',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '40ft High Cube',
        slug: '40ft-high-cube',
        categoryId: categories[1].id || 'cat2',
        description: 'Extra height for oversized cargo.',
        sku: 'AOR-40HC',
        price: 28000,
        sale_price: 26000,
        pricing_type: 'fixed',
        stock_quantity: 3,
        availability: 'low_stock',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];
    await db.collection('containers').insertMany(containers);
    console.log(`   - Created ${containers.length} containers`);

    // 3. Seed Admins (You will need to add your actual Supabase user ID here later)
    console.log('🔑 Seeding Admins...');
    // Note: In a real scenario, the ID must match the Supabase auth.users.id
    await db.collection('admins').insertOne({
      id: 'admin-placeholder-id',
      role: 'super_admin',
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('   - Created placeholder super_admin');

    console.log('✨ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();
