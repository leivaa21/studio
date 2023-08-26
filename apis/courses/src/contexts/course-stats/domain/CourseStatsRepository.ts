import { CourseId } from '../../courses/domain/CourseId';
import { Nullable } from '../../shared/domain/Nullable';
import { CourseStats } from './CourseStats';

export interface CourseStatsRepository {
  create(authorStats: CourseStats): Promise<void>;
  find(authorId: CourseId): Promise<Nullable<CourseStats>>;
  update(authorStats: CourseStats): Promise<void>;
  delete(authorId: CourseId): Promise<void>;
}
