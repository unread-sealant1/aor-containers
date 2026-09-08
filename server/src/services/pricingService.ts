import Product from '../models/Product.js';
import Setting from '../models/Setting.js';
import PriceHistory from '../models/PriceHistory.js';

export const calculateSellingPrice = (ownerCostUSD: number, exchangeRate: number, markupPercentage: number): number => {
  const convertedCostZAR = ownerCostUSD * exchangeRate;
  const sellingPriceZAR = convertedCostZAR * (1 + markupPercentage / 100);
  return Math.round(sellingPriceZAR * 100) / 100;
};

export const getGlobalPricingSettings = async () => {
  const settingsDoc = await Setting.findOne({ key: 'storeSettings' });
  const defaults = {
    defaultExchangeRate: 18.0,
    defaultMarkupPercentage: 25,
  };

  return {
    ...(defaults),
    ...(settingsDoc?.value || {}),
  };
};

export const updateProductPrice = async (
  productId: string,
  condition: string,
  ownerCostUSD: number,
  overrideSettings?: {
    exchangeRate?: number,
    markupPercentage?: number,
    isCustomMarkup?: boolean
  }
) => {
  const settings = await getGlobalPricingSettings();
  const exchangeRate = overrideSettings?.exchangeRate ?? settings.defaultExchangeRate;

  // PRIORITY: Use custom markup if flag is set, otherwise fallback to global default
  const isCustom = overrideSettings?.isCustomMarkup ?? false;
  const markupPercentage = isCustom
    ? (overrideSettings?.markupPercentage ?? settings.defaultMarkupPercentage)
    : settings.defaultMarkupPercentage;

  const sellingPriceZAR = calculateSellingPrice(ownerCostUSD, exchangeRate, markupPercentage);
  const convertedCostZAR = Math.round((ownerCostUSD * exchangeRate) * 100) / 100;

  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const conditionIndex = product.conditions.findIndex(c => c.condition === condition);
  if (conditionIndex === -1) throw new Error('Condition not found on product');

  const oldPrice = product.conditions[conditionIndex].sellingPriceZAR;

  const updatedCondition = {
    ...product.conditions[conditionIndex],
    ownerCostUSD,
    exchangeRateUsed: exchangeRate,
    markupPercentage,
    isCustomMarkup: isCustom,
    convertedCostZAR,
    sellingPriceZAR,
    calculatedAt: new Date(),
  };

  product.conditions[conditionIndex] = updatedCondition as any;
  await product.save();

  if (oldPrice !== sellingPriceZAR) {
    await PriceHistory.create({
      productId,
      condition,
      ownerCostUSD,
      exchangeRateUsed: exchangeRate,
      markupPercentage,
      convertedCostZAR,
      sellingPriceZAR,
      changedAt: new Date(),
    });
  }

  return product.conditions[conditionIndex];
};

export const repriceAllProducts = async () => {
  const settings = await getGlobalPricingSettings();
  const products = await Product.find({ published: true });
  let updatedCount = 0;

  for (const product of products) {
    for (const cond of product.conditions) {
      if (cond.ownerCostUSD) {
        await updateProductPrice(
          product._id.toString(),
          cond.condition,
          cond.ownerCostUSD
        );
        updatedCount++;
      }
    }
  }

  return { updatedCount };
};
