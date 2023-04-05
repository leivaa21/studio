import { GithubAuthButton } from './GithubAuthButton';
import { GoogleAuthButton } from './GoogleAuthButton';
import styles from './auth.module.scss';

export function OAuthIcons() {
  return (
    <div className={styles.icons}>
      <GoogleAuthButton />
      <GithubAuthButton />
    </div>
  );
}
