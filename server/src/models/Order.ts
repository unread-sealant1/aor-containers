import mongoose, { Schema, Document } from 'mongoose';
import Product from './Product.js';

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  product: {
    productId: mongoose.Types.ObjectId;
    nameSnapshot: string;
    condition: string;
    location: string;
  };
  quantity: number;
  pricing: {
    unitPriceZAR: number;
    totalZAR: number;
    currency: string;
  };
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Completed' | 'Cancelled';
  notes: {
    customerNotes?: string;
    adminNotes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  orderNumber: { type: String, required: true, unique: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  product: {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    nameSnapshot: { type: String, required: true },
    condition: { type: String, required: true },
    location: { type: String, required: true },
  },
  quantity: { type: Number, required: true, min: 1 },
  pricing: {
    unitPriceZAR: { type: Number, required: true },
    totalZAR: { type: Number, required: true },
    currency: { type: String, default: 'ZAR' },
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending',
    required: true,
  },
  notes: {
    customerNotes: String,
    adminNotes: String,
  },
}, { timestamps: true });

orderSchema.index({ orderNumber: 1 });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
