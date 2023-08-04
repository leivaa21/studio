import { useEffect, useState } from 'react';

import { getUserNicknameById } from '../../contexts/users/application/getUserNicknameById';

export function useCourseAuthor(authorId?: string) {
  const [author, setAuthor] = useState<{ nickname: string }>();

  useEffect(() => {
    if (!authorId) return;
    getUserNicknameById(authorId).then((user) => setAuthor(user));
  }, [authorId]);

  return author;
}
