import { useEffect, useState } from 'react';

import { useCourseLessons } from './useCourseLessons';
import { useOwnedCourseSubscriptionByCourseId } from './useOwnedCourseSubscriptionByCourseId';

type SubscribedCourseLessonsParams = {
  id: string;
  title: string;
  completed: boolean;
  courseId: string;
};

export function useSubscribedCourseLessons(courseId: string) {
  const lessons = useCourseLessons(courseId);
  const courseSubscription = useOwnedCourseSubscriptionByCourseId(courseId);

  const [subscribedCourseLessons, setSubscribedCourseLessons] = useState<
    Array<SubscribedCourseLessonsParams>
  >([]);

  useEffect(() => {
    if (!courseSubscription) return;
    setSubscribedCourseLessons(
      lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        courseId: lesson.courseId,
        completed:
          courseSubscription?.completedLessons.includes(lesson.id) || false,
      }))
    );
  }, [lessons, courseSubscription]);

  return subscribedCourseLessons;
}
