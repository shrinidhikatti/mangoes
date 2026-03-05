import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/helpers';
import Badge from '../ui/Badge';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 10;
  const isSoldOut = product.stockQuantity === 0 || !product.isAvailable;

  return (
    <Link
      to={`/product/${product.id}`}
      className={`product-card animate-fade-in-up delay-${Math.min(index + 1, 6)}`}
    >
      <div className="product-card-image">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
        />
        <div className="product-card-overlay">
          <span className="product-card-cta">
            <ShoppingBag size={16} />
            View Details
          </span>
        </div>
        {isSoldOut && (
          <div className="product-card-sold-out">
            <span>Sold Out</span>
          </div>
        )}
        {isLowStock && !isSoldOut && (
          <Badge variant="saffron" size="sm">
            Only {product.stockQuantity} left
          </Badge>
        )}
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.category}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">{product.description.slice(0, 80)}...</p>
        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="price-label">From</span>
            <span className="price-value">{formatPrice(lowestPrice)}</span>
          </div>
          <div className="product-card-variants">
            {product.variants.length} options
          </div>
        </div>
      </div>
    </Link>
  );
}
