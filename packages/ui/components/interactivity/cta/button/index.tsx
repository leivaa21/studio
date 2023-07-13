import React from "react";
import NextLink from "next/link";

import styles from './button.module.scss';

type ButtonPossibleType = 'Primary' | 'Secondary' | 'Tertiary' | 'Cancel'
type ButtonPossibleSize = 'Small' | 'Medium' | 'Large'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  Type: ButtonPossibleType;
  Size: ButtonPossibleSize;
  Label: string;
  Link?: boolean;
  href?: string;
}

const Button = ({
  Type = "Primary",
  Size = "Medium",
  Label,
  Link,
  href,
  ...defaultProps
}: ButtonProps ) => {    
  
  const classes = `${styles.base} ${styles[`type-${Type}`]} ${styles[`size-${Size}`]}`;
  
  if(Link) {
    if(!href) {
      throw new Error('Cant initialize a Link without href');
    }

    return <NextLink className={classes} href={href}>{Label}</NextLink>
  }
  
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