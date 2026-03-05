import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getProductsByCategory, getCategories } from '../../services/dataService';
import { isProductInSeason } from '../../utils/helpers';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './ProductListingPage.css';

export default function ProductListingPage() {
  const { category } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prods, cats] = await Promise.all([
          getProductsByCategory(category),
          getCategories()
        ]);
        setAllProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [category]);

  const currentCategory = categories.find(c => c.slug === category);
  const available = allProducts
    .filter(p => p.isAvailable && isProductInSeason(p))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const unavailable = allProducts
    .filter(p => !p.isAvailable || !isProductInSeason(p))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (loading) {
    return <LoadingSpinner size="page" text="Loading products..." />;
  }

  return (
    <div className="listing-page">
      <div className="container">
        <nav className="breadcrumb animate-fade-in">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <span>{currentCategory?.name || category}</span>
        </nav>
      </div>

      <section className="listing-header">
        <div className="container">
          <div className="listing-header-content animate-fade-in-up">
            <h1 className="listing-title">{currentCategory?.name || category}</h1>
            <p className="listing-desc">{currentCategory?.description}</p>
            <span className="listing-count">
              {available.length} product{available.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>
        <div className="listing-header-decoration" />
      </section>

      <section className="listing-products">
        <div className="container">
          {available.length > 0 ? (
            <div className="products-grid">
              {available.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="listing-empty">
              <span className="listing-empty-icon">🍃</span>
              <h3>No products available</h3>
              <p>
                {category === 'mangoes'
                  ? "Mango season hasn't started yet. Check back in April!"
                  : 'Check back soon for new arrivals.'}
              </p>
              <Link to="/" className="btn btn--outline btn--md" style={{ marginTop: '1rem' }}>
                Back to Home
              </Link>
            </div>
          )}

          {unavailable.length > 0 && (
            <div className="listing-coming-soon">
              <h3 className="coming-soon-title">Coming Soon</h3>
              <p className="coming-soon-desc">These products will be available in their season</p>
              <div className="products-grid">
                {unavailable.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
