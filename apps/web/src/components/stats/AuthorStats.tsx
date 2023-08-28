import { CurrentAuthorStatsResponse } from '@studio/commons';

import { StatField, StatFieldIcons } from './StatField';

import styles from './stats.module.scss';

export function CurrentAuthorStatsView({
  stats,
}: {
  stats: CurrentAuthorStatsResponse;
}) {
  return (
    <div className={styles.stats}>
      <h3>Author Stats</h3>
      <StatField
        Icon={StatFieldIcons.CreatedCourses}
        field="Created courses"
        value={stats.currentCourses.toString()}
      />
      <StatField
        Icon={StatFieldIcons.CreatedLessons}
        field="Created lessons"
        value={stats.currentLessons.toString()}
      />
      <StatField
        Icon={StatFieldIcons.Published}
        field="Published Courses"
        value={stats.currentCoursesPublished.toString()}
      />
      <StatField
        Icon={StatFieldIcons.Subscriptions}
        field="Subscriptions to own courses"
        value={stats.currentSubscriptionsToOwnCourses.toString()}
      />
    </div>
  );
}
