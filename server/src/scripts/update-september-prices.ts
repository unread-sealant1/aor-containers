import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Product from '../models/Product.js';
import Setting from '../models/Setting.js';
import PriceHistory from '../models/PriceHistory.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const PRICING_DATA = [
  { loc: 'Cape Town', type: '20ft Standard', grade: 'AS IS', supplierUSD: 1075, sellingPriceZAR: 21425 },
  { loc: 'Cape Town', type: '20ft Standard', grade: 'WWT', supplierUSD: 1200, sellingPriceZAR: 23925 },
  { loc: 'Cape Town', type: '40ft Standard', grade: 'CWO', supplierUSD: 1850, sellingPriceZAR: 36881 },
  { loc: 'Cape Town', type: '40ft High Cube', grade: 'AS IS', supplierUSD: 1450, sellingPriceZAR: 28919 },
  { loc: 'Cape Town', type: '40ft High Cube', grade: 'CWO', supplierUSD: 1900, sellingPriceZAR: 37879, yom: '2013' },
  { loc: 'Cape Town', type: '40ft High Cube', grade: 'CWO', supplierUSD: 1950, sellingPriceZAR: 38876, yom: '2014' },
  { loc: 'Cape Town', type: '40ft High Cube', grade: 'IICL', supplierUSD: 2000, sellingPriceZAR: 39875, yom: '2014' },
  { loc: 'Johannesburg', type: '20ft Standard', grade: 'CWO', supplierUSD: 1450, sellingPriceZAR: 28919 },
  { loc: 'Johannesburg', type: '40ft High Cube', grade: 'CWO', supplierUSD: 2200, sellingPriceZAR: 43863 },
  { loc: 'Durban - Southway', type: '20ft Standard', grade: 'CWO', supplierUSD: 1450, sellingPriceZAR: 28919 },
  { loc: 'Durban - Southway', type: '40ft Standard', grade: 'AS IS', supplierUSD: 1350, sellingPriceZAR: 26924 },
  { loc: 'Durban - Southway', type: '40ft Standard', grade: 'WWT', supplierUSD: 1550, sellingPriceZAR: 30915 },
  { loc: 'Durban - Southway', type: '40ft High Cube', grade: 'AS IS', supplierUSD: 1550, sellingPriceZAR: 30915 },
  { loc: 'Durban - Southway', type: '40ft High Cube', grade: 'WWT', supplierUSD: 1750, sellingPriceZAR: 34885 },
  { loc: 'Durban - Southway', type: '40ft High Cube', grade: 'CWO', supplierUSD: 1850, sellingPriceZAR: 36881 },
  { loc: 'Durban - Southway', type: '40ft High Cube', grade: 'IICL', supplierUSD: 1950, sellingPriceZAR: 38876 },
];

const EXCHANGE_RATE = 15.95;
const MARKUP = 25;

async function updatePrices() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in .env');

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    await Setting.findOneAndUpdate(
      { key: 'storeSettings' },
      {
        $set: {
          'value.defaultExchangeRate': EXCHANGE_RATE,
          'value.defaultMarkupPercentage': MARKUP
        }
      },
      { upsert: true }
    );

    for (const data of PRICING_DATA) {
      const query: any = {
        'specifications.location': { $regex: data.loc, $options: 'i' },
        name: { $regex: `${data.type}.*${data.grade}`, $options: 'i' }
      };

      if (data.yom) {
        query.name = { $regex: `${data.type}.*${data.grade}.*${data.yom}`, $options: 'i' };
      }

      const product = await Product.findOne(query);

      if (!product) {
        console.warn(`Could not find product matching ${data.loc} ${data.type} ${data.grade} ${data.yom || ''}`);
        continue;
      }

      const convertedCostZAR = Math.round((data.supplierUSD * EXCHANGE_RATE) * 100) / 100;

      const conditionData = {
        condition: data.grade,
        ownerCostUSD: data.supplierUSD,
        exchangeRateUsed: EXCHANGE_RATE,
        markupPercentage: MARKUP,
        convertedCostZAR: convertedCostZAR,
        sellingPriceZAR: data.sellingPriceZAR,
        calculatedAt: new Date(),
      };

      product.conditions = [conditionData];
      await product.save();

      await PriceHistory.create({
        productId: product._id,
        condition: data.grade,
        ownerCostUSD: data.supplierUSD,
        exchangeRateUsed: EXCHANGE_RATE,
        markupPercentage: MARKUP,
        convertedCostZAR: convertedCostZAR,
        sellingPriceZAR: data.sellingPriceZAR,
        changedAt: new Date(),
      });

      console.log(`Updated ${product.name} in ${data.loc} to ${data.grade}: R${data.sellingPriceZAR}`);
    }

    console.log('All prices updated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating prices:', error);
    process.exit(1);
  }
}

updatePrices();
