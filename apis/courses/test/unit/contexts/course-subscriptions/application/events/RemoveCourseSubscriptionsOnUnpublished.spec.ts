import { mock, mockReset } from 'jest-mock-extended';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseId } from '../../../../../../src/contexts/courses/domain/CourseId';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { CourseWasUnpublishedEvent } from '../../../../../../src/contexts/courses/domain/events/CourseWasUnpublished';
import { RemoveCourseSubscriptionsOnUnpublishedHandler } from '../../../../../../src/contexts/course-subscriptions/application/events/RemoveCourseSubscriptionsOnUnpublished';

describe('Update Remove Course Subscription On Course Unpublished', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(eventBus);
  });

  it(`Should remove course subscriptions on ${CourseWasUnpublishedEvent.EVENT_NAME}`, async () => {
    const courseId = CourseId.random();
    const event = CourseWasUnpublishedEvent.fromPrimitives({
      aggregateId: courseId.value,
    });

    const eventHandler = new RemoveCourseSubscriptionsOnUnpublishedHandler(
      courseSubscriptionRepository,
      eventBus
    );

    await expect(eventHandler.on(event)).resolves.not.toThrow();

    expect(courseSubscriptionRepository.removeByCourseId).toHaveBeenCalled();
    expect(courseSubscriptionRepository.removeByCourseId).toHaveBeenCalledWith(
      courseId
    );
  });
});
