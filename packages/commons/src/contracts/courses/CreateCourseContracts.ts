import { CourseInfoResponse } from "./CourseContracts";

export interface CreateCourseRequest {
  title: string;
  description: string;
  authorId: string;
}

export interface CreateCourseResponse extends CourseInfoResponse {}