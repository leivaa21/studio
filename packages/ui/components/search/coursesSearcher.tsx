import { HTMLInputTypeAttribute, useCallback, useEffect, useState } from 'react';

import styles from './search.module.scss';
import { CheckableTag } from '../interactivity/tags';

export interface CourseSearcherProps {
  onFetch: () => Promise<void>;
  tags: string[];
}

export function CourseSearcher({tags, onFetch}: CourseSearcherProps ) {
  
  const [tagsState, setTagState] = useState<Array<{label: string, checked: boolean}>>([]);

  useEffect(() => {
    setTagState(
      tags.map((tag) => { return { label: tag, checked: false} })
    )
    console.log('times');
  }, [tags])

  const updateCheckOfTag = (tagIndex: number) => function (e: React.ChangeEvent<HTMLInputElement>) {
    const { checked }= e.currentTarget;
    let newTagsState = [...tagsState];
    newTagsState[tagIndex].checked = checked;
    setTagState(newTagsState);
  }

  return (
    <div className={styles.courseSearcher}>
      <ul className={`no-dotted-list ${styles['utils-list']}`}>
        <li>
          <div className={styles['search-input']}>
            <label htmlFor="search">Search</label>
            <input id="search" placeholder="search" />
          </div>
        </li>
        <li>
          Tags
          <ul className={`no-dotted-list ${styles['tags-picker']}`}>
            {
              tagsState.map((tag, index) => {
                  return (
                    <li key={`checkableTag-${tag}`}>
                      <CheckableTag
                        checked={tagsState[index].checked}
                        tag={tag.label}
                        onChange={updateCheckOfTag(index)}
                      />
                    </li>
                  )
              })
            }
          </ul>
        </li>
      </ul>
    </div>
  );
}
