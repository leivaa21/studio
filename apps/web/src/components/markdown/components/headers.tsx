import { HTMLAttributes } from 'react';

import styles from './mdxComponents.module.scss';

export function Header1(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={`${styles.heading} ${styles['heading--h1']}`} {...props} />
  );
}

export function Header2(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`${styles.heading} ${styles['heading--h2']}`} {...props} />
  );
}

export function Header3(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4 className={`${styles.heading} ${styles['heading--h3']}`} {...props} />
  );
}

export function Header4(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={`${styles.heading} ${styles['heading--h4']}`} {...props} />
  );
}

export function Header5(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h6 className={`${styles.heading} ${styles['heading--h5']}`} {...props} />
  );
}

export function Header6(props: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h6 className={`${styles.heading} ${styles['heading--h6']}`} {...props} />
  );
}
