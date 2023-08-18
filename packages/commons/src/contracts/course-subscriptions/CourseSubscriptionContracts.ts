export interface CreateCourseSubscriptionRequest {
  courseId: string;
}

export interface CheckIfUserIsSubscribedToCourseResponse {
  isSubscribed: boolean;
}

export interface CourseSubscriptionInfoResponse {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  completedAt?: Date;
}