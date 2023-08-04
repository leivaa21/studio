import { HTMLAttributes } from 'react';

import styles from './mdxComponents.module.scss';

export function Link(props: HTMLAttributes<HTMLAnchorElement>) {
  return <a className={styles.link} {...props} />;
}
