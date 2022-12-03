import styles from './form.module.scss';

interface FormHeaderProps extends React.BaseHTMLAttributes<HTMLElement> {
}
const FormHeader = ({
  children,
  ...defaultProps
}: FormHeaderProps) => {

  return (
    <div
      className={styles.header}
      {...defaultProps}
    >
      {children}
    </div>
  )

}

export default FormHeader;