import { mock, mockReset } from 'jest-mock-extended';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseId } from '../../../../../../src/contexts/courses/domain/CourseId';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { CheckIfCourseWasCompletedOnLessonCompletedHandler } from '../../../../../../src/contexts/course-subscriptions/application/events/CheckIfCourseWasCompletedOnLessonCompleted';
import { LessonWasCompletedOnCourseSubscriptionEvent } from '../../../../../../src/contexts/course-subscriptions/domain/events/LessonWasCompletedOnCourseSubscription';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';

describe('Check If Course Was Completed On Lesson Completed', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const lessonRepository = mock<LessonRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(lessonRepository);
    mockReset(eventBus);
  });

  it(`Should mark course subscriptions as completed on ${LessonWasCompletedOnCourseSubscriptionEvent.EVENT_NAME} if all lessons are completed`, async () => {
    const courseId = CourseId.random();
    const lesson = new LessonBuilder().withCourseId(courseId).build();
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(courseId)
      .withCompletedLessons([lesson.id])
      .build();

    const event = LessonWasCompletedOnCourseSubscriptionEvent.fromPrimitives({
      aggregateId: courseSubscription.id.value,
      attributes: {
        lessonId: lesson.id.value,
      },
    });

    const eventHandler = new CheckIfCourseWasCompletedOnLessonCompletedHandler(
      courseSubscriptionRepository,
      lessonRepository,
      eventBus
    );

    courseSubscriptionRepository.findById.mockResolvedValue(courseSubscription);
    lessonRepository.findByCourseId.mockResolvedValue([lesson]);

    await expect(eventHandler.on(event)).resolves.not.toThrow();

    expect(courseSubscriptionRepository.update).toHaveBeenCalled();
    expect(courseSubscriptionRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: true,
      })
    );
  });

  it(`Should not mark course subscriptions as completed on ${LessonWasCompletedOnCourseSubscriptionEvent.EVENT_NAME} if not all lessons are completed`, async () => {
    const courseId = CourseId.random();
    const lessons = [
      new LessonBuilder().withCourseId(courseId).build(),
      new LessonBuilder().withCourseId(courseId).build(),
    ];
    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(courseId)
      .withCompletedLessons([lessons[0].id])
      .build();

    const event = LessonWasCompletedOnCourseSubscriptionEvent.fromPrimitives({
      aggregateId: courseSubscription.id.value,
      attributes: {
        lessonId: lessons[0].id.value,
      },
    });

    const eventHandler = new CheckIfCourseWasCompletedOnLessonCompletedHandler(
      courseSubscriptionRepository,
      lessonRepository,
      eventBus
    );

    courseSubscriptionRepository.findById.mockResolvedValue(courseSubscription);
    lessonRepository.findByCourseId.mockResolvedValue(lessons);

    await expect(eventHandler.on(event)).resolves.not.toThrow();

    expect(courseSubscriptionRepository.update).not.toHaveBeenCalled();
  });
});
