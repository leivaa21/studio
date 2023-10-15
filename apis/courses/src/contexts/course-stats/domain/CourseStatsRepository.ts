import { CourseId } from '../../courses/domain/CourseId';
import { Nullable } from '../../shared/domain/Nullable';
import { CourseStats } from './CourseStats';

export abstract class CourseStatsRepository {
  abstract create(authorStats: CourseStats): Promise<void>;
  abstract find(authorId: CourseId): Promise<Nullable<CourseStats>>;
  abstract update(authorStats: CourseStats): Promise<void>;
  abstract delete(authorId: CourseId): Promise<void>;
}
