import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '@studio/events';

import { CourseId } from '../../domain/CourseId';
import { CourseRepository } from '../../domain/CourseRepository';
import { CourseFinder } from '../../application/services/CourseFinder';
import { LessonWasCreatedEvent } from '../../../lessons/domain/events/LessonWasCreated';
import { LessonWasDeletedEvent } from '../../../lessons/domain/events/LessonWasDeleted';
import { LessonContentWasUpdatedEvent } from '../../../lessons/domain/events/LessonContentWasUpdated';
import { LessonWasRenamedEvent } from '../../../lessons/domain/events/LessonWasRenamed';
import { LessonWasReorderedEvent } from '../../../lessons/domain/events/LessonWasReordered';
import { EventHandler } from '../../../shared/application/EventHandler';
import { EventBus } from '../../../shared/domain/EventBus';

export type UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents =
  | LessonWasCreatedEvent
  | LessonWasDeletedEvent
  | LessonContentWasUpdatedEvent
  | LessonWasRenamedEvent
  | LessonWasReorderedEvent;

@Injectable({
  dependencies: [CourseRepository, EventBus],
})
export class UpdateCourseOnLessonsUpdatedHandler extends EventHandler<UpdateCourseOnLessonsUpdatedHandlerSubscribedEvents> {
  private readonly courseFinder: CourseFinder;

  public constructor(
    private readonly courseRepository: CourseRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
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

    this.publishAggregateRootEvents(course);
  }
}
