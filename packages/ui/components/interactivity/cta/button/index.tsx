import React from "react";
import styles from './button.module.scss';

type ButtonPossibleType = 'Primary' | 'Secondary' | 'Tertiary' | 'Cancel'
type ButtonPossibleSize = 'Small' | 'Medium' | 'Large'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Type: ButtonPossibleType;
  Size: ButtonPossibleSize;
  Label: string;
}

const Button = ({
  Type = "Primary",
  Size = "Medium",
  Label = "Lorem Ipsum",
  ...defaultProps
}: ButtonProps ) => {    
  
  const classes = `${styles.base} ${styles[`type-${Type}`]} ${styles[`size-${Size}`]}`;
  console.log(classes);
  return (
    <button
      className={classes}
      {...defaultProps}
    >
      {Label}
    </button>
  )
}


export default Button;