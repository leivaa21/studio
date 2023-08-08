import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import {
  GetCourseSubscriptionByUserAndCourse,
  GetCourseSubscriptionByUserAndCourseQuery,
} from '../../../../../../src/contexts/course-subscriptions/application/queries/GetCourseSubscriptionByUserAndCourse';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';
import { CourseSubscriptionNotFoundError } from '../../../../../../src/contexts/course-subscriptions/domain/errors/CourseSubscriptionNotFoundError';

describe('Get course subscription by user and course', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should return course subscriptions if found', async () => {
    const courseSubscription = new CourseSubscriptionBuilder().build();

    const query = new GetCourseSubscriptionByUserAndCourseQuery({
      userId: courseSubscription.userId.value,
      courseId: courseSubscription.courseId.value,
    });

    const useCase = new GetCourseSubscriptionByUserAndCourse(
      courseSubscriptionRepository
    );

    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(
      courseSubscription
    );

    const courseSubscriptionsFromUseCase = await useCase.execute(query);

    expect(courseSubscriptionsFromUseCase.toPrimitives()).toStrictEqual(
      courseSubscription.toPrimitives()
    );
  });

  it('Should throw not found error if not found', async () => {
    const courseSubscription = new CourseSubscriptionBuilder().build();

    const query = new GetCourseSubscriptionByUserAndCourseQuery({
      userId: courseSubscription.userId.value,
      courseId: courseSubscription.courseId.value,
    });

    const useCase = new GetCourseSubscriptionByUserAndCourse(
      courseSubscriptionRepository
    );

    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(null);

    expect(useCase.execute(query)).rejects.toThrow(
      CourseSubscriptionNotFoundError
    );
  });
});
