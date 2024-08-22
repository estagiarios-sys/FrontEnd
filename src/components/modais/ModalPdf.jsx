import React from "react";
import View from "../PDF/pdfViewer";

function ModalPdf({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '0px',
          borderRadius: '5px',
          position: 'relative',
          width: '80%',
          maxWidth: '600px', // Limite máximo para a largura
          maxHeight: '90%', // Garantindo que a altura não exceda 90% da tela
          overflowY: 'auto', // Permitindo rolagem se o conteúdo exceder a altura do modal
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo semi-transparente
            border: '1px solid #ccc', // Borda cinza clara
            borderRadius: '0%', 
            width: '60px', // Largura do botão
            height: '30px', // Altura do botão
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: 1001, // Garantindo que o botão esteja sobre o conteúdo
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

export default ModalPdf;