import { BsCheck } from 'react-icons/bs';

import styles from '../courses.module.scss';
import Link from 'next/link';

export function CompletedMark({ courseId }: { courseId: string }) {
  return (
    <Link href={`/pdf/${courseId}`}>
      <span className={styles.completedMark}>
        Completed! <BsCheck />{' '}
      </span>
    </Link>
  );
}
