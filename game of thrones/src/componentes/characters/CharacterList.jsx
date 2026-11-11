import { CharacterCard } from './CharacterCard';
import { Loader } from '../ui/Loader';
import { ErrorMessage } from '../ui/ErrorMessage';

export const CharacterList = ({
  characters,
  loading,
  error,
  onRetry,
  emptyMessage,
  favoriteIds,
  onToggleFavorite,
  onShowDetails,
}) => {
  if (loading) return <Loader text="Cargando personajes..." />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (characters.length === 0) return <p className="empty-state">{emptyMessage}</p>;
  return (
    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          isFavorite={favoriteIds.has(`character:${character.id}`)}
          onToggleFavorite={onToggleFavorite}
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  );
};