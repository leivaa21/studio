import { ConsumerStatNumber } from '../../../src/contexts/consumer-stats/domain/ConsumerStatNumber';
import { ConsumerStats } from '../../../src/contexts/consumer-stats/domain/ConsumerStats';
import { UserId } from '../../../src/contexts/course-subscriptions/domain/UserId';
import { Builder } from './builder';

export class ConsumerStatsBuilder implements Builder<ConsumerStats> {
  private userId?: UserId;
  private subscribedCourses?: ConsumerStatNumber;
  private completedCourses?: ConsumerStatNumber;

  build(): ConsumerStats {
    return new ConsumerStats({
      userId: this.userId || UserId.random(),
      subscribedCourses: this.subscribedCourses || ConsumerStatNumber.of(0),
      completedCourses: this.completedCourses || ConsumerStatNumber.of(0),
      currentSubscribedCourses:
        this.subscribedCourses || ConsumerStatNumber.of(0),
      currentCompletedCourses:
        this.completedCourses || ConsumerStatNumber.of(0),
    });
  }

  withUserId(userId: UserId): ConsumerStatsBuilder {
    this.userId = userId;
    return this;
  }

  withSubcribedCourses(stat: ConsumerStatNumber): ConsumerStatsBuilder {
    this.subscribedCourses = stat;
    return this;
  }

  withCompletedCourses(stat: ConsumerStatNumber): ConsumerStatsBuilder {
    this.completedCourses = stat;
    return this;
  }
}
