import { mock, mockReset } from 'jest-mock-extended';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseId } from '../../../../../../src/contexts/courses/domain/CourseId';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { LessonWasDeletedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonWasDeleted';
import { UpdateCourseSubscriptionsOnLessonWasDeletedHandler } from '../../../../../../src/contexts/course-subscriptions/application/events/UpdateCourseSubscriptionsOnLessonWasDeleted';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';

describe('Update Course Subscriptions On Lesson Was Deleted', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const lessonRepository = mock<LessonRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(lessonRepository);
    mockReset(eventBus);
  });

  it(`Should remove completed lesson from courseSubscriptions on ${LessonWasDeletedEvent.EVENT_NAME}`, async () => {
    const courseId = CourseId.random();
    const completedLesson = new LessonBuilder().withCourseId(courseId).build();
    const uncompletedLesson = new LessonBuilder()
      .withCourseId(courseId)
      .build();

    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(courseId)
      .withCompletedLessons([completedLesson.id])
      .build();

    const event = LessonWasDeletedEvent.fromPrimitives({
      aggregateId: completedLesson.id.value,
      attributes: {
        courseId: courseId.value,
      },
    });

    const eventHandler = new UpdateCourseSubscriptionsOnLessonWasDeletedHandler(
      courseSubscriptionRepository,
      lessonRepository,
      eventBus
    );

    courseSubscriptionRepository.findByCourse.mockResolvedValueOnce([
      courseSubscription,
    ]);

    lessonRepository.findByCourseId.mockResolvedValueOnce([uncompletedLesson]);

    await expect(eventHandler.on(event)).resolves.not.toThrow();

    expect(courseSubscriptionRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        completedLessons: [],
      })
    );
  });

  it(`Should mark as completed lesson courseSubscriptions if no more uncompleted lessons remains on ${LessonWasDeletedEvent.EVENT_NAME}`, async () => {
    const courseId = CourseId.random();

    const removedLesson = new LessonBuilder().withCourseId(courseId).build();
    const completedLesson = new LessonBuilder().withCourseId(courseId).build();

    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(courseId)
      .withCompletedLessons([completedLesson.id])
      .build();

    const event = LessonWasDeletedEvent.fromPrimitives({
      aggregateId: removedLesson.id.value,
      attributes: {
        courseId: courseId.value,
      },
    });

    const eventHandler = new UpdateCourseSubscriptionsOnLessonWasDeletedHandler(
      courseSubscriptionRepository,
      lessonRepository,
      eventBus
    );

    courseSubscriptionRepository.findByCourse.mockResolvedValueOnce([
      courseSubscription,
    ]);

    lessonRepository.findByCourseId.mockResolvedValueOnce([completedLesson]);

    await expect(eventHandler.on(event)).resolves.not.toThrow();

    expect(courseSubscriptionRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: true,
      })
    );
  });
});
