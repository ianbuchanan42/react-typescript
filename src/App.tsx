import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/theme.css';

// Lazy loading components for better performance
import { Suspense, lazy } from 'react';

// Lazy loaded components
const TodoApp = lazy(() => import('./components/TodoApp/TodoApp'));
const VotingApp = lazy(() => import('./components/VotingApp/VotingApp'));
const FormApp = lazy(() => import('./components/FormApp/FormApp'));
const ProductsApp = lazy(() => import('./components/ProductsApp/ProductsApp'));

function App() {
  return (
    <Router>
      {/* Main Navigation */}
      <nav className='sf-flex-between' style={{ padding: 'var(--spacing-md)' }}>
        <div className='sf-text-title'>React Practice</div>
        <div className='sf-flex' style={{ gap: 'var(--spacing-md)' }}>
          <Link to='/' className='sf-button'>
            Todo App
          </Link>
          <Link to='/voting' className='sf-button'>
            Voting App
          </Link>
          <Link to='/form' className='sf-button'>
            Form App
          </Link>
          <Link to='/products' className='sf-button'>
            Products App
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className='sf-container'>
        <Suspense
          fallback={
            <div className='sf-flex-center' style={{ height: '50vh' }}>
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path='/' element={<TodoApp />} />
            <Route path='/voting' element={<VotingApp />} />
            <Route path='/form' element={<FormApp />} />
            <Route path='/products' element={<ProductsApp />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
