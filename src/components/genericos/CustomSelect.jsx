import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Select from 'react-select';

const CustomSelect = forwardRef((props, ref) => {
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

    return (
        <Select
            {...props}
            ref={(el) => {
                selectRef.current = el;
                if (props.innerRef) {
                    props.innerRef(el);
                }
            }}
        />
    );
});

export default CustomSelect;
