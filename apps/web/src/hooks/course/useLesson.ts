import { useEffect, useState } from 'react';

import { LessonResponse } from '@studio/commons';

import { getLessonById } from '../../contexts/lessons/aplication/GetLessonById';

export function useLesson(id: string) {
  const [lesson, setLesson] = useState<LessonResponse>();

  useEffect(() => {
    if (!id) return;
    getLessonById(id).then((course) => setLesson(course));
  }, [id]);

  return lesson;
}
