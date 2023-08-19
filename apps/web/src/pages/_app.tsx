import { ErrorBoundary } from 'react-error-boundary';
import { ShowErrorBoundary } from '../components/ErrorBoundary';
import '../styles/globals.scss';
import '../styles/rewriteMdxStyles.scss';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ShowErrorBoundary}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
