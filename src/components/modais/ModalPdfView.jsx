import React, { useEffect, useState } from "react";

function ModalPdfView({ isOpen, onClose, combinedData }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  // Impedir scroll da página quando o modal está aberto
  useEffect(() => {
    if (isOpen) HandlePreviewPDF();
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    document.body.style.paddingRight = isOpen ? '6px' : '';
    
    return () => {
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '';
    };
}, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
      onClick={onClose} // Fecha o modal ao clicar fora dele
    >
      <div className="bg-white p-0 rounded-md relative w-4/5 max-w-[600px] max-h-[90%] overflow-y-auto">
        {pdfUrl && (
          <div class="flex justify-center items-center flex-col h-full">
            <iframe src={pdfUrl} width="100%" height="600px" title="PDF Preview" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalPdfView;