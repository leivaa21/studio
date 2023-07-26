export interface UpdateCourseRequest {
  title: string;
  tags: string[];
  description: string;
}

export interface RenameCourseRequest {
  title: string;
}

export interface UpdateCourseDescriptionRequest {
  description: string;
}

export interface UpdateCourseTagsRequest {
  tags: string[];
}