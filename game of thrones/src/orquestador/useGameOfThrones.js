import { useBooks } from './useBooks';
import { useHouses } from './useHouses';
import { useCharacters } from './useCharacters';

export const useGameOfThrones = () => {
  const booksState = useBooks();
  const housesState = useHouses();
  const charactersState = useCharacters();

  const reloadAll = () => {
    booksState.reload();
    housesState.reload();
    charactersState.reload();
  };


  const isLoading =
    booksState.loading || housesState.loading || charactersState.loading;

  const hasError =
    booksState.error || housesState.error || charactersState.error;

  return {
    
    books: booksState.books,
    houses: housesState.houses,
    characters: charactersState.characters,

    
    booksLoading: booksState.loading,
    housesLoading: housesState.loading,
    charactersLoading: charactersState.loading,
    booksError: booksState.error,
    housesError: housesState.error,
    charactersError: charactersState.error,

    
    isLoading,
    hasError,

    
    reloadAll,
  };
};