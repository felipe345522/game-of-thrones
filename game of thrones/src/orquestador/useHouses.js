import { fetchHouses } from '../services/api';
import { useAsyncResource } from './useAsyncResource';

export const useHouses = () => {
  const { data, loading, error, reload } = useAsyncResource(fetchHouses);
  return { houses: data, loading, error, reload };
};