import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

async function seedAuth() {
  if (!uri) {
    console.error('Missing MONGODB_URI');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('aor_containers');

    const adminEmail = 'admin@aor.co.za';
    const adminPassword = 'AdminPassword123!';

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await db.collection('admins').updateOne(
      { email: adminEmail },
      {
        $set: {
          password: hashedPassword,
          role: 'super_admin',
          updated_at: new Date()
        }
      },
      { upsert: true }
    );

    console.log(`✅ Default admin created: ${adminEmail} / ${adminPassword}`);
  } catch (error) {
    console.error('❌ Seeding auth failed:', error);
  } finally {
    await client.close();
  }
}

seedAuth();
