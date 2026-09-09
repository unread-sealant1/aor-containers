import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import StockHistory from '../models/StockHistory.js';

dotenv.config({ path: path.join(process.cwd(), 'server', '.env') });

async function seedSeptemberStock() {
  try {
    console.log("Connecting to MongoDB for September stock seeding...");
    await connectDB();

    const markupPercentage = 25;
    const stockUpdateSource = "Owner stock availability email";
    const stockUpdateNote = "September 2026 owner stock update. Prices valid until 15 September 2026. Stock subject to availability upon purchase confirmation.";

    const stockData = [
      // Cape Town
      { type: '20ft Standard Container', condition: 'Used', grade: 'AS IS', qty: 1, cost: 1075, loc: 'Cape Town', yom: '' },
      { type: '20ft Standard Container', condition: 'Used', grade: 'WWT', qty: 2, cost: 1200, loc: 'Cape Town', yom: '' },
      { type: '40ft Standard Container', condition: 'Used', grade: 'CWO', qty: 1, cost: 1850, loc: 'Cape Town', yom: '' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'AS IS', qty: 3, cost: 1450, loc: 'Cape Town', yom: '' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'CWO', qty: 24, cost: 1900, loc: 'Cape Town', yom: '2013 and older' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'CWO', qty: 17, cost: 1950, loc: 'Cape Town', yom: '2014' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'IICL', qty: 5, cost: 2000, loc: 'Cape Town', yom: '2014-2015' },

      // Johannesburg
      { type: '20ft Standard Container', condition: 'Used', grade: 'CWO', qty: 1, cost: 1450, loc: 'Johannesburg', yom: '' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'CWO', qty: 26, cost: 2200, loc: 'Johannesburg', yom: '' },

      // Durban - Southway
      { type: '20ft Standard Container', condition: 'Used', grade: 'CWO', qty: 17, cost: 1450, loc: 'Durban - Southway', yom: '' },
      { type: '40ft Standard Container', condition: 'Used', grade: 'AS IS', qty: 1, cost: 1350, loc: 'Durban - Southway', yom: '' },
      { type: '40ft Standard Container', condition: 'Used', grade: 'WWT', qty: 9, cost: 1550, loc: 'Durban - Southway', yom: '' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'AS IS', qty: 5, cost: 1550, loc: 'Durban - Southway', yom: '' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'WWT', qty: 1, cost: 1750, loc: 'Durban - Southway', yom: '' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'CWO', qty: 70, cost: 1850, loc: 'Durban - Southway', yom: '' },
      { type: '40ft High Cube Container', condition: 'Used', grade: 'IICL', qty: 8, cost: 1950, loc: 'Durban - Southway', yom: '' },
    ];

    const categoryMap: Record<string, string> = {
      '20ft Standard Container': 'Standard Containers',
      '40ft Standard Container': 'Standard Containers',
      '40ft High Cube Container': 'High Cube Containers',
    };

    for (const item of stockData) {
      const name = `${item.type} (${item.grade}${item.yom ? ', ' + item.yom : ''})`;
      const slug = `${item.type.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${item.loc.toLowerCase().replace(/\\s+/g, '-')}-${item.grade.toLowerCase().replace(/\\s+/g, '-')}${item.yom ? '-' + item.yom.toLowerCase().replace(/[^a-z0-9-]/g, '-') : ''}`;

      // Check if product already exists
      let product = await Product.findOne({ slug });

      if (product) {
        // Update existing
        product.stockQuantity = item.qty;
        product.availability = 'Available';

        // Update condition pricing
        const conditionIdx = product.conditions.findIndex(c => c.condition === item.condition);
        if (conditionIdx !== -1) {
          const condition = product.conditions[conditionIdx];
          if (condition) {
            condition.ownerCostUSD = item.cost;
            condition.markupPercentage = markupPercentage;
          }
          // Note: sellingPriceZAR remains unset/legacy until exchange rate is provided
        } else {
          product.conditions.push({
            condition: item.condition as any,
            ownerCostUSD: item.cost,
            markupPercentage: markupPercentage,
            sellingPriceZAR: 0 // Pending calculation
          });
        }
        await product.save();
      } else {
        // Create new product
        product = new Product({
          name,
          slug,
          description: `High-quality ${item.type} in ${item.grade} condition, located in ${item.loc}.`,
          category: categoryMap[item.type] || 'Standard Containers',
          images: [], // Images to be added manually
          conditions: [{
            condition: item.condition as any,
            ownerCostUSD: item.cost,
            markupPercentage: markupPercentage,
            sellingPriceZAR: 0 // Pending calculation
          }],
          specifications: {
            location: item.loc,
            yearOfManufacture: item.yom
          },
          applications: [],
          stockQuantity: item.qty,
          availability: 'Available',
          currency: 'ZAR',
          featured: false,
          published: false, // Keep unpublished until pricing is finalized
        });
        await product.save();
      }

      // Create Stock History record
      await StockHistory.create({
        productId: product._id,
        previousQuantity: 0, // Simplification for initial seed
        newQuantity: item.qty,
        previousAvailability: 'Out of Stock',
        newAvailability: 'Available',
        note: stockUpdateNote,
        source: stockUpdateSource,
        changedAt: new Date(),
      });
    }

    console.log("✅ September stock seeding completed successfully!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seedSeptemberStock();
