import { mock, mockReset } from 'jest-mock-extended';
import {
  GetLessonById,
  GetLessonByIdQuery,
} from '../../../../../../src/contexts/lessons/application/queries/GetLessonById';
import { LessonRepository } from '../../../../../../src/contexts/lessons/domain/LessonRepository';
import { LessonBuilder } from '../../../../../helpers/builders/LessonBuilder';
import { LessonNotFoundError } from '../../../../../../src/contexts/lessons/domain/errors/LessonNotFoundError';

describe('Get existant lesson by id', () => {
  const lessonRepository = mock<LessonRepository>();

  beforeEach(() => {
    mockReset(lessonRepository);
  });

  it('Should find an existant lesson', async () => {
    const lesson = new LessonBuilder().build();
    const query = new GetLessonByIdQuery({ lessonId: lesson.id.value });

    lessonRepository.findById.mockResolvedValue(lesson);

    const useCase = new GetLessonById(lessonRepository);

    expect(useCase.execute(query)).resolves.toEqual(lesson);
  });

  it('Should throw NotFoundError on lesson not found', async () => {
    const lesson = new LessonBuilder().build();
    const query = new GetLessonByIdQuery({ lessonId: lesson.id.value });

    lessonRepository.findById.mockResolvedValue(null);

    const useCase = new GetLessonById(lessonRepository);

    expect(useCase.execute(query)).rejects.toThrow(LessonNotFoundError);
  });
});
