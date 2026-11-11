import { useCallback, useRef, useState } from 'react';
import { useGameOfThrones } from './orquestador/useGameOfThrones';
import { AppLayout } from './componentes/layout/AppLayout';
import { Header } from './componentes/layout/Header';
import { SectionTitle } from './componentes/ui/SectionTitle';
import { CharacterList } from './componentes/characters/CharacterList';
import { HouseList } from './componentes/houses/HouseList';
import { BookList } from './componentes/book/BookList';
import { DetailModal } from './componentes/ui/DetailModal';
import './App.css';

const FAVORITES_STORAGE_KEY = 'game-of-thrones-explorer-favorites';

const normalizeSearchText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();

const readFavorites = () => {
  try {
    const savedFavorites = JSON.parse(
      localStorage.getItem(FAVORITES_STORAGE_KEY) ?? '[]',
    );

    if (!Array.isArray(savedFavorites) || !savedFavorites.every((id) => typeof id === 'string')) {
      throw new Error('El formato de favoritos guardado no es válido.');
    }

    return { ids: new Set(savedFavorites), error: null };
  } catch (error) {
    return {
      ids: new Set(),
      error: error instanceof Error
        ? `No se pudieron leer los favoritos: ${error.message}`
        : 'No se pudieron leer los favoritos.',
    };
  }
};

const favoriteId = (type, item) => `${type}:${item.id}`;

function App() {
  const [search, setSearch] = useState('');
  const [favoriteState] = useState(readFavorites);
  const [favoriteIds, setFavoriteIds] = useState(favoriteState.ids);
  const [favoriteStorageError, setFavoriteStorageError] = useState(favoriteState.error);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const detailTriggerRef = useRef(null);
  const {
    books, houses, characters,
    booksLoading, housesLoading, charactersLoading,
    booksError, housesError, charactersError,
    reloadAll,
  } = useGameOfThrones();
  const query = normalizeSearchText(search.trim());

  const toggleFavorite = useCallback((type, item) => {
    const id = favoriteId(type, item);
    const nextIds = new Set(favoriteIds);
    if (nextIds.has(id)) nextIds.delete(id);
    else nextIds.add(id);

    setFavoriteIds(nextIds);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...nextIds]));
      setFavoriteStorageError(null);
    } catch (error) {
      setFavoriteStorageError(
        error instanceof Error
          ? `No se pudieron guardar los favoritos: ${error.message}`
          : 'No se pudieron guardar los favoritos.',
      );
    }
  }, [favoriteIds]);

  const matchesSearch = (...values) =>
    values.some((value) => normalizeSearchText(value).includes(query));
  const matchesFavorite = (type, item) =>
    !showFavoritesOnly || favoriteIds.has(favoriteId(type, item));

  const filteredCharacters = characters.filter((character) =>
    matchesFavorite('character', character) &&
    matchesSearch(character.name, character.title, character.family),
  );
  const filteredHouses = houses.filter((house) =>
    matchesFavorite('house', house) &&
    matchesSearch(house.name, house.region, house.words),
  );
  const filteredBooks = books.filter((book) =>
    matchesFavorite('book', book) &&
    matchesSearch(book.name, book.authors, book.released, book.pages),
  );

  const openDetails = (type, item) => {
    detailTriggerRef.current = document.activeElement;
    setSelectedItem({ type, item });
  };
  const closeDetails = useCallback(() => {
    setSelectedItem(null);
    detailTriggerRef.current?.focus();
  }, []);

  return (
    <AppLayout>
      <Header />

      <label className="search-field">
        <span className="visually-hidden">Buscar en personajes, casas y libros</span>
        <span className="search-field__icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar personajes, casas o libros..."
        />
      </label>

      <div className="toolbar">
        <button
          className={`favorites-filter${showFavoritesOnly ? ' is-active' : ''}`}
          type="button"
          onClick={() => setShowFavoritesOnly((showing) => !showing)}
          aria-pressed={showFavoritesOnly}
        >
          <span aria-hidden="true">★</span>
          {showFavoritesOnly ? 'Ver todo' : `Favoritos (${favoriteIds.size})`}
        </button>
        <button onClick={reloadAll} className="reload-btn" type="button">
          Recargar todo
        </button>
      </div>

      {favoriteStorageError && (
        <p className="storage-warning" role="status">{favoriteStorageError}</p>
      )}

      <section id="personajes">
        <SectionTitle>Personajes</SectionTitle>
        <CharacterList
          characters={filteredCharacters}
          loading={charactersLoading}
          error={charactersError}
          onRetry={reloadAll}
          emptyMessage={
            query
              ? 'No se encontraron personajes.'
              : showFavoritesOnly
                ? 'Aún no tienes personajes favoritos.'
                : 'No hay personajes disponibles.'
          }
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onShowDetails={openDetails}
        />
      </section>

      <section id="casas">
        <SectionTitle>Casas Nobles</SectionTitle>
        <HouseList
          houses={filteredHouses}
          loading={housesLoading}
          error={housesError}
          onRetry={reloadAll}
          emptyMessage={
            query
              ? 'No se encontraron casas.'
              : showFavoritesOnly
                ? 'Aún no tienes casas favoritas.'
                : 'No hay casas disponibles.'
          }
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onShowDetails={openDetails}
        />
      </section>

      <section id="libros">
        <SectionTitle>Libros</SectionTitle>
        <BookList
          books={filteredBooks}
          loading={booksLoading}
          error={booksError}
          onRetry={reloadAll}
          emptyMessage={
            query
              ? 'No se encontraron libros.'
              : showFavoritesOnly
                ? 'Aún no tienes libros favoritos.'
                : 'No hay libros disponibles.'
          }
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onShowDetails={openDetails}
        />
      </section>
      {selectedItem && (
        <DetailModal selection={selectedItem} onClose={closeDetails} />
      )}
    </AppLayout>
  );
}

export default App;