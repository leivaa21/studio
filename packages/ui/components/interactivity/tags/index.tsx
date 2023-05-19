import styles from './tags.module.scss';

export interface CheckableTagProps {
  tag: string; 
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CheckableTag({checked, tag, onChange}: CheckableTagProps) {
  return (
    <div className={styles.checkableTag}>
      <input type="checkbox" id={`checkable-tag-${tag}`} checked={checked} onChange={(e) => onChange(e)}/>
      <label htmlFor={`checkable-tag-${tag}`}>{tag}</label>
    </div>
  )
}