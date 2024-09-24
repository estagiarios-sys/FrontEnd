import React, { useEffect, useState } from "react";
import Loading from "../genericos/Loading";

function ModalPdfView({ isOpen, onClose, combinedData }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Impedir scroll da página quando o modal está aberto
  useEffect(() => {
    const hasScroll = document.body.scrollHeight > window.innerHeight;

    if (isOpen) {
      setIsLoading(true); // Começa o carregamento
      handlePreviewPDF(); // Gera o PDF ao abrir o modal
      if (hasScroll) {
        document.body.style.paddingRight = "6px"; // Adiciona padding
      }
      document.body.style.overflow = "hidden"; // Desativa o scroll
    } else {
      document.body.style.overflow = ""; // Restaura o scroll
      document.body.style.paddingRight = ""; // Remove o padding
    }

    return () => {
      document.body.style.overflow = ""; // Limpeza no fechamento
      document.body.style.paddingRight = ""; // Limpeza no fechamento
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

  const handlePreviewPDF = async () => {
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
      const url = URL.createObjectURL(blob);
      setPdfUrl(url); // Atualiza para usar o URL do PDF
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
    } finally {
      setIsLoading(false); // Finaliza o carregamento após o PDF ser gerado
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
      onClick={onClose} // Fecha o modal ao clicar fora dele
    >
      <div className="bg-white p-0 rounded-md relative w-4/5 max-w-[600px] max-h-[90%] overflow-y-auto">
        {isLoading ? (
          <Loading /> // Exibe o loading enquanto carrega o PDF
        ) : (
          pdfUrl && (
            <div className="flex justify-center items-center flex-col h-full">
              <iframe src={pdfUrl} width="100%" height="600px" title="PDF Preview" />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ModalPdfView;