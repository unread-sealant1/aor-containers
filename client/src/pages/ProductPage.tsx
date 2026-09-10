import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Ruler, Package, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import type { Product } from '../types';
import { formatCurrency } from '../utils/currency';
import { getImageUrl } from '../utils/imageUtils';
import './ProductPage.css';

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/products/${slug}`);
        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
          document.title = `${result.data.name} | AOR Containers`;
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', result.data.description);
          }
        }
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
              <img src={getImageUrl(product.images?.[0]?.url)} alt={product.name} />
            </div>
            <div className='product-thumbnails'>
              {(product.images || []).slice(1).map((img, i) => (
                <div key={i} className='thumbnail-box'>
                  <img src={getImageUrl(img.url)} alt={product.name} />
                </div>
              ))}
            </div>
          </div>

          <div className='product-details'>
            <h1 className='product-title'>{product.name}</h1>
            <p className='product-description'>{product.description}</p>

            <div className='product-pricing-section'>
              <div className='price-featured-card'>
                <span className='price-featured-label'>Selling Price</span>
                <div className='price-featured-value'>
                  {product.conditions && product.conditions.length > 0 ? (
                    formatCurrency(product.conditions[0].sellingPriceZAR)
                  ) : (
                    'Price on Request'
                  )}
                </div>
                <div className='price-featured-details'>
                  {product.conditions && product.conditions.map((c, i) => (
                    <div key={i} className='condition-price-row'>
                      <span className='condition-name'>{c.condition}</span>
                      <span className='condition-price'>{formatCurrency(c.sellingPriceZAR)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='product-specs-grid'>
              <div className='spec-card'>
                <div className='spec-card-header'>
                  <Ruler size={20} className='spec-card-icon' /> Key Details
                </div>
                <div className='spec-list'>
                  <div className='spec-item'>
                    <span className='spec-label'>Location:</span>
                    <span className='spec-value'>{product.specifications?.location || 'Not specified'}</span>
                  </div>
                  <div className='spec-item'>
                    <span className='spec-label'>Condition:</span>
                    <span className='spec-value'>{product.conditions?.[0]?.condition || 'N/A'}</span>
                  </div>
                  <div className='spec-item'>
                    <span className='spec-label'>YOM:</span>
                    <span className='spec-value'>{product.specifications?.yearOfManufacture || 'N/A'}</span>
                  </div>
                  <div className='spec-item'>
                    <span className='spec-label'>Available:</span>
                    <span className='spec-value'>{product.stockQuantity} units</span>
                  </div>
                </div>
              </div>
              <div className='spec-card'>
                <div className='spec-card-header'>
                  <Package size={20} className='spec-card-icon' /> Specifications
                </div>
                <div className='spec-list'>
                  {Object.entries(product.specifications || {})
                    .filter(([key]) => key !== 'location' && key !== 'yearOfManufacture')
                    .map(([key, value]) => (
                      <div key={key} className='spec-item'>
                        <span className='spec-label'>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                        <span className='spec-value'>{value || 'N/A'}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className='product-apps'>
              <h4 className='apps-title'>Common Applications</h4>
              <div className='apps-list'>
                {(product.applications || []).map((app, i) => (
                  <span key={i} className='app-tag'>
                    {app}
                  </span>
                ))}
              </div>
            </div>

            <div className='product-actions-container'>
              {product.stockQuantity === 0 && product.availability !== 'On Request' && (
                <div className='restock-notice'>
                  <p className='restock-text'>
                    Waiting for restock. Want to know when stock will be available?
                    <a href='mailto:info@aorcontainers.com' className='restock-link'> email info@aorcontainers.com</a>
                  </p>
                </div>
              )}
              {product.conditions && product.conditions.length > 0 && product.conditions[0].sellingPriceZAR > 0 ? (
                <Button
                  variant='primary'
                  size='lg'
                  className='product-order-btn'
                  onClick={() => {
                    const selectedCondition = product.conditions[0];
                    navigate(`/order?slug=${product.slug}&condition=${selectedCondition.condition}&price=${selectedCondition.sellingPriceZAR}`);
                  }}
                >
                  Order Now
                </Button>
              ) : (
                <Button variant='primary' size='lg' className='product-order-btn' onClick={() => window.location.href='/contact'}>
                  Price on Request
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;