import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '../../../shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../shared/domain/DomainEventSubscriber';
import { LessonWasCreatedEvent } from '../../domain/events/LessonWasCreated';
import { CourseId } from '../../../courses/domain/CourseId';
import { CourseRepository } from '../../../courses/domain/CourseRepository';
import { CourseFinder } from '../../../courses/application/services/CourseFinder';
import { MongoCourseRepository } from '../../../courses/infrastructure/persistance/mongo/MongoCourseRepository';

@Injectable({
  dependencies: [MongoCourseRepository],
})
export class UpdateCourseWhenLessonsChangedHandler
  implements DomainEventSubscriber<LessonWasCreatedEvent>
{
  private readonly courseFinder: CourseFinder;

  public constructor(private readonly courseRepository: CourseRepository) {
    this.courseFinder = new CourseFinder(courseRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [LessonWasCreatedEvent];
  }
  async on(domainEvent: LessonWasCreatedEvent): Promise<void> {
    const { attributes } = domainEvent;

    const courseId = CourseId.of(attributes.courseId);

    const course = await this.courseFinder.findByIdOrThrow(courseId);

    course.hasBeenUpdated();

    this.courseRepository.update(course);
  }
}