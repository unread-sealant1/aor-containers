import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';
dotenv.config();
const seedData = [
    {
        name: '20ft Standard Container',
        slug: '20ft-standard',
        category: 'Standard',
        description: 'The industry standard for general cargo and storage. Durable, secure, and widely accepted across all shipping lines.',
        images: ['https://images.unsplash.com/photo-1586528116311-6776d796367d?auto=format&fit=crop&q=80&w=800'],
        specifications: {
            externalLength: '6.06m',
            externalWidth: '2.44m',
            externalHeight: '2.59m',
            internalLength: '5.90m',
            internalWidth: '2.35m',
            internalHeight: '2.39m',
            capacity: '33.2 m³',
            tareWeight: '2,200kg'
        },
        conditions: ['New', 'Used'],
        applications: ['General Storage', 'Shipping', 'Site Offices'],
        featured: true,
        active: true
    },
    {
        name: '40ft Standard Container',
        slug: '40ft-standard',
        category: 'Standard',
        description: 'High-volume storage and transit solution. Ideal for bulk goods and large scale inventory.',
        images: ['https://images.unsplash.com/photo-1542332213-9b5a5a76670f?auto=format&fit=crop&q=80&w=800'],
        specifications: {
            externalLength: '12.19m',
            externalWidth: '2.44m',
            externalHeight: '2.59m',
            internalLength: '12.03m',
            internalWidth: '2.35m',
            internalHeight: '2.39m',
            capacity: '67.7 m³',
            tareWeight: '3,700kg'
        },
        conditions: ['New', 'Used'],
        applications: ['Bulk Shipping', 'Large Scale Storage'],
        featured: true,
        active: true
    },
    {
        name: '40ft High Cube',
        slug: '40ft-high-cube',
        category: 'High Cube',
        description: 'Extra vertical space for oversized cargo. Perfect for voluminous goods that require more headroom.',
        images: ['https://images.unsplash.com/photo-1605117725419-25d57767929e?auto=format&fit=crop&q=80&w=800'],
        specifications: {
            externalLength: '12.19m',
            externalWidth: '2.44m',
            externalHeight: '2.89m',
            internalLength: '12.03m',
            internalWidth: '2.35m',
            internalHeight: '2.69m',
            capacity: '76.4 m³',
            tareWeight: '3,900kg'
        },
        conditions: ['New', 'Used'],
        applications: ['Oversized Cargo', 'Modular Housing'],
        featured: true,
        active: true
    },
    {
        name: 'Refrigerated Container',
        slug: 'refrigerated',
        category: 'Specialized',
        description: 'Precision temperature control for perishable goods. Maintains strict climate settings for pharmaceutical or food transport.',
        images: ['https://images.unsplash.com/photo-1590274853876?auto=format&fit=crop&q=80&w=800'],
        specifications: {
            externalLength: '12.19m',
            externalWidth: '2.44m',
            externalHeight: '2.89m',
            internalLength: '11.5m',
            internalWidth: '2.29m',
            internalHeight: '2.5m',
            capacity: '67.0 m³',
            tareWeight: '4,500kg'
        },
        conditions: ['New', 'Used'],
        applications: ['Cold Chain Logistics', 'Food Storage', 'Medical Transport'],
        featured: true,
        active: true
    }
];
async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');
        await Product.deleteMany({});
        await Product.insertMany(seedData);
        console.log('? Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('? Seeding error:', error);
        process.exit(1);
    }
}
seed();
