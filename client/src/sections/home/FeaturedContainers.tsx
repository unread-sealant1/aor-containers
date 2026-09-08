import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/common/ProductCard';
import { formatCurrency } from '../../utils/currency';
import type { Product } from '../../types';
import './FeaturedContainers.css';

const FeaturedContainers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/products`);
        const result = await response.json();
        if (result.success) {
          // Show a selection of real stock items (marked as featured)
          const featured = result.data.filter((p: any) => p.featured);
          setProducts(featured);
        }
      } catch (err) {
        console.error('Error fetching featured containers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className='featured-section text-center'>Loading featured containers...</div>;

  return (
    <section className='featured-section'>
      <div className='container'>
        <div className='featured-header'>
          <h2 className='featured-title'>Featured Containers</h2>
          <p className='featured-desc'>
            Choose from our wide range of inspected containers tailored to your logistics and storage requirements.
          </p>
        </div>

        <div className='featured-grid'>
          {products.map((product, index) => {
            const minPrice = product.conditions?.[0]?.sellingPriceZAR || 0;
            return (
              <motion.div
                key={product.slug || index}
                whileHover={{ y: -10 }}
                className='featured-card-wrapper'
              >
                <ProductCard
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
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContainers;
