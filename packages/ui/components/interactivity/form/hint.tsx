import React from "react";

import styles from './form.module.scss';

const FormHint = ({
  children,
  ...defaultProps
}: React.BaseHTMLAttributes<HTMLElement>) => {

  return (
    <div className={styles.hint}>
      {children}
    </div>
  )
}

export default FormHint;