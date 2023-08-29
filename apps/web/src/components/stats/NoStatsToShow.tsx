import styles from './stats.module.scss';

export function NoStatsToShow({ message }: { message: string }) {
  return (
    <div className={styles.stats}>
      <h3>{message}</h3>
    </div>
  );
}
