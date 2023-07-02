import { CourseInfoResponse } from "./CourseContracts";

export interface CreateCourseRequest {
  title: string;
  description: string;
}

export interface CreateCourseResponse extends CourseInfoResponse {}