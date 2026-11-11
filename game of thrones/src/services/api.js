
const ICE_FIRE = 'https://anapioficeandfire.com/api';
const THRONES = 'https://thronesapi.com/api/v2';

const normalizeName = (value) =>
  value.trim().replace(/^House /i, '').toLocaleLowerCase();

const fetchJson = async (url, signal) => {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con el servicio. Comprueba tu conexión e inténtalo de nuevo.',
        { cause: error },
      );
    }
    throw error;
  }
  if (!response.ok) {
    throw new Error(`No se pudieron consultar los detalles (${response.status}).`);
  }
  return response.json();
};

export const fetchEntityDetails = async (type, item, signal) => {
  if (type === 'character') {
    const url = new URL(`${ICE_FIRE}/characters`);
    url.searchParams.set('name', item.name);
    const characters = await fetchJson(url, signal);
    const character = characters.find(
      (entry) => normalizeName(entry.name) === normalizeName(item.name),
    );

    if (!character) return null;

    return [
      ['Género', character.gender],
      ['Cultura', character.culture],
      ['Nacimiento', character.born || ''],
      ['Fallecimiento', character.died || ''],
      ['Otros nombres', character.aliases || []],
      ['Otros títulos', character.titles || []],
      ['Series', character.tvSeries || []],
      ['Interpretado por', character.playedBy || []],
      ['Libros', character.books?.length ?? 0],
      ['Libros donde es protagonista', character.povBooks?.length ?? 0],
      ['Casas a las que pertenece', character.allegiances?.length ?? 0],
    ];
  }

  const collection = type === 'house' ? 'houses' : 'books';
  const detail = await fetchJson(`${ICE_FIRE}/${collection}/${item.id}`, signal);

  if (type === 'house') {
    return [
      ['Escudo', detail.coatOfArms || ''],
      ['Títulos', detail.titles || []],
      ['Residencias', detail.seats || []],
      ['Fundación', detail.founded || ''],
      ['Extinción', detail.diedOut || ''],
      ['Armas ancestrales', detail.ancestralWeapons || []],
      ['Ramas cadetes', detail.cadetBranches?.length ?? 0],
      ['Miembros que juraron lealtad', detail.swornMembers?.length ?? 0],
    ];
  }

  return [
    ['ISBN', detail.isbn],
    ['Editorial', detail.publisher],
    ['País', detail.country || ''],
    ['Formato', detail.mediaType || ''],
    ['Personajes', detail.characters?.length ?? 0],
    ['Personajes con capítulos desde su punto de vista', detail.povCharacters?.length ?? 0],
  ];
};

export const fetchBooks = async () => {
  const res = await fetch(`${ICE_FIRE}/books?page=1&pageSize=12`);
  if (!res.ok) throw new Error('No se pudieron cargar los libros.');
  const data = await res.json();
  return data.map((b) => ({
    id: b.url.split('/').pop(),
    name: b.name,
    authors: b.authors.join(', '),
    released: b.released,
    pages: b.numberOfPages,
  }));
};

export const fetchHouses = async () => {
  const res = await fetch(`${ICE_FIRE}/houses?page=1&pageSize=12`);
  if (!res.ok) throw new Error('No se pudieron cargar las casas.');
  const data = await res.json();
  return data.map((h) => ({
    id: h.url.split('/').pop(),
    name: h.name,
    region: h.region || 'Unknown',
    words: h.words || 'No words',
  }));
};

export const fetchCharacters = async () => {
  const res = await fetch(`${THRONES}/Characters`);
  if (!res.ok) throw new Error('No se pudieron cargar los personajes.');
  const data = await res.json();
  return data.map((c) => ({
    id: c.id,
    name: c.fullName,
    title: c.title,
    family: c.family || 'No house',
    image: c.imageUrl,
  }));
};