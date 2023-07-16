export interface CourseParams {
  title: string;
  tags: string[];
  description: string;
}

export function Course(args: CourseParams) {
  return <h1>{args.title}</h1>;
}
