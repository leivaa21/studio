import React from 'react';

import styles from './stats.module.scss';
import { BiBookAdd, BiCheck, BiWorld } from 'react-icons/bi';
import { BsFileTextFill, BsFillMortarboardFill } from 'react-icons/bs';

export const StatFieldIcons = {
  Check: <BiCheck className={styles.Icon} />,
  Subscriptions: <BsFillMortarboardFill className={styles.Icon} />,
  CreatedCourses: <BiBookAdd className={styles.Icon} />,
  CreatedLessons: <BsFileTextFill className={styles.Icon} />,
  Published: <BiWorld className={styles.Icon} />,
};

export interface StatFieldParams {
  Icon: JSX.Element;
  field: string;
  value: string;
}

export function StatField({ Icon, field, value }: StatFieldParams) {
  return (
    <div className={styles.StatField}>
      {Icon}
      <span className={styles.field}>{field}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
