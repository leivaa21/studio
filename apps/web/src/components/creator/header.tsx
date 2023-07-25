import React from 'react';
import styles from './creator.module.scss';
export function CreatorHeader({ title }: { title: string }) {
  return (
    <section className={styles['header--section']}>
      <h2>{title}</h2>
    </section>
  );
}
