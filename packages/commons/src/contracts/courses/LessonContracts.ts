export interface LessonInfoResponse {
  id: string;
  courseId: string;
  title: string;
}

export interface LessonResponse {
  id: string;
  courseId: string;
  title: string;
  content: string;
}

export interface UpdateLessonRequest {
  title: string;
  content: string;
}