import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import styles from './course.module.scss';

import { getCourseById } from '../../../contexts/courses/application/GetCourseById';

export interface CreatorCoursePreviewParams {
  courseId: string;
}

export function CreatorCoursePreview({ courseId }: CreatorCoursePreviewParams) {
  const router = useRouter();

  const [title, setTitle] = useState<string>();
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState<string>();

  useEffect(() => {
    if (!courseId) return;

    getCourseById(courseId).then((course) => {
      setTitle(course.title);
      setTags(course.tags);
      setDescription(course.description);
    });
  }, [router, courseId]);

  return (
    <div className={styles.coursePreview}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      <div className={styles.tagsSection}>
        <h4>Tags:</h4>
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li className={styles.tag} key={`Course<${courseId}>${tag}`}>
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.lessonsSection}>
        <h4>Lessons</h4>
        <ul></ul>
      </div>
    </div>
  );
}
