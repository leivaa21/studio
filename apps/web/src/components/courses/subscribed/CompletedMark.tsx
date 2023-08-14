import { BsCheck } from 'react-icons/bs';

import styles from '../courses.module.scss';

export function CompletedMark() {
  return (
    <span className={styles.completedMark}>
      Completed! <BsCheck />{' '}
    </span>
  );
}
