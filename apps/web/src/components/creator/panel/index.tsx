import React from 'react';
import styles from '../creator.module.scss';
import { CourseInfoResponse } from '@studio/commons';
import { Course } from './course';
export function CreatorPanel({ courses }: { courses: CourseInfoResponse[] }) {
  return (
    <section className={styles['panel--section']}>
      <h1>Panel</h1>
      {courses.map((course) => (
        <Course
          key={`course-${course.id}`}
          title={course.title}
          tags={course.tags}
          description={course.description}
        />
      ))}
    </section>
  );
}
