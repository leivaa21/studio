import { useEffect, useState } from 'react';

import { LessonInfoResponse } from '@studio/commons';

import { getLessonsByCourseId } from '../../contexts/lessons/aplication/GetLessonsByCourseId';

export function useCourseLessons(id: string) {
  const [lessons, setLessons] = useState<LessonInfoResponse[]>([]);

  useEffect(() => {
    if (!id) return;
    getLessonsByCourseId(id).then((course) => setLessons(course));
  }, [id]);

  return lessons;
}
