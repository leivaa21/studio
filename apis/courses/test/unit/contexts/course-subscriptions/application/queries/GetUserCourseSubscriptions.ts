import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import {
  GetUserCourseSubscriptions,
  GetUserCourseSubscriptionsQuery,
} from '../../../../../../src/contexts/course-subscriptions/application/queries/GetUserCourseSubscriptions';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { UserId } from '../../../../../../src/contexts/course-subscriptions/domain/UserId';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';

describe('Get all user course subscriptions', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should return all user course subscriptions', async () => {
    const userId = UserId.random();
    const userCourseSubscriptions = [
      new CourseSubscriptionBuilder().withUserId(userId).build(),
      new CourseSubscriptionBuilder().withUserId(userId).build(),
      new CourseSubscriptionBuilder().withUserId(userId).build(),
    ];

    const query = new GetUserCourseSubscriptionsQuery({
      userId: userId.value,
    });

    const useCase = new GetUserCourseSubscriptions(
      courseSubscriptionRepository
    );

    courseSubscriptionRepository.findByUser.mockResolvedValue(
      userCourseSubscriptions
    );

    const userCourseSubscriptionsFromUseCase = await useCase.execute(query);

    expect(userCourseSubscriptionsFromUseCase).toHaveLength(3);
  });
});
