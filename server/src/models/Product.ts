import mongoose, { Schema, Document } from 'mongoose';

export interface ConditionPrice {
  condition?: 'New' | 'Used' | 'New & Used' | 'On Request' | 'AS IS' | 'WWT' | 'CWO' | 'IICL';
  price?: number; // Legacy field
  ownerCostUSD?: number;
  exchangeRateUsed?: number;
  markupPercentage?: number;
  isCustomMarkup?: boolean;
  convertedCostZAR?: number;
  sellingPriceZAR: number;
  calculatedAt?: Date;
}

export interface ProductSpecifications {
  length?: string;
  width?: string;
  height?: string;
  internalLength?: string;
  internalWidth?: string;
  internalHeight?: string;
  capacity?: string;
  tareWeight?: string;
  maximumPayload?: string;
  doorWidth?: string;
  doorHeight?: string;
  [key: string]: any;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: 'Standard Containers' | 'High Cube Containers' | 'Refrigerated Containers' | 'Open Top Containers' | 'Flat Rack Containers' | 'Side Opening Containers' | 'Storage Containers';
  images: {
    url: string;
    isPrimary: boolean;
  }[];
  conditions: ConditionPrice[];
  specifications: ProductSpecifications;
  applications: string[];
  stockQuantity: number;
  availability: 'Available' | 'Limited Availability' | 'Out of Stock' | 'On Request';
  currency: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Standard Containers',
      'High Cube Containers',
      'Refrigerated Containers',
      'Open Top Containers',
      'Flat Rack Containers',
      'Side Opening Containers',
      'Storage Containers'
    ]
  },
  images: [{
    url: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
  }],
  conditions: [{
    condition: {
      type: String,
      required: false,
      enum: ['New', 'Used', 'New & Used', 'On Request', 'AS IS', 'WWT', 'CWO', 'IICL']
    },
    price: { type: Number }, // Legacy field
    ownerCostUSD: { type: Number },
    exchangeRateUsed: { type: Number },
    markupPercentage: { type: Number },
    isCustomMarkup: { type: Boolean, default: false },
    convertedCostZAR: { type: Number },
    sellingPriceZAR: { type: Number },
    calculatedAt: { type: Date }
  }],
  specifications: {
    length: String,
    width: String,
    height: String,
    internalLength: String,
    internalWidth: String,
    internalHeight: String,
    capacity: String,
    tareWeight: String,
    maximumPayload: String,
    doorWidth: String,
    doorHeight: String,
    location: String,
    yearOfManufacture: String,
  },
  applications: [String],
  stockQuantity: { type: Number, default: 0 },
  availability: {
    type: String,
    required: true,
    enum: ['Available', 'Limited Availability', 'Out of Stock', 'On Request'],
    default: 'Available'
  },
  currency: { type: String, default: 'ZAR' },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
}, {
  timestamps: true
});

productSchema.index({ slug: 1 });

const Product = mongoose.model<IProduct>('Product', productSchema, 'containers');

export default Product;
