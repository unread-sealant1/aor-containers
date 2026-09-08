import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedData = [
  {
    name: "20ft Standard Container",
    slug: "20ft-standard",
    category: "Standard Containers",
    description: "The industry standard for general cargo and storage. Durable, secure, and widely accepted across all shipping lines.",
    images: [{ url: "https://via.placeholder.com/300", isPrimary: true }],
    specifications: {
      length: "6.06m",
      width: "2.44m",
      height: "2.59m",
      internalLength: "5.90m",
      internalWidth: "2.35m",
      internalHeight: "2.39m",
      capacity: "33.2 m³",
      tareWeight: "2,200kg"
    },
    conditions: [
      { condition: "New", price: 25000 },
      { condition: "Used", price: 15000 }
    ],
    applications: ["General Storage", "Shipping", "Site Offices"],
    featured: true,
    published: true,
    stockQuantity: 12,
    availability: "Available"
  },
  {
    name: "40ft Standard Container",
    slug: "40ft-standard",
    category: "Standard Containers",
    description: "High-volume storage and transit solution. Ideal for bulk goods and large scale inventory.",
    images: [{ url: "https://via.placeholder.com/300", isPrimary: true }],
    specifications: {
      length: "12.19m",
      width: "2.44m",
      height: "2.59m",
      internalLength: "12.03m",
      internalWidth: "2.35m",
      internalHeight: "2.39m",
      capacity: "67.7 m³",
      tareWeight: "3,700kg"
    },
    conditions: [
      { condition: "New", price: 45000 },
      { condition: "Used", price: 28000 }
    ],
    applications: ["Bulk Shipping", "Large Scale Storage"],
    featured: true,
    published: true,
    stockQuantity: 8,
    availability: "Available"
  },
  {
    name: "40ft High Cube",
    slug: "40ft-high-cube",
    category: "High Cube Containers",
    description: "Extra vertical space for oversized cargo. Perfect for voluminous goods that require more headroom.",
    images: [{ url: "https://via.placeholder.com/300", isPrimary: true }],
    specifications: {
      length: "12.19m",
      width: "2.44m",
      height: "2.89m",
      internalLength: "11.5m",
      internalWidth: "2.29m",
      internalHeight: "2.5m",
      capacity: "76.4 m³",
      tareWeight: "3,900kg"
    },
    conditions: [
      { condition: "New", price: 48000 },
      { condition: "Used", price: 30000 }
    ],
    applications: ["Oversized Cargo", "Modular Housing"],
    featured: true,
    published: true,
    stockQuantity: 5,
    availability: "Limited Availability"
  },
  {
    name: "Refrigerated Container",
    slug: "refrigerated",
    category: "Refrigerated Containers",
    description: "Precision temperature control for perishable goods. Maintains strict climate settings for pharmaceutical or food transport.",
    images: [{ url: "https://via.placeholder.com/300", isPrimary: true }],
    specifications: {
      length: "12.19m",
      width: "2.44m",
      height: "2.89m",
      internalLength: "11.5m",
      internalWidth: "2.29m",
      internalHeight: "2.5m",
      capacity: "67.0 m³",
      tareWeight: "4,500kg"
    },
    conditions: [
      { condition: "New", price: 85000 },
      { condition: "Used", price: 50000 }
    ],
    applications: ["Cold Chain Logistics", "Food Storage", "Medical Transport"],
    featured: true,
    published: true,
    stockQuantity: 3,
    availability: "Limited Availability"
  }
];

async function seed() {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await connectDB();

    console.log("Clearing existing containers...");
    await Product.deleteMany({});

    console.log("Inserting seed data...");
    await Product.insertMany(seedData);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
