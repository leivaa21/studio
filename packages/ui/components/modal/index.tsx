import { useState } from "react";
import styles from './modal.module.scss';

export interface ModalProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  title: string;
  isShown: boolean;
  closeFunction: () => void;
}


export function Modal({title, isShown, closeFunction}: ModalProps) {

  return (
    <div className={`${styles.backdrop} ${isShown ? undefined : styles.hidden}`} onClick={() => closeFunction()}>
      <div className={styles.modal}>
        
      </div>
    </div>
  )
}