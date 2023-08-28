import { CourseId } from '../../courses/domain/CourseId';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { CourseStatNumber } from './CourseStatNumber';

export interface CourseStatsPrimitives {
  courseId: string;
  subscriptions: number;
  timesCompleted: number;
  currentSubscriptions: number;
  currentTimesCompleted: number;
}

export interface CourseStatsParams {
  courseId: CourseId;
  subscriptions: CourseStatNumber;
  timesCompleted: CourseStatNumber;
  currentSubscriptions: CourseStatNumber;
  currentTimesCompleted: CourseStatNumber;
}

export class CourseStats extends AggregateRoot {
  public readonly courseId: CourseId;
  private _subscriptions: CourseStatNumber;
  private _timesCompleted: CourseStatNumber;
  private _currentSubscriptions: CourseStatNumber;
  private _currentTimesCompleted: CourseStatNumber;

  constructor({
    courseId,
    subscriptions,
    timesCompleted,
    currentSubscriptions,
    currentTimesCompleted,
  }: CourseStatsParams) {
    super();
    this.courseId = courseId;
    this._subscriptions = subscriptions;
    this._timesCompleted = timesCompleted;
    this._currentSubscriptions = currentSubscriptions;
    this._currentTimesCompleted = currentTimesCompleted;
  }

  static new({ courseId }: { courseId: CourseId }): CourseStats {
    return new CourseStats({
      courseId,
      subscriptions: CourseStatNumber.of(0),
      timesCompleted: CourseStatNumber.of(0),
      currentSubscriptions: CourseStatNumber.of(0),
      currentTimesCompleted: CourseStatNumber.of(0),
    });
  }

  public increaseSubscriptions() {
    this._subscriptions = this._subscriptions.increase();
    this._currentSubscriptions = this._currentSubscriptions.increase();
  }

  public decreaseCurrentSubscriptions() {
    this._currentSubscriptions = this._currentSubscriptions.decrease();
  }

  public increaseTimesCompleted() {
    this._timesCompleted = this._timesCompleted.increase();
    this._currentTimesCompleted = this._currentTimesCompleted.increase();
  }

  public decreaseCurrentTimesCompleted() {
    this._currentTimesCompleted = this._currentTimesCompleted.decrease();
  }

  get currentSubscriptions() {
    return this._currentSubscriptions;
  }

  get currentTimesCompleted() {
    return this._currentTimesCompleted;
  }

  static fromPrimitives(primitives: CourseStatsPrimitives): CourseStats {
    return new CourseStats({
      courseId: CourseId.of(primitives.courseId),
      subscriptions: CourseStatNumber.of(primitives.subscriptions),
      timesCompleted: CourseStatNumber.of(primitives.timesCompleted),
      currentSubscriptions: CourseStatNumber.of(
        primitives.currentSubscriptions
      ),
      currentTimesCompleted: CourseStatNumber.of(
        primitives.currentTimesCompleted
      ),
    });
  }

  public toPrimitives(): CourseStatsPrimitives {
    return {
      courseId: this.courseId.value,
      subscriptions: this._subscriptions.value,
      timesCompleted: this._timesCompleted.value,
      currentSubscriptions: this._currentSubscriptions.value,
      currentTimesCompleted: this._currentTimesCompleted.value,
    };
  }
}
