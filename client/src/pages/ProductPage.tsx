import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Ruler, Package, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import Button from '../components/common/Button';
import type { Product } from '../types';
import './ProductPage.css';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${slug}`);
        setProduct(data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className='product-status-message'>Loading Container Details...</div>;
  if (!product) return <div className='product-status-message product-status-message--error'>Product Not Found</div>;

  return (
    <div className='product-page'>
      <div className='container'>
        <Link to='/containers' className='back-link'>
          <ArrowLeft size={18} /> Back to Containers
        </Link>

        <div className='product-grid'>
          <div className='product-gallery'>
            <div className='product-main-img'>
              <img src={product.images[0]} alt={product.name} />
            </div>
            <div className='product-thumbnails'>
              {product.images.slice(1).map((img, i) => (
                <div key={i} className='thumbnail-box'>
                  <img src={img} alt={product.name} />
                </div>
              ))}
            </div>
          </div>

          <div className='product-details'>
            <h1 className='product-title'>{product.name}</h1>
            <p className='product-description'>{product.description}</p>

            <div className='product-specs-grid'>
              <div className='spec-card'>
                <div className='spec-card-header'>
                  <Ruler size={20} className='spec-card-icon' /> Specifications
                </div>
                <div className='spec-list'>
                  <div className='spec-item'><span>External Length:</span> <span className='spec-value'>{product.specifications.externalLength}</span></div>
                  <div className='spec-item'><span>External Width:</span> <span className='spec-value'>{product.specifications.externalWidth}</span></div>
                  <div className='spec-item'><span>External Height:</span> <span className='spec-value'>{product.specifications.externalHeight}</span></div>
                  <div className='spec-item'><span>Capacity:</span> <span className='spec-value'>{product.specifications.capacity}</span></div>
                </div>
              </div>
              <div className='spec-card'>
                <div className='spec-card-header'>
                  <Package size={20} className='spec-card-icon' /> Details
                </div>
                <div className='spec-list'>
                  <div className='spec-item'><span>Tare Weight:</span> <span className='spec-value'>{product.specifications.tareWeight}</span></div>
                  <div className='spec-item'><span>Conditions:</span> <span className='spec-value'>{product.conditions.join(', ')}</span></div>
                  <div className='spec-item'><span>Available:</span> <span className='spec-value spec-value--success'>Yes</span></div>
                </div>
              </div>
            </div>

            <div className='product-apps'>
              <h4 className='apps-title'>Common Applications</h4>
              <div className='apps-list'>
                {product.applications.map((app, i) => (
                  <span key={i} className='app-tag'>
                    {app}
                  </span>
                ))}
              </div>
            </div>

            <div className='product-actions-container'>
              <Button variant='primary' size='lg' className='product-quote-btn' onClick={() => window.location.href='/request-a-quote'}>
                Request a Quote for this Container
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
