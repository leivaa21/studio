export interface LessonInfoResponse {
  id: string;
  courseId: string;
  order: number;
  title: string;
}

export interface LessonResponse {
  id: string;
  courseId: string;
  order: number;
  title: string;
  content: string;
}

export interface UpdateLessonRequest {
  title: string;
  content: string;
}