import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../shared/domain/DomainEventSubscriber';
import { LessonWasCreatedEvent } from '../../domain/events/LessonWasCreated';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { LessonWasDeletedEvent } from '../../domain/events/LessonWasDeleted';
import { LessonContentWasUpdatedEvent } from '../../domain/events/LessonContentWasUpdated';
import { LessonWasRenamedEvent } from '../../domain/events/LessonWasRenamed';
import { LessonWasReorderedEvent } from '../../domain/events/LessonWasReordered';

export type UpdateCourseWhenLessonsChangedHandlerSubscribedEvents =
  | LessonWasCreatedEvent
  | LessonWasDeletedEvent
  | LessonContentWasUpdatedEvent
  | LessonWasRenamedEvent
  | LessonWasReorderedEvent;

@Injectable({
  dependencies: [MongoCourseRepository],
})
export class UpdateCourseWhenLessonsChangedHandler
  implements
    DomainEventSubscriber<UpdateCourseWhenLessonsChangedHandlerSubscribedEvents>
{
  private readonly courseFinder: CourseFinder;

  public constructor(private readonly courseRepository: CourseRepository) {
    this.courseFinder = new CourseFinder(courseRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [
      LessonWasCreatedEvent,
      LessonWasDeletedEvent,
      LessonContentWasUpdatedEvent,
      LessonWasRenamedEvent,
      LessonWasReorderedEvent,
    ];
  }
  async on(
    domainEvent: UpdateCourseWhenLessonsChangedHandlerSubscribedEvents
  ): Promise<void> {
    const { attributes } = domainEvent;

    const courseId = CourseId.of(attributes.courseId);

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    course.hasBeenUpdated();

    this.courseRepository.update(course);
  }
}
