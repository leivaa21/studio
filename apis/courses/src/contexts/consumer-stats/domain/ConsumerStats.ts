import { UserId } from '../../course-subscriptions/domain/UserId';
import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { ConsumerStatNumber } from './ConsumerStatNumber';

export interface ConsumerStatsPrimitives {
  userId: string;
  subscribedCourses: number;
  completedCourses: number;
  currentSubscribedCourses: number;
  currentCompletedCourses: number;
}

export interface ConsumerStatsParams {
  userId: UserId;
  subscribedCourses: ConsumerStatNumber;
  completedCourses: ConsumerStatNumber;
  currentSubscribedCourses: ConsumerStatNumber;
  currentCompletedCourses: ConsumerStatNumber;
}

export class ConsumerStats extends AggregateRoot {
  public readonly userId: UserId;
  private _subscribedCourses: ConsumerStatNumber;
  private _completedCourses: ConsumerStatNumber;
  private _currentSubscribedCourses: ConsumerStatNumber;
  private _currentCompletedCourses: ConsumerStatNumber;

  constructor({
    userId,
    subscribedCourses,
    completedCourses,
    currentSubscribedCourses,
    currentCompletedCourses,
  }: ConsumerStatsParams) {
    super();
    this.userId = userId;
    this._subscribedCourses = subscribedCourses;
    this._completedCourses = completedCourses;
    this._currentSubscribedCourses = currentSubscribedCourses;
    this._currentCompletedCourses = currentCompletedCourses;
  }

  static new({ userId }: { userId: UserId }): ConsumerStats {
    return new ConsumerStats({
      userId: userId,
      subscribedCourses: ConsumerStatNumber.of(0),
      completedCourses: ConsumerStatNumber.of(0),
      currentSubscribedCourses: ConsumerStatNumber.of(0),
      currentCompletedCourses: ConsumerStatNumber.of(0),
    });
  }

  public increaseSubscribedCourses() {
    this._subscribedCourses = this._subscribedCourses.increase();
    this._currentSubscribedCourses = this._currentSubscribedCourses.increase();
  }

  public decreaseSubscribedCourses() {
    this._currentSubscribedCourses = this._currentSubscribedCourses.decrease();
  }

  public increaseCompletedCourses() {
    this._completedCourses = this._completedCourses.increase();
    this._currentCompletedCourses = this._currentCompletedCourses.increase();
  }

  public decreaseCompletedCourses() {
    this._currentCompletedCourses = this._currentCompletedCourses.decrease();
  }

  get currentSubscribedCourses() {
    return this._currentSubscribedCourses;
  }

  get currentCompletedCourses() {
    return this._currentCompletedCourses;
  }

  static fromPrimitives(primitives: ConsumerStatsPrimitives): ConsumerStats {
    return new ConsumerStats({
      userId: UserId.of(primitives.userId),
      subscribedCourses: ConsumerStatNumber.of(primitives.subscribedCourses),
      completedCourses: ConsumerStatNumber.of(primitives.completedCourses),
      currentSubscribedCourses: ConsumerStatNumber.of(
        primitives.currentSubscribedCourses
      ),
      currentCompletedCourses: ConsumerStatNumber.of(
        primitives.currentCompletedCourses
      ),
    });
  }

  public toPrimitives(): ConsumerStatsPrimitives {
    return {
      userId: this.userId.value,
      subscribedCourses: this._subscribedCourses.value,
      completedCourses: this._completedCourses.value,
      currentSubscribedCourses: this._currentSubscribedCourses.value,
      currentCompletedCourses: this._currentCompletedCourses.value,
    };
  }
}
