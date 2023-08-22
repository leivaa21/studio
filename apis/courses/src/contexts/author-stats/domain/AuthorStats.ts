import { AuthorId } from '../../courses/domain/AuthorId';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { AuthorStatNumber } from './AuthorStatNumber';

export interface AuthorStatsPrimitives {
  authorId: string;
  coursesCreated: number;
  lessonsCreated: number;
  coursesPublished: number;
  subscriptionsToOwnCourses: number;
  currentCourses: number;
  currentLessons: number;
  currentCoursesPublished: number;
  currentSubscriptionsToOwnCourses: number;
}

export interface AuthorStatsParams {
  authorId: AuthorId;
  coursesCreated: AuthorStatNumber;
  lessonsCreated: AuthorStatNumber;
  coursesPublished: AuthorStatNumber;
  subscriptionsToOwnCourses: AuthorStatNumber;
  currentCourses: AuthorStatNumber;
  currentLessons: AuthorStatNumber;
  currentCoursesPublished: AuthorStatNumber;
  currentSubscriptionsToOwnCourses: AuthorStatNumber;
}

export class AuthorStats extends AggregateRoot {
  public readonly authorId: AuthorId;
  private _coursesCreated: AuthorStatNumber;
  private _lessonsCreated: AuthorStatNumber;
  private _coursesPublished: AuthorStatNumber;
  private _subscriptionsToOwnCourses: AuthorStatNumber;
  private _currentCourses: AuthorStatNumber;
  private _currentLessons: AuthorStatNumber;
  private _currentCoursesPublished: AuthorStatNumber;
  private _currentSubscriptionsToOwnCourses: AuthorStatNumber;

  constructor({
    authorId,
    coursesCreated,
    lessonsCreated,
    coursesPublished,
    subscriptionsToOwnCourses,
    currentCourses,
    currentLessons,
    currentCoursesPublished,
    currentSubscriptionsToOwnCourses,
  }: AuthorStatsParams) {
    super();
    this.authorId = authorId;
    this._coursesCreated = coursesCreated;
    this._lessonsCreated = lessonsCreated;
    this._coursesPublished = coursesPublished;
    this._subscriptionsToOwnCourses = subscriptionsToOwnCourses;
    this._currentCourses = currentCourses;
    this._currentLessons = currentLessons;
    this._currentCoursesPublished = currentCoursesPublished;
    this._currentSubscriptionsToOwnCourses = currentSubscriptionsToOwnCourses;
  }

  static new({ authorId }: { authorId: AuthorId }): AuthorStats {
    return new AuthorStats({
      authorId,
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

  public increaseCoursesCreated() {
    this._coursesCreated = this._coursesCreated.increase();
    this._currentCourses = this._currentCourses.increase();
  }

  public increaseLessonsCreated() {
    this._lessonsCreated = this._lessonsCreated.increase();
    this._currentLessons = this._currentLessons.increase();
  }

  public decreaseCurrentLessons() {
    this._currentLessons = this._currentLessons.decrease();
  }

  public increaseCoursesPublished() {
    this._coursesPublished = this._coursesPublished.increase();
    this._currentCoursesPublished = this._currentCoursesPublished.increase();
  }

  public decreaseCurrentCoursesPublished() {
    this._currentCoursesPublished = this._currentCoursesPublished.decrease();
  }

  public increaseCourseSubscriptionsForOwnCourses() {
    this._subscriptionsToOwnCourses =
      this._subscriptionsToOwnCourses.increase();
    this._currentSubscriptionsToOwnCourses =
      this._currentSubscriptionsToOwnCourses.increase();
  }

  static fromPrimitives(primitives: AuthorStatsPrimitives): AuthorStats {
    return new AuthorStats({
      authorId: AuthorId.of(primitives.authorId),
      coursesCreated: AuthorStatNumber.of(primitives.coursesCreated),
      lessonsCreated: AuthorStatNumber.of(primitives.lessonsCreated),
      coursesPublished: AuthorStatNumber.of(primitives.coursesPublished),
      subscriptionsToOwnCourses: AuthorStatNumber.of(
        primitives.subscriptionsToOwnCourses
      ),
      currentCourses: AuthorStatNumber.of(primitives.currentCourses),
      currentLessons: AuthorStatNumber.of(primitives.currentLessons),
      currentCoursesPublished: AuthorStatNumber.of(
        primitives.currentCoursesPublished
      ),
      currentSubscriptionsToOwnCourses: AuthorStatNumber.of(
        primitives.currentSubscriptionsToOwnCourses
      ),
    });
  }

  public toPrimitives(): AuthorStatsPrimitives {
    return {
      authorId: this.authorId.value,
      coursesCreated: this._coursesCreated.value,
      lessonsCreated: this._lessonsCreated.value,
      coursesPublished: this._coursesPublished.value,
      subscriptionsToOwnCourses: this._subscriptionsToOwnCourses.value,
      currentCourses: this._currentCourses.value,
      currentLessons: this._currentLessons.value,
      currentCoursesPublished: this._currentCoursesPublished.value,
      currentSubscriptionsToOwnCourses:
        this._currentSubscriptionsToOwnCourses.value,
    };
  }
}
