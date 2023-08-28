import { useErrorBoundary } from 'react-error-boundary';
import { Fragment, useCallback, useEffect, useState } from 'react';

import { CurrentCourseStatsResponse } from '@studio/commons';

import styles from './course.module.scss';

import { getCourseStats } from '../../../contexts/course-stats/application/GetCourseStats';
import { StatField, StatFieldIcons } from '../../stats/StatField';

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
    <div className={styles.stats}>
      <StatField
        Icon={StatFieldIcons.Subscriptions}
        field="Subscriptions"
        value={courseStats.currentSubscriptions.toString()}
      />
      <StatField
        Icon={StatFieldIcons.Check}
        field="Times Completed"
        value={courseStats.currentTimesCompleted.toString()}
      />
    </div>
  );
}
