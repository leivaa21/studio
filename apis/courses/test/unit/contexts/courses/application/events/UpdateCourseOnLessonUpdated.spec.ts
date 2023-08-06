import { mock, mockReset } from 'jest-mock-extended';
import { CourseRepository } from '../../../../../../src/contexts/courses/domain/CourseRepository';
import { UpdateCourseOnLessonsUpdatedHandler } from '../../../../../../src/contexts/courses/application/events/UpdateCourseOnLessonsUpdated';
import { CourseBuilder } from '../../../../../helpers/builders/CourseBuilder';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';
import { LessonWasCreatedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonWasCreated';
import { LessonWasDeletedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonWasDeleted';
import { LessonWasReorderedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonWasReordered';
import { LessonWasRenamedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonWasRenamed';
import { LessonContentWasUpdatedEvent } from '../../../../../../src/contexts/lessons/domain/events/LessonContentWasUpdated';

describe('Update Course On Lessons Update', () => {
  const courseRepository = mock<CourseRepository>();
  const lessonRepository = mock<LessonRepository>();
  const eventBus = mock<EventBus>();

  beforeEach(() => {
    mockReset(courseRepository);
    mockReset(lessonRepository);
    mockReset(eventBus);
  });

  it.each([
    {
      eventName: LessonWasCreatedEvent.EVENT_NAME,
      eventClass: LessonWasCreatedEvent,
    },
    {
      eventName: LessonWasDeletedEvent.EVENT_NAME,
      eventClass: LessonWasDeletedEvent,
    },
    {
      eventName: LessonWasReorderedEvent.EVENT_NAME,
      eventClass: LessonWasReorderedEvent,
    },
    {
      eventName: LessonContentWasUpdatedEvent.EVENT_NAME,
      eventClass: LessonContentWasUpdatedEvent,
    },
    {
      eventName: LessonWasRenamedEvent.EVENT_NAME,
      eventClass: LessonWasRenamedEvent,
    },
  ])('Should update course on $eventName', async ({ eventClass }) => {
    const course = new CourseBuilder().build();
    const lesson = new LessonBuilder().build();

    const event = eventClass.fromPrimitives({
      aggregateId: lesson.id.value,
      attributes: {
        courseId: course.id.value,
      },
    });

    courseRepository.findById.mockResolvedValue(course);

    const eventHandler = new UpdateCourseOnLessonsUpdatedHandler(
      courseRepository,
      eventBus
    );

    await expect(eventHandler.on(event)).resolves.not.toThrow();

    expect(courseRepository.update).toBeCalled();
  });
});
