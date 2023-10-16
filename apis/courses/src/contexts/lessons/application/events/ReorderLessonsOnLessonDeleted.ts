import { Injectable } from '@studio/dependency-injection';
import { DomainEventClass } from '@studio/events';

import { LessonWasDeletedEvent } from '../../../lessons/domain/events/LessonWasDeleted';
import { EventHandler } from '../../../shared/application/EventHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { LessonRepository } from '../../domain/LessonRepository';
import { CourseId } from '../../../courses/domain/CourseId';
import { LessonFinder } from '../services/LessonFinder';

@Injectable({
  dependencies: [LessonRepository, EventBus],
})
export class ReorderLessonsOnLessonDeletedHandler extends EventHandler<LessonWasDeletedEvent> {
  private readonly lessonFinder: LessonFinder;

  public constructor(
    private readonly lessonRepository: LessonRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.lessonFinder = new LessonFinder(lessonRepository);
  }
  subscribedTo(): DomainEventClass[] {
    return [LessonWasDeletedEvent];
  }
  async on(domainEvent: LessonWasDeletedEvent): Promise<void> {
    const { attributes } = domainEvent;

    const courseId = CourseId.of(attributes.courseId);

    const courseLessons = await this.lessonFinder.findByCourseId(courseId);

    const affectedLessons = courseLessons.filter(
      (lesson, index) => lesson.order.value !== index
    );

    await Promise.all(
      affectedLessons.map(async (lesson) => {
        lesson.moveUp();
        await this.lessonRepository.update(lesson);
      })
    );
  }
}
