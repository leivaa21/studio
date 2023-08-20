import { useEffect, useState } from 'react';

import styles from './search.module.scss';
import { CheckableTag } from '../interactivity/tags';

export interface CourseSearcherProps {
  onFetch: (title: string, tags: string[]) => Promise<void>;
  tags: string[];
}

export function CourseSearcher({tags, onFetch}: CourseSearcherProps ) {
  
  const [tagsState, setTagState] = useState<Array<{label: string, checked: boolean}>>([]);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    setTagState(
      tags.map((tag) => { return { label: tag, checked: false} })
    )
    
    onFetch(title, getSelectedTags());
  }, [])

  const getSelectedTags = () => tagsState.filter(tag => tag.checked).map(tag => tag.label);

  const updateCheckOfTag = (tagIndex: number) => async function (e: React.ChangeEvent<HTMLInputElement>) {
    const { checked }= e.currentTarget;
    let newTagsState = [...tagsState];
    newTagsState[tagIndex].checked = checked;
    setTagState(newTagsState);
    await onFetch(title, getSelectedTags());
  }

  const onChangeTitle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    await onFetch(e.currentTarget.value, getSelectedTags());
  }

  return (
    <div className={styles.courseSearcher}>
      <ul className={`no-dotted-list ${styles['utils-list']}`}>
        <li>
          <div className={styles['search-input']}>
            <label htmlFor="search">Search</label>
            <input id="search" placeholder="search" value={title} onChange={onChangeTitle}/>
          </div>
        </li>
        <li>
          Tags
          <ul className={`no-dotted-list ${styles['tags-picker']}`}>
            {
              tagsState.map((tag, index) => {
                  return (
                    <li key={`checkableTag-${tag.label}`}>
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
