import { useState } from 'react';
import { useBook } from '../../contexts/BookContext';
import './PageNavigation.css';

export default function PageNavigation() {
  const { currentPage, totalPages, goToPage, nextPage, prevPage } = useBook();
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      goToPage(page);
    }
    setIsEditing(false);
    setInputValue('');
  };

  const handleInputFocus = () => {
    setIsEditing(true);
    setInputValue(String(currentPage));
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    setInputValue('');
  };

  return (
    <div className="page-navigation">
      <button
        className="nav-btn prev-btn"
        onClick={prevPage}
        disabled={currentPage <= 1}
        title="Previous page (Left arrow)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span>Previous</span>
      </button>

      <form className="page-input-form" onSubmit={handleSubmit}>
        <span className="page-label">Page</span>
        {isEditing ? (
          <input
            type="number"
            className="page-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputBlur}
            min={1}
            max={totalPages}
            autoFocus
          />
        ) : (
          <button
            type="button"
            className="page-display"
            onClick={handleInputFocus}
            title="Click to jump to page"
          >
            {currentPage}
          </button>
        )}
        <span className="page-total">of {totalPages}</span>
      </form>

      <button
        className="nav-btn next-btn"
        onClick={nextPage}
        disabled={currentPage >= totalPages}
        title="Next page (Right arrow)"
      >
        <span>Next</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
