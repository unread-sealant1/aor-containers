import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGODB_URI;
async function setupSuperAdmin() {
    if (!uri) {
        console.error('Missing MONGODB_URI in environment variables');
        process.exit(1);
    }
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('aor_containers');
        const email = 'mampeuler@gmail.com';
        const password = 'Amogelang@Rama0504';
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('admins').updateOne({ email }, {
            $set: {
                password: hashedPassword,
                role: 'super_admin',
                updated_at: new Date()
            }
        }, { upsert: true });
        if (result.upsertedCount > 0) {
            console.log(`✅ Super Admin created: ${email}`);
        }
        else {
            console.log(`✅ Super Admin updated: ${email}`);
        }
    }
    catch (error) {
        console.error('❌ Setup failed:', error);
    }
    finally {
        await client.close();
    }
}
setupSuperAdmin();
//# sourceMappingURL=setup-superadmin.js.map