import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ProductCard.css';

interface ProductCardProps {
  product: {
    name: string;
    desc: string;
    spec: string;
    img: string;
    slug: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className='product-card'>
      <div className='product-card__image-container'>
        <img src={product.img} alt={product.name} className='product-card__image' />
      </div>
      <div className='product-card__content'>
        <h3 className='product-card__title'>{product.name}</h3>
        <p className='product-card__description'>{product.desc}</p>
        <div className='product-card__spec'>{product.spec}</div>
        <div className='product-card__actions'>
          <Link to={`/containers/${product.slug}`} className='btn btn-ghost btn-small'>
            View Details <ArrowRight size={14} className='btn-icon-right' />
          </Link>
          <Link to='/request-a-quote' className='btn btn-primary btn-small'>
            Quote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
