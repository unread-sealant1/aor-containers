import { supabase } from './config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const seedData = [
  {
    name: "20ft Standard Container",
    slug: "20ft-standard",
    category: "Standard",
    description: "The industry standard for general cargo and storage. Durable, secure, and widely accepted across all shipping lines.",
    images: ["/20ft Standard Container.png"],
    specifications: {
      externalLength: "6.06m",
      externalWidth: "2.44m",
      externalHeight: "2.59m",
      internalLength: "5.90m",
      internalWidth: "2.35m",
      internalHeight: "2.39m",
      capacity: "33.2 m³",
      tareWeight: "2,200kg"
    },
    conditions: ["New", "Used"],
    applications: ["General Storage", "Shipping", "Site Offices"],
    featured: true,
    active: true
  },
  {
    name: "40ft Standard Container",
    slug: "40ft-standard",
    category: "Standard",
    description: "High-volume storage and transit solution. Ideal for bulk goods and large scale inventory.",
    images: ["/40ft Standard Container.png"],
    specifications: {
      externalLength: "12.19m",
      externalWidth: "2.44m",
      externalHeight: "2.59m",
      internalLength: "12.03m",
      internalWidth: "2.35m",
      internalHeight: "2.39m",
      capacity: "67.7 m³",
      tareWeight: "3,700kg"
    },
    conditions: ["New", "Used"],
    applications: ["Bulk Shipping", "Large Scale Storage"],
    featured: true,
    active: true
  },
  {
    name: "40ft High Cube",
    slug: "40ft-high-cube",
    category: "High Cube",
    description: "Extra vertical space for oversized cargo. Perfect for voluminous goods that require more headroom.",
    images: ["/40ft High Cube.png"],
    specifications: {
      externalLength: "12.19m",
      externalWidth: "2.44m",
      externalHeight: "2.89m",
      internalLength: "12.03m",
      internalWidth: "2.35m",
      internalHeight: "2.69m",
      capacity: "76.4 m³",
      tareWeight: "3,900kg"
    },
    conditions: ["New", "Used"],
    applications: ["Oversized Cargo", "Modular Housing"],
    featured: true,
    active: true
  },
  {
    name: "Refrigerated Container",
    slug: "refrigerated",
    category: "Specialized",
    description: "Precision temperature control for perishable goods. Maintains strict climate settings for pharmaceutical or food transport.",
    images: ["/Refrigerated Container 20ft.png"],
    specifications: {
      externalLength: "12.19m",
      externalWidth: "2.44m",
      externalHeight: "2.89m",
      internalLength: "11.5m",
      internalWidth: "2.29m",
      internalHeight: "2.5m",
      capacity: "67.0 m³",
      tareWeight: "4,500kg"
    },
    conditions: ["New", "Used"],
    applications: ["Cold Chain Logistics", "Food Storage", "Medical Transport"],
    featured: true,
    active: true
  },
  {
    name: "Open Top Container",
    slug: "open-top",
    category: "Specialized",
    description: "Designed for oversized cargo that must be loaded from above. Ideal for heavy machinery and high-profile goods.",
    images: ["/Open Top Container.png"],
    specifications: {
      externalLength: "6.06m",
      externalWidth: "2.44m",
      externalHeight: "2.59m",
      capacity: "33.2 m³",
      tareWeight: "2,300kg"
    },
    conditions: ["New", "Used"],
    applications: ["Industrial Machinery", "Heavy Equipment"],
    featured: false,
    active: true
  },
  {
    name: "Flat Rack Container",
    slug: "flat-rack",
    category: "Specialized",
    description: "Ideal for heavy machinery and exceptionally wide loads. Provides maximum access for oversized cargo.",
    images: ["/Flat-Rack.png"],
    specifications: {
      externalLength: "12.19m",
      externalWidth: "2.44m",
      externalHeight: "2.59m",
      capacity: "N/A",
      tareWeight: "4,000kg"
    },
    conditions: ["New", "Used"],
    applications: ["Heavy Machinery", "Project Cargo"],
    featured: false,
    active: true
  }
];

async function seed() {
  try {
    console.log("Seeding Supabase database with local public assets...");

    // Clear existing products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) throw deleteError;

    // Insert seed data
    const { error: insertError } = await supabase
      .from('products')
      .insert(seedData);

    if (insertError) throw insertError;

    console.log("✅ Database seeded successfully with local assets!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
