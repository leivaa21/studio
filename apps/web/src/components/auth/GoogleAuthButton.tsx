import Image from 'next/image';
import { useEffect, useState } from 'react';
import { internalApiClient } from '../../lib/InternalApiClient';
import styles from './auth.module.scss';

export function GoogleAuthButton() {
  const [googleUrl, setGoogleUrl] = useState<string>();

  useEffect(() => {
    internalApiClient
      .get<{ url: string }>('/api/auth/google/url')
      .then((response) => setGoogleUrl(response.url));
  }, []);

  return (
    <a href={googleUrl} className={styles['auth-icon']}>
      <Image src={'/icons/google.svg'} alt="Sign in with google" fill />
    </a>
  );
}
