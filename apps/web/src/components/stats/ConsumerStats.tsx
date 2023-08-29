import { CurrentConsumerStatsResponse } from '@studio/commons';

import { StatField, StatFieldIcons } from './StatField';

import styles from './stats.module.scss';

export function CurrentConsumerStatsView({
  stats,
}: {
  stats: CurrentConsumerStatsResponse;
}) {
  return (
    <div className={styles.stats}>
      <h3>Consumer Stats</h3>
      <StatField
        Icon={StatFieldIcons.Subscriptions}
        field="Subscribed Courses"
        value={stats.currentSubscribedCourses.toString()}
      />
      <StatField
        Icon={StatFieldIcons.Check}
        field="Completed Courses"
        value={stats.currentCompletedCourses.toString()}
      />
    </div>
  );
}
