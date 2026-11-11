import { Card } from '../ui/Card';

export const BookCard = ({
  book,
  isFavorite,
  onToggleFavorite,
  onShowDetails,
}) => (
  <Card className="book-card">
    <h3>{book.name}</h3>
    <p><strong>Autores:</strong> {book.authors}</p>
    <p><strong>Publicado:</strong> {book.released}</p>
    <p><strong>Páginas:</strong> {book.pages}</p>
    <div className="card-actions">
      <button
        type="button"
        className={`favorite-button${isFavorite ? ' is-favorite' : ''}`}
        onClick={() => onToggleFavorite('book', book)}
        aria-pressed={isFavorite}
        aria-label={`${isFavorite ? 'Quitar de' : 'Añadir a'} favoritos: ${book.name}`}
      >
        <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
        {isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
      </button>
      <button
        type="button"
        className="details-button"
        onClick={() => onShowDetails('book', book)}
      >
        Ver ficha
      </button>
    </div>
  </Card>
);