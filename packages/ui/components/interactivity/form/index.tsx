import React from "react"
import FormHeader from './header';
import FormBody from './body';
import FormTextInput from './body/textInput';
import FormHint from './hint';
import styles from './form.module.scss';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}
const Form = ({
  children,
  ...defaultProps
}: FormProps) => {
  return (
    <form
      {...defaultProps}
      className={styles.base}
    >
      {children}    
    </form>
  )

}

export {FormHeader, FormBody, FormTextInput, FormHint};

export default Form;