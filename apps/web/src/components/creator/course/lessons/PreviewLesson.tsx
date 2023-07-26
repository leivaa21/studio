import { useEffect, useState } from 'react';
import { getLessonById } from '../../../../contexts/lessons/aplication/GetLessonById';

export function PreviewLesson({ lessonId }: { lessonId: string }) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    getLessonById(lessonId).then((lesson) => {
      setTitle(lesson.title);
      setContent(lesson.content);
    });
  });

  return (
    <div>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}
