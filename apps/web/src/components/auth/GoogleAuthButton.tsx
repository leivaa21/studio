import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useErrorBoundary } from 'react-error-boundary';

import { internalApiClient } from '../../lib/InternalApiClient';
import styles from './auth.module.scss';

export function GoogleAuthButton() {
  const [googleUrl, setGoogleUrl] = useState<string>();

  const { showBoundary } = useErrorBoundary();

  const fetch = useCallback(async () => {
    try {
      const response = await internalApiClient.get<{ url: string }>(
        '/api/auth/google/url'
      );
      setGoogleUrl(response.url);
    } catch (err) {
      showBoundary(err);
    }
  }, [showBoundary]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <a href={googleUrl} className={styles['auth-icon']}>
      <Image src={'/icons/google.svg'} alt="Sign in with google" fill />
    </a>
  );
}
