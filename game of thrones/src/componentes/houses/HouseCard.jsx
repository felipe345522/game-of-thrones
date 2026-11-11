import { Card } from '../ui/Card';

export const HouseCard = ({
  house,
  isFavorite,
  onToggleFavorite,
  onShowDetails,
}) => (
  <Card className="house-card">
    <h3>{house.name}</h3>
    <p><strong>Región:</strong> {house.region}</p>
    <p><em>"{house.words}"</em></p>
    <div className="card-actions">
      <button
        type="button"
        className={`favorite-button${isFavorite ? ' is-favorite' : ''}`}
        onClick={() => onToggleFavorite('house', house)}
        aria-pressed={isFavorite}
        aria-label={`${isFavorite ? 'Quitar de' : 'Añadir a'} favoritos: ${house.name}`}
      >
        <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
        {isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
      </button>
      <button
        type="button"
        className="details-button"
        onClick={() => onShowDetails('house', house)}
      >
        Ver ficha
      </button>
    </div>
  </Card>
);