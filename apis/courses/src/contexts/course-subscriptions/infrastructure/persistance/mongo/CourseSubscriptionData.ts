export interface CourseSubscriptionData {
  _id: string;
  userId: string;
  courseId: string;
  subscribedAt: Date;
  updatedAt: Date;
  completedLessons: string[];
  completedAt?: Date | null;
}
