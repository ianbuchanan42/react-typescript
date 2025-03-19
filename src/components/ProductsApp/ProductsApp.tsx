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
      <section>
        <div role='status' aria-live='polite'>
          Loading products...
        </div>
      </section>
    );
  if (error)
    return (
      <section>
        <div role='alert'>Error: {error}</div>
      </section>
    );

  return (
    <section className='products-container'>
      <header>
        <h1>Products Catalog</h1>
      </header>

      {/* Display selected products count */}
      <aside className='cart-summary' aria-live='polite'>
        <h2>Shopping Cart</h2>
        <p>Items in cart: {selectedProducts.length}</p>
      </aside>

      <section aria-labelledby='products-heading'>
        <h2 id='products-heading' className='visually-hidden'>
          Available Products
        </h2>
        <section
          className='products-list'
          aria-labelledby='products-list'
          role='list'
        >
          {currentProducts.map((product) => (
            <article key={product.id} className='product-item' role='listitem'>
              <div className='product-card'>
                <header>
                  <h3 className='product-title'>{product.title}</h3>
                </header>
                <div className='product-content'>
                  <figure>
                    <img
                      className='product-image'
                      src={product.image}
                      alt={`Product: ${product.title}`}
                      loading='lazy'
                      width='200'
                      height='200'
                    />
                  </figure>
                  <div className='product-details'>
                    <p className='product-description'>{product.description}</p>
                    <p className='product-price'>
                      <span className='visually-hidden'>Price: </span>$
                      {product.price.toFixed(2)}
                    </p>
                    <p className='product-category'>
                      <span className='visually-hidden'>Category: </span>
                      {product.category}
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
              </div>
            </article>
          ))}
        </section>
      </section>

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

          <div className='pagination-numbers' role='navigation'>
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
