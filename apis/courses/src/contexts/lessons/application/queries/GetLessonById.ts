import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../shared/application/QueryHandler';
import { Lesson } from '../../domain/Lesson';
import { LessonRepository } from '../../domain/LessonRepository';
import { LessonFinder } from '../services/LessonFinder';
import { LessonId } from '../../domain/LessonId';

export class GetLessonByIdQuery {
  public readonly lessonId: string;

  constructor(args: { lessonId: string }) {
    this.lessonId = args.lessonId;
  }
}

@Injectable({
  dependencies: [LessonRepository],
})
export class GetLessonById implements QueryHandler<GetLessonByIdQuery, Lesson> {
  private readonly lessonFinder: LessonFinder;

  public constructor(lessonRepository: LessonRepository) {
    this.lessonFinder = new LessonFinder(lessonRepository);
  }
  public async execute(query: GetLessonByIdQuery): Promise<Lesson> {
    const lessonId = LessonId.of(query.lessonId);

    return this.lessonFinder.findByIdOrThrow(lessonId);
  }
}
