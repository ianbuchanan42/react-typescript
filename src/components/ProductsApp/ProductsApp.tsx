/**
 * ProductsApp Component
 *
 * A React component that displays a list of products fetched from the Fake Store API.
 * Features:
 * - Fetches and displays products with images, descriptions, and prices
 * - Handles loading and error states
 * - Allows adding products to a cart (selected products)
 * - Responsive layout with flexbox styling
 * - Pagination support for better user experience
 */

import { useState, useEffect, useCallback } from 'react';
import './ProductsApp.css';

// Type definition for Product data structure
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const ITEMS_PER_PAGE = 6;

const ProductsApp = () => {
  // State management for products, cart, loading state, and errors
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Memoized handler for adding products to cart
  const handleProductClick = useCallback(
    (product: Product) => {
      setSelectedProducts((prev) => [...prev, product]);
    },
    [] // No dependencies needed since we're using functional update
  );

  // Handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the product list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading and error state handlers
  if (isLoading)
    return (
      <div role='status' aria-live='polite'>
        Loading products...
      </div>
    );
  if (error) return <div role='alert'>Error: {error}</div>;

  return (
    <section className='products-container'>
      <h1>Products Catalog</h1>

      {/* Display selected products count */}
      <div className='cart-summary' aria-live='polite'>
        Items in cart: {selectedProducts.length}
      </div>

      <ul className='products-list'>
        {currentProducts.map((product) => (
          <li key={product.id} className='product-item'>
            <article className='product-card'>
              <h2 className='product-title'>{product.title}</h2>
              <div className='product-content'>
                <img
                  className='product-image'
                  src={product.image}
                  alt={`Product: ${product.title}`}
                  loading='lazy'
                />
                <div className='product-details'>
                  <p className='product-description'>{product.description}</p>
                  <p className='product-price'>${product.price.toFixed(2)}</p>
                  <p className='product-category'>
                    Category: {product.category}
                  </p>
                  <button
                    className='sf-button sf-button--primary add-to-cart-button'
                    onClick={() => handleProductClick(product)}
                    aria-label={`Add ${product.title} to cart`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <nav className='pagination' aria-label='Product page navigation'>
          <button
            className='pagination-button'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label='Go to previous page'
          >
            Previous
          </button>

          <div className='pagination-numbers'>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${
                  page === currentPage ? 'active' : ''
                }`}
                onClick={() => handlePageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className='pagination-button'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label='Go to next page'
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
};

export default ProductsApp;
