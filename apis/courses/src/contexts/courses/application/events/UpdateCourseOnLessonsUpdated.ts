import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../shared/domain/DomainEventSubscriber';
import { CourseId } from '../../domain/CourseId';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseFinder } from '../../application/services/CourseFinder';
import { MongoCourseRepository } from '../../infrastructure/persistance/mongo/MongoCourseRepository';
import { LessonWasCreatedEvent } from '../../../lessons/domain/events/LessonWasCreated';
import { LessonWasDeletedEvent } from '../../../lessons/domain/events/LessonWasDeleted';
import { LessonContentWasUpdatedEvent } from '../../../lessons/domain/events/LessonContentWasUpdated';
import { LessonWasRenamedEvent } from '../../../lessons/domain/events/LessonWasRenamed';
import { LessonWasReorderedEvent } from '../../../lessons/domain/events/LessonWasReordered';

export type UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents =
  | LessonWasCreatedEvent
  | LessonWasDeletedEvent
  | LessonContentWasUpdatedEvent
  | LessonWasRenamedEvent
  | LessonWasReorderedEvent;

@Injectable({
  dependencies: [MongoCourseRepository],
})
export class UpdateCourseOnLessonsUpdatedHandler
  implements
    DomainEventSubscriber<UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents>
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
    domainEvent: UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents
  ): Promise<void> {
    const { attributes } = domainEvent;

    const courseId = CourseId.of(attributes.courseId);

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    course.hasBeenUpdated();

    this.courseRepository.update(course);
  }
}
