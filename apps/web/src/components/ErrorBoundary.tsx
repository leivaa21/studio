import { FallbackProps } from 'react-error-boundary';

export function ShowErrorBoundary(props: FallbackProps) {
  const { error, resetErrorBoundary } = props;

  return (
    <div>
      <div>
        <h1>Error!! 🌍</h1>
        <p>{error.message}</p>
        <button className="mt-4" onClick={resetErrorBoundary}>
          Reload Page
        </button>
      </div>
    </div>
  );
}
