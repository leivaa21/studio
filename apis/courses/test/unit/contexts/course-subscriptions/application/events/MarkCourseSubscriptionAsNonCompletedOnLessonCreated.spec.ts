import { mock, mockReset } from 'jest-mock-extended';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseId } from '../../../../../../src/contexts/courses/domain/CourseId';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { MarkCourseSubscriptionAsNonCompletedOnLessonCreatedHandler } from '../../../../../../src/contexts/course-subscriptions/application/events/MarkCourseSubscriptionAsNonCompletedOnLessonCreated';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';
import { LessonWasCreatedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonWasCreated';

describe('Mark CourseSubscription As Non Completed On Lesson Created Handler', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(eventBus);
  });

  it(`Should mark completed courseSubscriptions as uncompleted on ${LessonWasCreatedEvent.EVENT_NAME}`, async () => {
    const courseId = CourseId.random();
    const completedLesson = new LessonBuilder().withCourseId(courseId).build();
    const newLesson = new LessonBuilder().withCourseId(courseId).build();

    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(courseId)
      .withCompletedLessons([completedLesson.id])
      .withCompleted(true)
      .build();

    const event = LessonWasCreatedEvent.fromPrimitives({
      aggregateId: newLesson.id.value,
      attributes: {
        courseId: courseId.value,
      },
    });

    const eventHandler =
      new MarkCourseSubscriptionAsNonCompletedOnLessonCreatedHandler(
        courseSubscriptionRepository,
        eventBus
      );

    courseSubscriptionRepository.findByCourse.mockResolvedValueOnce([
      courseSubscription,
    ]);

    await expect(eventHandler.on(event)).resolves.not.toThrow();

    expect(courseSubscriptionRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        completed: false,
      })
    );
  });
});
