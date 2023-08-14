import { mock, mockReset } from 'jest-mock-extended';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseId } from '../../../../../../src/contexts/courses/domain/CourseId';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { UpdateCourseSubscriptionOnLessonContentUpdatedHandler } from '../../../../../../src/contexts/course-subscriptions/application/events/UpdateCourseSubscriptionOnLessonContentUpdated';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';
import { LessonContentWasUpdatedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonContentWasUpdated';

describe('Update Course Subscription On Lesson Content Updated', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(eventBus);
  });

  it(`Should mark completed courseSubscriptions as uncompleted on ${LessonContentWasUpdatedEvent.EVENT_NAME} and remove lesson from completed lessons`, async () => {
    const courseId = CourseId.random();
    const completedLesson = new LessonBuilder().withCourseId(courseId).build();
    const updatedLesson = new LessonBuilder().withCourseId(courseId).build();

    const courseSubscription = new CourseSubscriptionBuilder()
      .withCourseId(courseId)
      .withCompletedLessons([completedLesson.id, updatedLesson.id])
      .withCompleted(true)
      .build();

    const event = LessonContentWasUpdatedEvent.fromPrimitives({
      aggregateId: updatedLesson.id.value,
      attributes: {
        courseId: courseId.value,
      },
    });

    const eventHandler =
      new UpdateCourseSubscriptionOnLessonContentUpdatedHandler(
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
        completedLessons: [completedLesson.id],
      })
    );
  });
});
