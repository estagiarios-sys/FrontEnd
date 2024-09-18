// CustomSelect.js
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Select from 'react-select';

const CustomSelect = forwardRef(({ width = "10rem", ...props }, ref) => {
  const selectRef = useRef(null);

  useImperativeHandle(ref, () => ({
    openMenu: () => {
      if (selectRef.current) {
        selectRef.current.focus();
      }
    },
    closeMenu: () => {
      if (selectRef.current) {
        selectRef.current.blur();
      }
    },
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: width,
      minWidth: '0',
    }),
  };

  return (
    <Select
      {...props}
      ref={selectRef}
      classNamePrefix="Select"
      styles={customStyles}
      menuPortalTarget={document.body}
    />
  );
});

export default CustomSelect;
