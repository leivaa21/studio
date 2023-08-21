import { AuthorStatNumber } from '../../../src/contexts/author-stats/domain/AuthorStatNumber';
import { AuthorStats } from '../../../src/contexts/author-stats/domain/AuthorStats';
import { AuthorId } from '../../../src/contexts/courses/domain/AuthorId';
import { Builder } from './builder';

export class AuthorStatsBuilder implements Builder<AuthorStats> {
  build(): AuthorStats {
    return new AuthorStats({
      authorId: AuthorId.random(),
      coursesCreated: AuthorStatNumber.of(0),
      lessonsCreated: AuthorStatNumber.of(0),
      coursesPublished: AuthorStatNumber.of(0),
      subscriptionsToOwnCourses: AuthorStatNumber.of(0),
      currentCourses: AuthorStatNumber.of(0),
      currentLessons: AuthorStatNumber.of(0),
      currentCoursesPublished: AuthorStatNumber.of(0),
      currentSubscriptionsToOwnCourses: AuthorStatNumber.of(0),
    });
  }
}
