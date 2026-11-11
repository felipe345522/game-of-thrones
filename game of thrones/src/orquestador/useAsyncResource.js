import { useCallback, useEffect, useState } from 'react';

const getErrorMessage = (error) =>
  error instanceof TypeError
    ? 'No se pudo conectar con el servicio. Comprueba tu conexión e inténtalo de nuevo.'
    : error instanceof Error
      ? error.message
      : 'Ocurrió un error inesperado.';

export const useAsyncResource = (fetchResource) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setData(await fetchResource());
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  }, [fetchResource]);

  useEffect(() => {
    let active = true;

    Promise.resolve()
      .then(fetchResource)
      .then((resource) => {
        if (active) setData(resource);
      })
      .catch((caughtError) => {
        if (active) setError(getErrorMessage(caughtError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetchResource]);

  return { data, loading, error, reload };
};
