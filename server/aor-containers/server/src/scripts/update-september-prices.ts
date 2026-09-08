import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Setting from '../models/Setting.js';
import PriceHistory from '../models/PriceHistory.js';

const PRICING_DATA = [
  { loc: 'Cape Town', type: '20ft Standard Container', grade: 'AS IS', supplierUSD: 1075, sellingPriceZAR: 21425 },
  { loc: 'Cape Town', type: '20ft Standard Container', grade: 'WWT', supplierUSD: 1200, sellingPriceZAR: 23925 },
  { loc: 'Cape Town', type: '40ft Standard Container', grade: 'CWO', supplierUSD: 1850, sellingPriceZAR: 36881 },
  { loc: 'Cape Town', type: '40ft High Cube Container', grade: 'AS IS', supplierUSD: 1450, sellingPriceZAR: 28919 },
  { loc: 'Cape Town', type: '40ft High Cube Container', grade: 'CWO', supplierUSD: 1900, sellingPriceZAR: 37879, yom: '2013 and older' },
  { loc: 'Cape Town', type: '40ft High Cube Container', grade: 'CWO', supplierUSD: 1950, sellingPriceZAR: 38876, yom: '2014' },
  { loc: 'Cape Town', type: '40ft High Cube Container', grade: 'IICL', supplierUSD: 2000, sellingPriceZAR: 39875, yom: '2014-2015' },
  { loc: 'Johannesburg', type: '20ft Standard Container', grade: 'CWO', supplierUSD: 1450, sellingPriceZAR: 28919 },
  { loc: 'Johannesburg', type: '40ft High Cube Container', grade: 'CWO', supplierUSD: 2200, sellingPriceZAR: 43863 },
  { loc: 'Durban - Southway', type: '20ft Standard Container', grade: 'CWO', supplierUSD: 1450, sellingPriceZAR: 28919 },
  { loc: 'Durban - Southway', type: '40ft Standard Container', grade: 'AS IS', supplierUSD: 1350, sellingPriceZAR: 26924 },
  { loc: 'Durban - Southway', type: '40ft Standard Container', grade: 'WWT', supplierUSD: 1550, sellingPriceZAR: 30915 },
  { loc: 'Durban - Southway', type: '40ft High Cube Container', grade: 'AS IS', supplierUSD: 1550, sellingPriceZAR: 30915 },
  { loc: 'Durban - Southway', type: '40ft High Cube Container', grade: 'WWT', supplierUSD: 1750, sellingPriceZAR: 34885 },
  { loc: 'Durban - Southway', type: '40ft High Cube Container', grade: 'CWO', supplierUSD: 1850, sellingPriceZAR: 36881 },
  { loc: 'Durban - Southway', type: '40ft High Cube Container', grade: 'IICL', supplierUSD: 1950, sellingPriceZAR: 38876 },
];

const EXCHANGE_RATE = 15.95;
const MARKUP = 25;

async function updatePrices() {
  try {
    await mongoose.connect('mongodb://localhost:27017/aor_containers');
    console.log('Connected to MongoDB');

    // Update Global Settings
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
      // Reconstruct slug exactly as seed-september-stock.ts did
      const typeSlug = data.type.toLowerCase().replace(/\\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const locSlug = data.loc.toLowerCase().replace(/\\s+/g, '-');
      const gradeSlug = data.grade.toLowerCase().replace(/\\s+/g, '-');
      const yomSlug = data.yom ? '-' + data.yom.toLowerCase().replace(/[^a-z0-9-]/g, '-') : '';
      const slug = `${typeSlug}-${locSlug}-${gradeSlug}${yomSlug}`;

      const product = await Product.findOne({ slug });

      if (!product) {
        console.warn(`Could not find product with slug: ${slug}`);
        continue;
      }

      const convertedCostZAR = Math.round((data.supplierUSD * EXCHANGE_RATE) * 100) / 100;

      // Replace the default 'Used' condition with the actual grade
      const conditionData = {
        condition: data.grade,
        ownerCostUSD: data.supplierUSD,
        exchangeRateUsed: EXCHANGE_RATE,
        markupPercentage: MARKUP,
        convertedCostZAR: convertedCostZAR,
        sellingPriceZAR: data.sellingPriceZAR,
        calculatedAt: new Date(),
      };

      // In seed script, they always put one condition 'Used'.
      // We replace it with the actual grade.
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

      console.log(`Updated ${product.name} to ${data.grade}: R${data.sellingPriceZAR}`);
    }

    console.log('All prices updated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating prices:', error);
    process.exit(1);
  }
}

updatePrices();
