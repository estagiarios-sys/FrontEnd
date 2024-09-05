import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Select from 'react-select';

const CustomSelect = forwardRef(({ width = "10rem", ...props }, ref) => {
    const selectRef = useRef(null);

    // Permite que o componente pai chame métodos do Select
    useImperativeHandle(ref, () => ({
        openMenu: () => {
            if (selectRef.current) {
                selectRef.current.focus(); // Foca no Select para abrir o menu
                selectRef.current.openMenu(); // Abre o menu do Select
            }
        },
    }));

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: width + ' !important', // Força a largura com !important
            minWidth: '0 !important', // Garante que não haja largura mínima definida
        }),
    };

    return (
        <Select
            {...props}
            ref={(el) => {
                selectRef.current = el;
                if (props.innerRef) {
                    props.innerRef(el);
                }
            }}
            classNamePrefix="Select"
            styles={customStyles}
        />
    );
});

export default CustomSelect;
