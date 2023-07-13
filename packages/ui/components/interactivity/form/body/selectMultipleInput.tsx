import React, { useState } from "react";

import styles from '../form.module.scss';

interface FormSelectMultipleInputProps extends React.InputHTMLAttributes<HTMLSelectElement> {
  Name: string,
  Values: Record<string, string>;
  OnSelect: (selectedOptions: string[]) => void;
}

const FormSelectMultipleInput = ({
  Name,
  Values,
  OnSelect,
  ...defaultProps
}: FormSelectMultipleInputProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (selectedOption: string) => {
    const updatedOptions = [...selectedOptions];
    if (updatedOptions.includes(selectedOption)) {
      const index = updatedOptions.indexOf(selectedOption);
      updatedOptions.splice(index, 1);
    } else {
      updatedOptions.push(selectedOption);
    }
    setSelectedOptions(updatedOptions);
    OnSelect(updatedOptions);
  };

  const id = `input-${Name}`;

  return (
    <div id={id}>
      {
      Object.entries(Values).map(value => (
        <label key={value[0]}>
          <input type="checkbox" value={value} checked={selectedOptions.includes(value[0])} onChange={() => handleCheckboxChange(value[0])}/> {value[1]}
        </label>
      ))}
    </div>
  )
}

export default FormSelectMultipleInput;