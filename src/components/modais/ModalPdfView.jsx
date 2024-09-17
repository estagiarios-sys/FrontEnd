import React, { useEffect, useState } from "react";

function ModalPdfView({ isOpen, onClose, combinedData }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (isOpen) {
      HandlePreviewPDF(); // Chama a função para gerar o PDF
      document.body.style.overflow = 'hidden'; // Impede o scroll da página
    } else {
      document.body.style.overflow = 'auto'; // Permite o scroll da página
    }

    return () => {
      document.body.style.overflow = 'auto'; // Permite o scroll da página
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const HandlePreviewPDF = async () => {
    try {
      const response = await fetch('http://localhost:8080/pdf/preview', { // Backend Java
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData), // Envia o HTML da tabela completa
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar o PDF.');
      }

      const blob = await response.blob();
      console.log('Blob gerado:', blob);
      const url = URL.createObjectURL(blob);
      console.log('PDF gerado:', url);
      setPdfUrl(url); // Atualiza para usar o URL do PDF
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
    }
  };

  return (
    <div
      onClick={onClose}
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
          padding: '0px', // Adicionando padding para espaçamento interno, removi para ocultar o fundo branco
          borderRadius: '5px',
          position: 'relative',
          width: '80%',
          maxWidth: '600px', // Aumentando o limite máximo para a largura
          maxHeight: '90%', // Garantindo que a altura não exceda 90% da tela
          overflowY: 'auto', // Permitindo rolagem se o conteúdo exceder a altura do modal
        }}
      >
        {pdfUrl && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column', // Colocando os elementos um embaixo do outro
              height: '100%',
            }}
          >
            <iframe src={pdfUrl} width="100%" height="600px" title="PDF Preview" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalPdfView;
