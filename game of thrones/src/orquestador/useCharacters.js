import { fetchCharacters } from '../services/api';
import { useAsyncResource } from './useAsyncResource';

export const useCharacters = () => {
  const { data, loading, error, reload } = useAsyncResource(fetchCharacters);
  return { characters: data, loading, error, reload };
};