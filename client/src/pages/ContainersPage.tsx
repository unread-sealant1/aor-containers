import React, { useState, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import './ContainersPage.css';

interface Product {
  name: string;
  description: string;
  images: { url: string }[];
  specifications: {
    capacity?: string;
    location?: string;
    [key: string]: any;
  };
  slug: string;
  stockQuantity: number;
  availability: string;
  conditions: {
    condition: string;
    sellingPriceZAR: number;
  }[];
}

const ContainersPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/products`);
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError('An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className='containers-page text-center'>Loading containers...</div>;
  if (error) return <div className='containers-page text-center'>{error}</div>;
  if (products.length === 0) return <div className='containers-page text-center'>No containers are currently available.</div>;

  return (
    <div className='containers-page'>
      <div className='container'>
        <div className='containers-header'>
          <h1 className='containers-title'>Our Container Range</h1>
          <p className='containers-desc'>
            Explore our wide selection of new and used shipping containers,
            rigorously inspected for quality and ready for collection.
          </p>
        </div>

        <div className='containers-grid'>
          {products.map((product, index) => {
            const minPrice = product.conditions?.[0]?.sellingPriceZAR || 0;
            return (
              <ProductCard
                key={product.slug || index}
                product={{
                  name: product.name,
                  desc: product.description,
                  spec: product.specifications?.capacity || 'N/A',
                  img: product.images?.[0]?.url || 'https://via.placeholder.com/400',
                  slug: product.slug,
                  stock: product.availability === 'On Request'
                    ? 'On Request'
                    : product.stockQuantity === 0
                      ? 'Out of Stock'
                      : `${product.stockQuantity} Available`,
                  price: minPrice
                } as any}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContainersPage;
