import { HouseCard } from './HouseCard';
import { Loader } from '../ui/Loader';
import { ErrorMessage } from '../ui/ErrorMessage';

export const HouseList = ({
  houses,
  loading,
  error,
  onRetry,
  emptyMessage,
  favoriteIds,
  onToggleFavorite,
  onShowDetails,
}) => {
  if (loading) return <Loader text="Cargando casas..." />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;
  if (houses.length === 0) return <p className="empty-state">{emptyMessage}</p>;
  return (
    <div className="grid">
      {houses.map((house) => (
        <HouseCard
          key={house.id}
          house={house}
          isFavorite={favoriteIds.has(`house:${house.id}`)}
          onToggleFavorite={onToggleFavorite}
          onShowDetails={onShowDetails}
        />
      ))}
    </div>
  );
};