import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={card }>
      {title && (
        <div className='card__header'>
          <h3 className='card__title'>{title}</h3>
          {subtitle && <p className='card__subtitle'>{subtitle}</p>}
        </div>
      )}
      <div className='card__body'>
        {children}
      </div>
    </div>
  );
};

export default Card;
