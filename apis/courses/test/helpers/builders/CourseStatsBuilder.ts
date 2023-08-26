import { CourseStats } from '../../../src/contexts/course-stats/domain/CourseStats';
import { CourseStatNumber } from '../../../src/contexts/course-stats/domain/CourseStatNumber';
import { CourseId } from '../../../src/contexts/courses/domain/CourseId';
import { Builder } from './builder';

export class CourseStatsBuilder implements Builder<CourseStats> {
  private courseId?: CourseId;
  private subscriptions?: CourseStatNumber;
  private timesCompleted?: CourseStatNumber;

  build(): CourseStats {
    return new CourseStats({
      courseId: this.courseId || CourseId.random(),
      subscriptions: this.subscriptions || CourseStatNumber.of(0),
      timesCompleted: this.timesCompleted || CourseStatNumber.of(0),
      currentSubscriptions: this.subscriptions || CourseStatNumber.of(0),
      currentTimesCompleted: this.timesCompleted || CourseStatNumber.of(0),
    });
  }

  withCourseId(courseId: CourseId): CourseStatsBuilder {
    this.courseId = courseId;
    return this;
  }

  withSubscriptions(stat: CourseStatNumber): CourseStatsBuilder {
    this.subscriptions = stat;
    return this;
  }

  withTimesCompleted(stat: CourseStatNumber): CourseStatsBuilder {
    this.timesCompleted = stat;
    return this;
  }
}
