import { Pool } from 'pg';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const PG_URI = process.env.DATABASE_URL || 'postgresql://aor_containers_user:FUjKB7l8cJwhaai9kLAXtwE9mVoufRta@dpg-da5d8e3ncjis738ijfl0-a.oregon-postgres.render.com/aor_containers';
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://cassidymahlatse_db_user:3jLsaTgL51dOiVSg@aor.tdxjylt.mongodb.net/aor_containers';

async function migrate() {
  const pgPool = new Pool({
    connectionString: PG_URI,
    ssl: { rejectUnauthorized: false }
  });
  const mongoClient = new MongoClient(MONGO_URI);

  try {
    console.log('🚀 Starting migration from Render DB to MongoDB...');
    await mongoClient.connect();
    const db = mongoClient.db();
    console.log('✅ Connected to MongoDB');

    // 1. Categories
    console.log('📦 Migrating Categories...');
    let categories;
    try {
      categories = await pgPool.query('SELECT * FROM container_categories');
    } catch (err) {
      console.error('   - Could not find categories table. Skipping...');
      categories = { rows: [] };
    }
    if (categories.rows.length > 0) {
      await db.collection('categories').insertMany(categories.rows);
      console.log(`   - Migrated ${categories.rows.length} categories`);
    }

    // 2. Containers
    console.log('🚢 Migrating Containers...');
    let containers;
    try {
      containers = await pgPool.query('SELECT * FROM products');
    } catch (err) {
      console.error('   - Could not find products table. Skipping...');
      containers = { rows: [] };
    }
    if (containers.rows.length > 0) {
      await db.collection('containers').insertMany(containers.rows);
      console.log(`   - Migrated ${containers.rows.length} containers`);
    }

    // 3. Customers
    console.log('👥 Migrating Customers...');
    let customers;
    try {
      customers = await pgPool.query('SELECT * FROM customers');
    } catch (err) {
      console.error('   - Could not find customers table. Skipping...');
      customers = { rows: [] };
    }
    if (customers.rows.length > 0) {
      await db.collection('customers').insertMany(customers.rows);
      console.log(`   - Migrated ${customers.rows.length} customers`);
    }

    // 4. Orders (Complex Migration)
    console.log('🛒 Migrating Orders...');
    let orders;
    try {
      orders = await pgPool.query('SELECT * FROM orders');
    } catch (err) {
      console.error('   - Could not find orders table. Skipping...');
      orders = { rows: [] };
    }
    for (const order of orders.rows) {
      // Fetch items for this order
      const items = await pgPool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      // Fetch history for this order
      const history = await pgPool.query('SELECT * FROM order_status_history WHERE order_id = $1', [order.id]);

      await db.collection('orders').insertOne({
        ...order,
        items: items.rows,
        history: history.rows
      });
    }
    console.log(`   - Migrated ${orders.rows.length} orders with items and history`);

    // 5. Admins
    console.log('🔑 Migrating Admins...');
    let admins;
    try {
      admins = await pgPool.query('SELECT * FROM admins');
    } catch (err) {
      console.error('   - Could not find admins table. Skipping...');
      admins = { rows: [] };
    }
    if (admins.rows.length > 0) {
      await db.collection('admins').insertMany(admins.rows);
      console.log(`   - Migrated ${admins.rows.length} admins`);
    }

    // 6. Audit Logs
    console.log('📜 Migrating Audit Logs...');
    let logs;
    try {
      logs = await pgPool.query('SELECT * FROM audit_logs');
    } catch (err) {
      console.error('   - Could not find audit_logs table. Skipping...');
      logs = { rows: [] };
    }
    if (logs.rows.length > 0) {
      await db.collection('audit_logs').insertMany(logs.rows);
      console.log(`   - Migrated ${logs.rows.length} audit logs`);
    }

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pgPool.end();
    await mongoClient.close();
  }
}

migrate();
