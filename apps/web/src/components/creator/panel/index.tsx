import React from 'react';
import styles from '../creator.module.scss';
import { CourseInfoResponse } from '@studio/commons';
import { CourseCreatorGrid } from './CourseCreatorGrid';
export function CreatorPanel({ courses }: { courses: CourseInfoResponse[] }) {
  return (
    <section className={styles['panel--section']}>
      <h1>Panel</h1>
      <CourseCreatorGrid courses={courses} />
    </section>
  );
}
