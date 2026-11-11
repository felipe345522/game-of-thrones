import { fetchBooks } from '../services/api';
import { useAsyncResource } from './useAsyncResource';

export const useBooks = () => {
  const { data, loading, error, reload } = useAsyncResource(fetchBooks);
  return { books: data, loading, error, reload };
};