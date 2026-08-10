export interface QuoteRequest {
  id?: string;
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
  notes?: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost';
  source: string;
  created_at?: string;
  updated_at?: string;
}
