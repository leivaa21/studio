import Image from 'next/image';
import { useEffect, useState } from 'react';
import { internalApiClient } from '../../lib/InternalApiClient';
import styles from './auth.module.scss';

export function GithubAuthButton() {
  const [githubUrl, setGithubUrl] = useState<string>();

  useEffect(() => {
    internalApiClient
      .get<{ url: string }>('/api/auth/github/url')
      .then((response) => setGithubUrl(response.url));
  }, []);

  return (
    <a href={githubUrl} className={styles['auth-icon']}>
      <Image src={'/icons/github.svg'} alt="Sign in with github" fill />
    </a>
  );
}
