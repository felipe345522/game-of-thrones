export const ErrorMessage = ({ message, onRetry }) => (
  <div className="error">
    <p> {message}</p>
    {onRetry && <button onClick={onRetry}>Reintentar</button>}
  </div>
);