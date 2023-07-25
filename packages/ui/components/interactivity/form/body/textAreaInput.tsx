import React from "react";

import styles from '../form.module.scss';

interface FormTextInputProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  Name: string,
}

const FormAreaTextInput = ({
  Name,
  className,
  ...defaultProps
}: FormTextInputProps) => {
  const id = `input-${Name}`;
  return (
    <React.Fragment>
      <textarea
        type="textarea"
        id={id}
        className={`${styles.textInput} ${className}`}
        {...defaultProps}
      />
    </React.Fragment>
  )
}

export default FormAreaTextInput;