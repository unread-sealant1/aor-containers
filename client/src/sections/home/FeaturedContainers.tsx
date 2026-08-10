import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import ProductCard from '../../components/common/ProductCard';
import './FeaturedContainers.css';

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

const FeaturedContainers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const result = await response.json();
        if (result.success) {
          // Only show featured products here
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
          {products.map((product, index) => (
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
                  img: product.images[0] || 'https://via.placeholder.com/400',
                  slug: product.slug
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedContainers;
