import styles from './modal.module.scss';

export interface ModalProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  title: string;
  isShown: boolean;
  closeFunction: () => void;
  children?: JSX.Element[] | JSX.Element  
}


export function Modal({title, isShown, closeFunction, children}: ModalProps) {

  return (
    <div className={`${styles.modalContainer} ${isShown ? undefined : styles.hidden}`}>
      <div className={styles.modal} >
        {children}
      </div>
      <div className={styles.backdrop} onClick={() => closeFunction()}/>
    </div>
)
}