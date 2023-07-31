import { Nullable } from '../../../../shared/domain/Nullable';

export interface CourseData {
  _id: string;
  authorId: string;
  title: string;
  description: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Nullable<Date>;
}
