import { useEffect, useRef, useState } from 'react';
import { fetchEntityDetails } from '../../services/api';

const detailLabels = {
  character: 'Detalle del personaje',
  house: 'Detalle de la casa',
  book: 'Detalle del libro',
};

const getBasicDetails = (type, item) => {
  if (type === 'character') {
    return [
      ['Título', item.title],
      ['Casa', item.family],
    ];
  }

  if (type === 'house') {
    return [
      ['Región', item.region],
      ['Lema', item.words],
    ];
  }

  return [
    ['Autor', item.authors],
    ['Fecha de publicación', item.released],
    ['Número de páginas', item.pages],
  ];
};

export const DetailModal = ({ selection, onClose }) => {
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);
  const { type, item } = selection;
  const selectionKey = `${type}:${item.id}`;
  const [detailState, setDetailState] = useState(null);
  const currentDetailState = detailState?.key === selectionKey
    ? detailState
    : { loading: true, fields: null, error: null };

  useEffect(() => {
    const controller = new AbortController();
    closeButtonRef.current?.focus();
    fetchEntityDetails(type, item, controller.signal)
      .then((fields) => {
        setDetailState({ key: selectionKey, loading: false, fields, error: null });
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setDetailState({
            key: selectionKey,
            loading: false,
            fields: null,
            error: error instanceof Error
              ? error.message
              : 'No se pudieron cargar los detalles adicionales.',
          });
        }
      });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      controller.abort();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose, selectionKey, type]);

  return (
    <div
      className="detail-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={modalRef}
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <button
          ref={closeButtonRef}
          className="detail-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha"
        >
          ×
        </button>
        <p className="detail-modal__eyebrow">{detailLabels[type]}</p>
        <h2 id="detail-title">
          {item.name}
        </h2>
        {type === 'character' && item.image && (
          <img
            className="detail-modal__image"
            src={item.image}
            alt={item.name}
          />
        )}
        <dl className="detail-modal__fields">
          {getBasicDetails(type, item).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || 'Sin información'}</dd>
            </div>
          ))}
          {currentDetailState.loading && (
            <p className="detail-modal__status" role="status">
              Cargando información ampliada...
            </p>
          )}
          {currentDetailState.error && (
            <p className="detail-modal__status detail-modal__status--error" role="status">
              {currentDetailState.error}
            </p>
          )}
          {!currentDetailState.loading &&
            !currentDetailState.error &&
            currentDetailState.fields?.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  {Array.isArray(value)
                    ? value.filter(Boolean).join(', ') || 'Sin información'
                    : value || 'Sin información'}
                </dd>
              </div>
            ))}
          {!currentDetailState.loading &&
            !currentDetailState.error &&
            !currentDetailState.fields && (
              <p className="detail-modal__status">
                La API no tiene más datos disponibles para esta ficha.
              </p>
            )}
        </dl>
      </section>
    </div>
  );
};
