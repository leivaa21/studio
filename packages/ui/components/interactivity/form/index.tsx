import React from "react"
import FormHeader from './header';
import FormBody from './body';
import FormTextInput from './body/textInput';
import FormHint from './hint';
import styles from './form.module.scss';
import FormAreaTextInput from "./body/textAreaInput";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}
const Form = ({
  children,
  className,
  ...defaultProps
}: FormProps) => {
  return (
    <form
      {...defaultProps}
      className={`${className} ${styles.base}`}
    >
      {children}    
    </form>
  )

}

export {FormHeader, FormBody, FormTextInput, FormHint, FormAreaTextInput};

export default Form;