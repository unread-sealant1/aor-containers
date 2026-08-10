import React, { useState, useEffect } from 'react';
import ProductCard from '../components/common/ProductCard';
import './ContainersPage.css';

interface Product {
  name: string;
  description: string;
  images: string[];
  specifications: {
    capacity?: string;
    [key: string]: any;
  };
  slug: string;
}

const ContainersPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
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

  return (
    <div className='containers-page'>
      <div className='container'>
        <div className='containers-header'>
          <h1 className='containers-title'>Our Container Range</h1>
          <p className='containers-desc'>
            Explore our wide selection of new and used shipping containers,
            rigorously inspected for quality and ready for immediate delivery.
          </p>
        </div>

        <div className='containers-grid'>
          {products.map((product, index) => (
            <ProductCard
              key={product.slug || index}
              product={{
                name: product.name,
                desc: product.description,
                spec: product.specifications?.capacity || 'N/A',
                img: product.images[0] || 'https://via.placeholder.com/400',
                slug: product.slug
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContainersPage;
