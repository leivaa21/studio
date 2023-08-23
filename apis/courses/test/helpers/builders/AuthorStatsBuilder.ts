import { AuthorStatNumber } from '../../../src/contexts/author-stats/domain/AuthorStatNumber';
import { AuthorStats } from '../../../src/contexts/author-stats/domain/AuthorStats';
import { AuthorId } from '../../../src/contexts/courses/domain/AuthorId';
import { Builder } from './builder';

export class AuthorStatsBuilder implements Builder<AuthorStats> {
  private authorId?: AuthorId;
  private coursesPublished?: AuthorStatNumber;
  private lessonsCreated?: AuthorStatNumber;
  private subscriptionsToOwnCourses?: AuthorStatNumber;

  build(): AuthorStats {
    return new AuthorStats({
      authorId: this.authorId || AuthorId.random(),
      coursesCreated: AuthorStatNumber.of(0),
      lessonsCreated: this.lessonsCreated || AuthorStatNumber.of(0),
      coursesPublished: this.coursesPublished || AuthorStatNumber.of(0),
      subscriptionsToOwnCourses:
        this.subscriptionsToOwnCourses || AuthorStatNumber.of(0),
      currentCourses: AuthorStatNumber.of(0),
      currentLessons: this.lessonsCreated || AuthorStatNumber.of(0),
      currentCoursesPublished: this.coursesPublished || AuthorStatNumber.of(0),
      currentSubscriptionsToOwnCourses:
        this.subscriptionsToOwnCourses || AuthorStatNumber.of(0),
    });
  }

  withAuthorId(authorId: AuthorId): AuthorStatsBuilder {
    this.authorId = authorId;
    return this;
  }

  withLessonsCreated(stat: AuthorStatNumber): AuthorStatsBuilder {
    this.lessonsCreated = stat;
    return this;
  }

  withCoursesPublished(stat: AuthorStatNumber): AuthorStatsBuilder {
    this.coursesPublished = stat;
    return this;
  }

  withSubscriptionsToOwnCourses(stat: AuthorStatNumber): AuthorStatsBuilder {
    this.subscriptionsToOwnCourses = stat;
    return this;
  }
}
