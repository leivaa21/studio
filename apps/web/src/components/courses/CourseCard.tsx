import Button from '@studio/ui/components/interactivity/cta/button';
export interface CourseCardParams {
  course: { id: string; title: string; authorId: string; tags: string[] };
  key: string;
}

export function CourseCard({ key, course }: CourseCardParams) {
  return (
    <div key={key}>
      <h4>{course.title}</h4>
      <div>
        <Button
          Type="Primary"
          Size="Small"
          Label="VIEW"
          Link
          href={`/course/${course.id}/preview/`}
        />
      </div>
    </div>
  );
}
