import React from "react";

import styles from '../form.module.scss';

interface FormTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  Name: string,
}

const FormTextInput = ({
  Name,
  className,
  ...defaultProps
}: FormTextInputProps) => {
  const id = `input-${Name}`;
  return (
    <React.Fragment>
      <input
        type="text"
        id={id}
        className={`${styles.textInput} ${className}`}
        {...defaultProps}
      />
    </React.Fragment>
  )
}

export default FormTextInput;