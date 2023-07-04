import styles from './modal.module.scss';

import { IoMdClose } from 'react-icons/io'

export interface ModalProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  title: string;
  isShown: boolean;
  closeFunction: () => void;
  children?: JSX.Element[] | JSX.Element  
}


export function Modal({title, isShown, closeFunction, children}: ModalProps): JSX.Element {

  return (
    <div className={`${styles.modalContainer} ${isShown ? undefined : styles.hidden}`}>
      <div className={styles.modal}>
        <ModalHeader title={title} closeFunction={closeFunction}/>
        <ModalContent>
          {children}
        </ModalContent>
      </div>
      <div className={styles.backdrop} onClick={() => closeFunction()}/>
    </div>
)
}

export function ModalHeader({title, closeFunction}:{title: string, closeFunction: () => void}): JSX.Element {
  return (
    <div className={styles.header}>
      <div className={styles.leftColumn}>
        <ModalTitle title={title} />
      </div>
      <div className={styles.rightColumn}>
        <IoMdClose className={styles.closeIcon} onClick={closeFunction}/>
      </div>
    </div>
  )
}

export function ModalTitle({title}: {title: string}): JSX.Element {

  return (
    <h3 className={styles.title}>
      {title}
    </h3>
  )
}

export function ModalContent({children}: {children?: JSX.Element[] | JSX.Element}): JSX.Element {

  return (
    <div className={styles.content}>
      {children}
    </div>
  )

}