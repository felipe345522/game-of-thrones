import { Card } from '../ui/Card';

export const CharacterCard = ({
  character,
  isFavorite,
  onToggleFavorite,
  onShowDetails,
}) => (
  <Card className="character-card">
    <div className="char-img-wrapper">
      {character.image ? (
        <img
          src={character.image}
          alt={character.name}
          className="char-img"
          loading="lazy"
        />
      ) : (
        <span style={{ color: '#999', fontSize: 12 }}>Imagen no disponible</span>
      )}
    </div>
    <h3>{character.name}</h3>
    <p><strong>Título:</strong> {character.title}</p>
    <p><strong>Casa:</strong> {character.family}</p>
    <div className="card-actions">
      <button
        type="button"
        className={`favorite-button${isFavorite ? ' is-favorite' : ''}`}
        onClick={() => onToggleFavorite('character', character)}
        aria-pressed={isFavorite}
        aria-label={`${isFavorite ? 'Quitar de' : 'Añadir a'} favoritos: ${character.name}`}
      >
        <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
        {isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
      </button>
      <button
        type="button"
        className="details-button"
        onClick={() => onShowDetails('character', character)}
      >
        Ver ficha
      </button>
    </div>
  </Card>
);