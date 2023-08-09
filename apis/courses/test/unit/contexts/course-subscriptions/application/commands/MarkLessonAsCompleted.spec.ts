import { mock, mockReset } from 'jest-mock-extended';
import {
  MarkLessonAsCompleted,
  MarkLessonAsCompletedCommand,
} from '../../../../../../src/contexts/course-subscriptions/application/commands/MarkLessonAsCompleted';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { UserId } from '../../../../../../src/contexts/course-subscriptions/domain/UserId';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import { LessonNotFoundError } from '../../../../../../src/contexts/lessons/domain/errors/LessonNotFoundError';
import { CourseSubscriptionNotFoundError } from '../../../../../../src/contexts/course-subscriptions/domain/errors/CourseSubscriptionNotFoundError';
import { UnableToCompleteLessonError } from '../../../../../../src/contexts/course-subscriptions/domain/errors/UnableToCompleteLessonError';

describe('Mark lesson as completed', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const lessonRepository = mock<LessonRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(lessonRepository);
    mockReset(eventBus);
  });

  it('Should mark a lesson as completed', async () => {
    const lesson = new LessonBuilder().build();
    const userId = UserId.random();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withUserId(userId)
      .withCourseId(lesson.courseId)
      .build();

    const command = new MarkLessonAsCompletedCommand({
      userId: userId.value,
      lessonId: lesson.id.value,
    });

    const useCase = new MarkLessonAsCompleted(
      courseSubscriptionRepository,
      lessonRepository,
      eventBus
    );

    lessonRepository.findById.mockResolvedValue(lesson);
    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(
      courseSubscription
    );

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseSubscriptionRepository.update).toBeCalled();
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not mark a lesson as completed if lesson do not exist', async () => {
    const lesson = new LessonBuilder().build();
    const userId = UserId.random();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withUserId(userId)
      .withCourseId(lesson.courseId)
      .build();

    const command = new MarkLessonAsCompletedCommand({
      userId: userId.value,
      lessonId: lesson.id.value,
    });

    const useCase = new MarkLessonAsCompleted(
      courseSubscriptionRepository,
      lessonRepository,
      eventBus
    );

    lessonRepository.findById.mockResolvedValue(null);
    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(
      courseSubscription
    );

    expect(useCase.execute(command)).rejects.toThrow(LessonNotFoundError);
    expect(courseSubscriptionRepository.update).not.toBeCalled();
    expect(eventBus.publish).not.toBeCalled();
  });

  it('Should not mark a lesson as completed if courseSubscription do not exist', async () => {
    const lesson = new LessonBuilder().build();
    const userId = UserId.random();

    const command = new MarkLessonAsCompletedCommand({
      userId: userId.value,
      lessonId: lesson.id.value,
    });

    const useCase = new MarkLessonAsCompleted(
      courseSubscriptionRepository,
      lessonRepository,
      eventBus
    );

    lessonRepository.findById.mockResolvedValue(lesson);
    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(null);

    expect(useCase.execute(command)).rejects.toThrow(
      CourseSubscriptionNotFoundError
    );
    expect(courseSubscriptionRepository.update).not.toBeCalled();
    expect(eventBus.publish).not.toBeCalled();
  });

  it('Should not mark a lesson as completed if is already completed', async () => {
    const lesson = new LessonBuilder().build();
    const userId = UserId.random();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withUserId(userId)
      .withCourseId(lesson.courseId)
      .withCompletedLessons([lesson.id])
      .build();

    const command = new MarkLessonAsCompletedCommand({
      userId: userId.value,
      lessonId: lesson.id.value,
    });

    const useCase = new MarkLessonAsCompleted(
      courseSubscriptionRepository,
      lessonRepository,
      eventBus
    );

    lessonRepository.findById.mockResolvedValue(lesson);
    courseSubscriptionRepository.findByUserAndCourse.mockResolvedValue(
      courseSubscription
    );

    expect(useCase.execute(command)).rejects.toThrow(
      UnableToCompleteLessonError
    );
    expect(courseSubscriptionRepository.update).not.toBeCalled();
    expect(eventBus.publish).not.toBeCalled();
  });
});
