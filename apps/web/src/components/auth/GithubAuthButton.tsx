import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useErrorBoundary } from 'react-error-boundary';

import { internalApiClient } from '../../lib/InternalApiClient';
import styles from './auth.module.scss';

export function GithubAuthButton() {
  const [githubUrl, setGithubUrl] = useState<string>();

  const { showBoundary } = useErrorBoundary();

  const fetch = useCallback(async () => {
    try {
      const response = await internalApiClient.get<{ url: string }>(
        '/api/auth/github/url'
      );
      setGithubUrl(response.url);
    } catch (err) {
      showBoundary(err);
    }
  }, [showBoundary]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return (
    <a href={githubUrl} className={styles['auth-icon']}>
      <Image src={'/icons/github.svg'} alt="Sign in with github" fill />
    </a>
  );
}
