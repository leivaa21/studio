import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import {
  CreateCourseSubscription,
  CreateCourseSubscriptionCommand,
} from '../../../../../../src/contexts/course-subscriptions/application/commands/CreateCourseSubscription';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { UserId } from '../../../../../../src/contexts/course-subscriptions/domain/UserId';
import { CourseNotFoundError } from '../../../../../../src/contexts/courses/domain/errors/CourseNotFoundError';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';
import { InvalidCourseSubscriptionError } from '../../../../../../src/contexts/course-subscriptions/domain/errors/InvalidCourseSubscriptionError';

describe('Create new course subscription', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const courseRepository = mock<CourseRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(courseRepository);
    mockReset(eventBus);
  });

  it('Should create a new course subscription', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();
    const userId = UserId.random();

    const command = new CreateCourseSubscriptionCommand({
      userId: userId.value,
      courseId: course.id.value,
    });

    const useCase = new CreateCourseSubscription(
      courseSubscriptionRepository,
      courseRepository,
      eventBus
    );

    courseRepository.findById.mockResolvedValue(course);
    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(null);

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseSubscriptionRepository.create).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not create a course subscription if course do not exist', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();

    const userId = UserId.random();

    const command = new CreateCourseSubscriptionCommand({
      userId: userId.value,
      courseId: course.id.value,
    });

    const useCase = new CreateCourseSubscription(
      courseSubscriptionRepository,
      courseRepository,
      eventBus
    );

    courseRepository.findById.mockResolvedValue(null);
    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(CourseNotFoundError);
  });

  it('Should not create a course subscription if user is already subscribed to that course', async () => {
    const course = new CourseBuilder().withPublishedAt(new Date()).build();

    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(course.id)
      .build();

    const command = new CreateCourseSubscriptionCommand({
      userId: courseSubscription.userId.value,
      courseId: course.id.value,
    });

    const useCase = new CreateCourseSubscription(
      courseSubscriptionRepository,
      courseRepository,
      eventBus
    );

    courseRepository.findById.mockResolvedValue(course);
    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(
      courseSubscription
    );

    await expect(useCase.execute(command)).rejects.toThrow(
      InvalidCourseSubscriptionError
    );
  });

  it('Should not create a course subscription if course is not published', async () => {
    const course = new CourseBuilder().build();

    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(course.id)
      .build();

    const command = new CreateCourseSubscriptionCommand({
      userId: courseSubscription.userId.value,
      courseId: course.id.value,
    });

    const useCase = new CreateCourseSubscription(
      courseSubscriptionRepository,
      courseRepository,
      eventBus
    );

    courseRepository.findById.mockResolvedValue(course);
    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(
      InvalidCourseSubscriptionError
    );
  });
});
