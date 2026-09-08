import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceHistory extends Document {
  productId: mongoose.Types.ObjectId;
  condition: string;
  ownerCostUSD: number;
  exchangeRateUsed: number;
  markupPercentage: number;
  convertedCostZAR: number;
  sellingPriceZAR: number;
  changedAt: Date;
}

const priceHistorySchema = new Schema<IPriceHistory>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  condition: { type: String, required: true },
  ownerCostUSD: { type: Number, required: true },
  exchangeRateUsed: { type: Number, required: true },
  markupPercentage: { type: Number, required: true },
  convertedCostZAR: { type: Number, required: true },
  sellingPriceZAR: { type: Number, required: true },
  changedAt: { type: Date, default: Date.now },
}, { timestamps: false });

const PriceHistory = mongoose.model<IPriceHistory>('PriceHistory', priceHistorySchema);

export default PriceHistory;
