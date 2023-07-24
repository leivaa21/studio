import React, { useEffect, useState } from "react";

interface FormSelectMultipleInputProps extends React.InputHTMLAttributes<HTMLDivElement> {
  Name: string;
  Values: Record<string, string>;
  SelectedValues?: string[];
  OnSelect: (selectedOptions: string[]) => void;
}

const FormSelectMultipleInput = ({
  Name,
  Values,
  OnSelect,
  SelectedValues,
  ...defaultProps
}: FormSelectMultipleInputProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    setSelectedOptions(SelectedValues || [])
  }, [SelectedValues])

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
    <div id={id} {...defaultProps}>
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