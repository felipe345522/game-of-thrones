import { BookCard } from './BookCard';
import { Loader } from '../ui/Loader';
import { ErrorMessage } from '../ui/ErrorMessage';

export const BookList = ({
  books,
  loading,
  error,
  onRetry,
  emptyMessage,
  favoriteIds,
  onToggleFavorite,
  onShowDetails,
}) => {
  if (loading) return <Loader text="Cargando libros..." />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (books.length === 0) return <p className="empty-state">{emptyMessage}</p>;
  return (
    <div className="grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favoriteIds.has(`book:${book.id}`)}
          onToggleFavorite={onToggleFavorite}
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  );
};