export interface CreateCourseSubscriptionRequest {
  courseId: string;
}

export interface CheckIfUserIsSubscribedToCourseResponse {
  isSubscribed: boolean;
}