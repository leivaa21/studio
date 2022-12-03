import styles from '../form.module.scss';

interface FormBodyProps
  extends React.BaseHTMLAttributes<HTMLElement> { }

const FormBody = ({
  children,
  ...defaultProps
}: FormBodyProps) => {
  return (
    <div
      className={styles.body}
      {...defaultProps}
    >
      {children}
    </div>
  )
}

export default FormBody;