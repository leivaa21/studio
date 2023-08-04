import Button from '@studio/ui/components/interactivity/cta/button';

import styles from './courses.module.scss';
import { useCourse } from '../../hooks/course/useCourse';
import { MarkdownRenderer } from '../markdown/renderer';
import { useCourseAuthor } from '../../hooks/course/useCourseAuthor';

export interface CourseContentPreviewParams {
  courseId: string;
}

export function CourseContentPreview({ courseId }: CourseContentPreviewParams) {
  const course = useCourse(courseId);
  const author = useCourseAuthor(course?.authorId);

  return (
    <div className={styles.courseContentPreview}>
      <h2 className={styles.title}>{course?.title}</h2>
      <span className={styles.authorName}>{author?.nickname}</span>
      <MarkdownRenderer content={course?.description} />
      <CourseTags keyPrefix={`${course?.id}-tag`} tags={course?.tags || []} />
      <div className={styles.courseControls}>
        <Button Type="Primary" Size="Medium" Label="Start Course" />
      </div>
    </div>
  );
}

export function CourseTags(args: { keyPrefix: string; tags: string[] }) {
  return (
    <ul className={styles.tags}>
      {args.tags.map((tag) => (
        <CourseTag key={`${args.keyPrefix}-${tag}`} tag={tag} />
      ))}
    </ul>
  );
}

export function CourseTag({ tag }: { tag: string }) {
  return <li className={styles.tag}>{tag}</li>;
}
