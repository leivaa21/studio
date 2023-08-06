import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import {
  CheckIfUserIsSubscribedToCourse,
  CheckIfUserIsSubscribedToCourseQuery,
} from '../../../../../../src/contexts/course-subscriptions/application/queries/CheckIfUserIsSubscribedToCourse';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { UserId } from '../../../../../../src/contexts/course-subscriptions/domain/UserId';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';

describe('Check if use is subscribed to course', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should return true if user is subscribed', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();
    const userId = UserId.random();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(course.id)
      .withUserId(userId)
      .build();

    const query = new CheckIfUserIsSubscribedToCourseQuery({
      userId: userId.value,
      courseId: course.id.value,
    });

    const useCase = new CheckIfUserIsSubscribedToCourse(
      courseSubscriptionRepository
    );

    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(
      courseSubscription
    );

    await expect(useCase.execute(query)).resolves.toStrictEqual({
      isSubscribed: true,
    });
  });

  it('Should return false if user is not subscribed', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();
    const userId = UserId.random();

    const query = new CheckIfUserIsSubscribedToCourseQuery({
      userId: userId.value,
      courseId: course.id.value,
    });

    const useCase = new CheckIfUserIsSubscribedToCourse(
      courseSubscriptionRepository
    );

    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(null);

    await expect(useCase.execute(query)).resolves.toStrictEqual({
      isSubscribed: false,
    });
  });
});
