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
    defaultMarkupPercentage: 28.8,
  };

  return {
    ...(defaults),
    ...(settingsDoc?.value || {}),
  };
};

export const updateProductPrice = async (
  productId: string,
  conditionOrIndex: string | number,
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

  let conditionIndex: number;
  if (typeof conditionOrIndex === 'number') {
    conditionIndex = conditionOrIndex;
  } else {
    conditionIndex = product.conditions.findIndex(c => c.condition === conditionOrIndex);
  }

  const productCondition = product.conditions[conditionIndex];
  if (!productCondition) throw new Error('Condition not found on product');

  const oldPrice = productCondition.sellingPriceZAR;

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
      condition: productCondition.condition || 'Unknown',
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
    for (let i = 0; i < product.conditions.length; i++) {
      const cond = product.conditions[i];
      if (cond.ownerCostUSD) {
        await updateProductPrice(
          product._id.toString(),
          i,
          cond.ownerCostUSD
        );
        updatedCount++;
      }
    }
  }

  return { updatedCount };
};
