import React from 'react';
import styles from '../creator.module.scss';
import { CourseInfoResponse } from '@studio/commons';
export function CreatorPanel({ courses }: { courses: CourseInfoResponse[] }) {
  return (
    <section className={styles['panel--section']}>
      <h1>Panel</h1>
      {courses.map((course) => (
        <h1 key={`course-${course.id}`}>{course.title}</h1>
      ))}
    </section>
  );
}
