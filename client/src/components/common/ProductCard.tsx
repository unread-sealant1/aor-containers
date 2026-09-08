import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUtils';
import { formatCurrency } from '../../utils/currency';
import './ProductCard.css';

interface ProductCardProps {
  product: {
    name: string;
    desc: string;
    spec: string;
    img: string;
    slug: string;
    stock?: string | number;
    price?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOutOfStock = product.stock === 'Out of Stock' || product.stock === 0;

  return (
    <div className='product-card'>
      <div className='product-card__image-container'>
        <img src={getImageUrl(product.img)} alt={product.name} className='product-card__image' />
        {isOutOfStock && (
          <div className='product-card__stock-badge'>Out of Stock</div>
        )}
      </div>
      <div className='product-card__content'>
        <div className='product-card__header'>
          <h3 className='product-card__title'>{product.name}</h3>
          <div className='product-card__spec'>{product.spec}</div>
        </div>

        <p className='product-card__description'>{product.desc}</p>

        <div className='product-card__pricing'>
          <span className='product-card__price-label'>Selling Price</span>
          <span className='product-card__price-value'>
            {product.price && product.price > 0
              ? formatCurrency(product.price)
              : 'Price on Request'}
          </span>
        </div>

        <div className='product-card__stock-info'>
          {product.stock} Available
        </div>

        <div className='product-card__actions'>
          <Link to={`/containers/${product.slug}`} className='btn btn-ghost btn-small'>
            View Details <ArrowRight size={14} className='btn-icon-right' />
          </Link>
          <Link
            to={`/order?slug=${product.slug}`}
            className='btn btn-primary btn-small'
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
