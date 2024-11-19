import React from 'react';
import CustomSelect from '../genericos/CustomSelect';

const TotalizadorSelect = React.forwardRef(({ value, onChange, options, isOpen, onClick }, ref) => {
  return (
    <td className="py-2 px-4 border-b border-custom-azul text-sm" onClick={onClick}>
      <CustomSelect
        ref={ref}
        options={options}
        value={value}
        onChange={onChange}
        placeholder="Selecione..."
        className="basic-single"
        classNamePrefix="select"
        width="12rem"
        isClearable
      />
    </td>
  );
});

export default TotalizadorSelect;
