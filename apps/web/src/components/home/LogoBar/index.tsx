import Image from 'next/image'
import styles from './logobar.module.scss'
export const Logobar = () => {
  return (
    <div className={styles.base}>
      <div className={styles.logoWrapper}>
        <Image className={styles.logo} src='/branding/isologo.svg' fill alt="Studio logo"/>
      </div>
    </div>
  )
}