import mongoose, { Schema, Document } from 'mongoose';

export interface IStockHistory extends Document {
  productId: mongoose.Types.ObjectId;
  previousQuantity: number;
  newQuantity: number;
  previousAvailability: string;
  newAvailability: string;
  note: string;
  source: string;
  changedAt: Date;
}

const stockHistorySchema = new Schema<IStockHistory>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  previousQuantity: { type: Number, required: true },
  newQuantity: { type: Number, required: true },
  previousAvailability: { type: String, required: true },
  newAvailability: { type: String, required: true },
  note: String,
  source: String,
  changedAt: { type: Date, default: Date.now },
}, { timestamps: false });

const StockHistory = mongoose.model<IStockHistory>('StockHistory', stockHistorySchema);

export default StockHistory;
