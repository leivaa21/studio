export interface CourseInfoResponse {
  id: string;
  title: string;
  tags: string[];
  description: string;
  isPublished: boolean;
  publishedAt: Date | null | undefined;
  authorId: string;
}

export interface SubscribedCourseInfoResponse {
  id: string;
  title: string;
  tags: string[];
  description: string;
  authorId: string;
}