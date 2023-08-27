import { useErrorBoundary } from 'react-error-boundary';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { CurrentCourseStatsResponse } from '@studio/commons';

import styles from './course.module.scss';

import { getCourseStats } from '../../../contexts/course-stats/application/GetCourseStats';

export interface CurrentCourseStatsParams {
  courseId: string;
}

export function CurrentCourseStatsView({ courseId }: CurrentCourseStatsParams) {
  const [courseStats, setCourseStats] = useState<CurrentCourseStatsResponse>();

  const { showBoundary } = useErrorBoundary();

  const fetchData = useCallback(async () => {
    if (!courseId) return;

    try {
      const course = await getCourseStats(courseId);
      setCourseStats(course);
    } catch (err) {
      showBoundary(err);
    }
  }, [courseId, showBoundary]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!courseStats) return <Fragment />;

  return (
    <div className={styles.coursePreview}>
      <div className={styles.propertyRow}>
        <h4 className={styles.propertyName}>Subscriptions</h4>
        <span className={styles.propertyValue}>
          {courseStats.currentSubscriptions}
        </span>
      </div>
      <div className={styles.propertyRow}>
        <h4 className={styles.propertyName}>Times completed</h4>
        <span className={styles.propertyValue}>
          {courseStats.currentTimesCompleted}
        </span>
      </div>
    </div>
  );
}
