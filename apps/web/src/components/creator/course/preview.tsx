import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import styles from './course.module.scss';

import { getCourseById } from '../../../contexts/courses/application/GetCourseById';
import Button from '@studio/ui/components/interactivity/cta/button';

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
      console.log(course);
    });
  }, [router, courseId]);

  return (
    <div className={styles.coursePreview}>
      <div className={styles.propertyRow}>
        <h4 className={styles.propertyName}>Title</h4>
        <span className={styles.propertyValue}>{title}</span>
        <div className={styles.propertyControls}>
          <Button Type="Primary" Size="Small" Label="Rename" />
        </div>
      </div>
      <div className={styles.propertyRow}>
        <h4 className={styles.propertyName}>Description</h4>
        <p className={styles.propertyValue}>{description}</p>
        <div className={styles.propertyControls}>
          <Button Type="Primary" Size="Small" Label="Change Description" />
        </div>
      </div>
      <div className={`${styles.propertyRow} ${styles.tagsSection}`}>
        <h4 className={styles.propertyName}>Tags</h4>
        <ul className={`${styles.tags} ${styles.propertyValue}`}>
          {tags.map((tag) => (
            <li className={styles.tag} key={`Course<${courseId}>${tag}`}>
              {tag}
            </li>
          ))}
        </ul>
        <div className={styles.propertyControls}>
          <Button Type="Primary" Size="Small" Label="Update Tags" />
        </div>
      </div>
    </div>
  );
}
