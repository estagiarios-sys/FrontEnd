import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import Select from 'react-select';

// Define o componente CustomSelect usando forwardRef, permitindo que referências externas possam controlar o componente
const CustomSelect = forwardRef(({ width = "10rem", ...props }, ref) => {

  // Cria uma referência ao componente Select para manipulação direta
  const selectRef = useRef(null);

  // Define métodos que podem ser acessados através da referência externa (ref)
  useImperativeHandle(ref, () => ({
    // Método para abrir o menu do select
    openMenu: () => {
      if (selectRef.current) {
        selectRef.current.focus(); // Foca no select
        selectRef.current.openMenu(); // Abre o menu dropdown
      }
    },
    // Método para fechar o menu do select
    closeMenu: () => {
      if (selectRef.current) {
        selectRef.current.blur(); // Remove o foco do select, fechando o menu
      }
    },
  }));

  // Define estilos personalizados para o componente Select
  const customStyles = {
    // Personaliza o estilo do controle principal (input) do select
    control: (provided) => ({
      ...provided, // Usa os estilos padrão fornecidos pelo react-select
      width: width, // Define a largura do componente de acordo com a prop `width`
      minWidth: '0', // Garante que o select não tenha uma largura mínima, permitindo ajustes
    }),
  };

  // Renderiza o componente Select do react-select, passando os props e a referência
  return (
    <Select
      {...props} // Propaga todas as outras props recebidas para o Select
      ref={selectRef} // Associa a referência ao select para manipulação
      classNamePrefix="Select" // Define um prefixo para classes CSS usadas pelo Select
      styles={customStyles} // Aplica os estilos personalizados definidos anteriormente
      menuPortalTarget={document.body} // Faz com que o menu seja renderizado no body para evitar problemas de overflow
    />
  );
});

// Exporta o componente CustomSelect para ser utilizado em outras partes do aplicativo
export default CustomSelect;