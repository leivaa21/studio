import { mock, mockReset } from 'jest-mock-extended';
import {
  DeleteCourseSubscription,
  DeleteCourseSubscriptionCommand,
} from '../../../../../../src/contexts/course-subscriptions/application/commands/DeleteCourseSubscription';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { CourseSubscriptionRepository } from '../../../../../../src/contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { CourseSubscriptionBuilder } from '../../../../../helpers/builders/CourseSubscriptionBuilder';
import { CourseSubscriptionNotFoundError } from '../../../../../../src/contexts/course-subscriptions/domain/errors/CourseSubscriptionNotFoundError';

describe('Delete course subscription', () => {
  const courseSubscriptionRepository = mock<CourseSubscriptionRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseSubscriptionRepository);
    mockReset(eventBus);
  });

  it('Should delete an existant course subscription', async () => {
    const courseSubscription = new CourseSubscriptionBuilder().build();

    const command = new DeleteCourseSubscriptionCommand({
      id: courseSubscription.id.value,
    });

    const useCase = new DeleteCourseSubscription(
      courseSubscriptionRepository,
      eventBus
    );

    courseSubscriptionRepository.findById.mockResolvedValue(courseSubscription);

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(courseSubscriptionRepository.removeById).toBeCalledWith(
      courseSubscription.id
    );
    expect(eventBus.publish).toBeCalled();
  });

  it('Should not delete a course subscription if not found', async () => {
    const courseSubscription = new CourseSubscriptionBuilder().build();
    const command = new DeleteCourseSubscriptionCommand({
      id: courseSubscription.id.value,
    });

    const useCase = new DeleteCourseSubscription(
      courseSubscriptionRepository,
      eventBus
    );

    courseSubscriptionRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(
      CourseSubscriptionNotFoundError
    );
  });
});
