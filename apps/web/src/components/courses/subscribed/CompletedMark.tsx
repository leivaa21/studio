import { BsCheck } from 'react-icons/bs';

import styles from '../courses.module.scss';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { Modal } from '@studio/ui/components/modal';
import dynamic from 'next/dynamic';

const CompletedCourseCertificateLink = dynamic(
  () => import('../../../components/pdf/completed-course-certificate'),
  { ssr: false }
);

export function CompletedMark({ courseId }: { courseId: string }) {
  const [modalShown, setModalShown] = useState<boolean>(false);

  const closeFunction = () => setModalShown(false);

  return (
    <Fragment>
      <button
        className={styles.completedMark}
        onClick={() => setModalShown(true)}
      >
        Completed! <BsCheck />{' '}
      </button>
      <Modal
        title="Download Certificate"
        isShown={modalShown}
        closeFunction={closeFunction}
      >
        <div className={styles.downloadCertificateModal}>
          <CompletedCourseCertificateLink
            onClick={closeFunction}
            courseId={courseId}
          />
        </div>
      </Modal>
    </Fragment>
  );
}

export function OldCompletedMark({ courseId }: { courseId: string }) {
  return (
    <Link href={`/pdf/${courseId}`}>
      <span className={styles.completedMark}>
        Completed! <BsCheck />{' '}
      </span>
    </Link>
  );
}
