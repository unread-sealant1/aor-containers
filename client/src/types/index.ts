export interface ConditionPrice {
  condition: string;
  sellingPriceZAR: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images: { url: string; isPrimary: boolean }[];
  specifications: {
    externalLength: string;
    externalWidth: string;
    externalHeight: string;
    internalLength: string;
    internalWidth: string;
    internalHeight: string;
    capacity: string;
    tareWeight: string;
    location?: string;
    yearOfManufacture?: string;
  };
  conditions: ConditionPrice[];
  applications: string[];
  featured: boolean;
  published: boolean;
  stockQuantity: number;
  availability: string;
  currency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
