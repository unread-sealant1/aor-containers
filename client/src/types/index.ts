export interface Product {
  _id?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  specifications: {
    externalLength: string;
    externalWidth: string;
    externalHeight: string;
    internalLength: string;
    internalWidth: string;
    internalHeight: string;
    capacity: string;
    tareWeight: string;
  };
  conditions: string[];
  applications: string[];
  featured: boolean;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuoteRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  province: string;
  product: string;
  quantity: number;
  condition: 'New' | 'Used';
  deliveryAddress: string;
  notes: string;
  status?: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  source?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
