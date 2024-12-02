import React, { useState, useCallback } from "react";
import Loading from "../genericos/Loading";
import { linkFinal } from "../../config";
import Cookies from 'js-cookie';
import { RemoveScroll } from 'react-remove-scroll';  // Importe o RemoveScroll

function ModalPrevia({ isOpen, onClose, combinedData }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const handlePreviewPDF = useCallback(async () => {
    
    // Garantir que imgPDF seja uma string (mesmo que vazia)
    if (combinedData.imgPDF === null || combinedData.imgPDF === undefined) {
      combinedData.imgPDF = '';
    }

    try {
      const response = await fetch(`${linkFinal}/pdf/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token'),
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

  // Impedir scroll da página quando o modal está aberto e gerar o PDF
  if (isOpen) {
    if (!isLoading && !pdfUrl) {
      setIsLoading(true); // Começa o carregamento
      handlePreviewPDF(); // Gera o PDF ao abrir o modal
    }
  }

  // Lidar com o evento de pressionar a tecla "Escape" para fechar o modal
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
  } else {
    document.removeEventListener('keydown', handleKeyDown);
  }

  if (!isOpen) return null;

  return (
    <RemoveScroll enabled={isOpen}> {/* Envolva a aplicação com RemoveScroll */}
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
    </RemoveScroll>
  );
}

export default ModalPrevia;
