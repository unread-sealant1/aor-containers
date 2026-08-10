export interface Product {
  id?: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  images: string[];
  specifications: {
    externalLength?: string;
    externalWidth?: string;
    externalHeight?: string;
    internalLength?: string;
    internalWidth?: string;
    internalHeight?: string;
    capacity?: string;
    tareWeight?: string;
  };
  conditions: string[];
  applications: string[];
  featured: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
