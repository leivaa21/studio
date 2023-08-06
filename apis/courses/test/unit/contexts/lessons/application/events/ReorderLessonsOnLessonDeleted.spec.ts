import { mock, mockReset } from 'jest-mock-extended';
import { ReorderLessonsOnLessonDeletedHandler } from '../../../../../../src/contexts/lessons/application/events/ReorderLessonsOnLessonDeleted';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { LessonWasDeletedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonWasDeleted';
import { CourseId } from '../../../../../../src/contexts/courses/domain/CourseId';
import { LessonOrder } from '../../../../../../src/contexts/lessons/domain/LessonOrder';

describe('Update Course On Lessons Update', () => {
  const lessonRepository = mock<LessonRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(lessonRepository);
    mockReset(eventBus);
  });

  it(`Should reorder lessons on ${LessonWasDeletedEvent.EVENT_NAME}`, async () => {
    const courseId = CourseId.random();
    const lesson0 = new LessonBuilder()
      .withCourseId(courseId)
      .withOrder(LessonOrder.of(0))
      .build();
    const lesson1 = new LessonBuilder()
      .withCourseId(courseId)
      .withOrder(LessonOrder.of(1))
      .build();
    const lesson2 = new LessonBuilder()
      .withCourseId(courseId)
      .withOrder(LessonOrder.of(2))
      .build();
    const lesson3 = new LessonBuilder()
      .withCourseId(courseId)
      .withOrder(LessonOrder.of(3))
      .build();

    const event = LessonWasDeletedEvent.fromPrimitives({
      aggregateId: lesson1.id.value,
      attributes: {
        courseId: courseId.value,
      },
    });

    const eventHandler = new ReorderLessonsOnLessonDeletedHandler(
      lessonRepository,
      eventBus
    );

    lessonRepository.findByCourseId.mockResolvedValue([
      lesson0,
      lesson2,
      lesson3,
    ]);

    await expect(eventHandler.on(event)).resolves.not.toThrow();

    expect(lessonRepository.update).toBeCalledTimes(2);
    expect(lessonRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: lesson2.id,
        order: LessonOrder.of(1),
      })
    );
    expect(lessonRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: lesson3.id,
        order: LessonOrder.of(2),
      })
    );
  });
});
