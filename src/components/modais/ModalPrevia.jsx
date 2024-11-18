import React, { useEffect, useState, useCallback } from "react";
import Loading from "../genericos/Loading";
import { linkFinal } from "../../config";

function ModalPrevia({ isOpen, onClose, combinedData }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  // Função para gerar o PDF
  const handlePreviewPDF = useCallback(async () => {
    try {
      const response = await fetch(`${linkFinal}/pdf/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('token'),
        },
        body: JSON.stringify(combinedData),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar o PDF.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
    } finally {
      setIsLoading(false);
    }
  }, [combinedData]); // Inclua combinedData como dependência

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
  }, [isOpen, handlePreviewPDF]); // Adicione handlePreviewPDF aqui

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

export default ModalPrevia;