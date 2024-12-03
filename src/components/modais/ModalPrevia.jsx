import React, { useState, useCallback, useRef } from "react";
import Loading from "../genericos/Loading";
import { linkFinal } from "../../config";
import Cookies from 'js-cookie';
import { RemoveScroll } from 'react-remove-scroll';

function ModalPrevia({ isOpen, onClose, combinedData }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePreviewPDF = useCallback(async () => {
    if (!combinedData) {
      setIsLoading(false);
      return;
    }

    const imgPDF = combinedData.imgPDF || '';
    const titlePDF = combinedData.titlePDF || '';

    try {
      const response = await fetch(`${linkFinal}/pdf/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Cookies.get('token'),
        },
        body: JSON.stringify({ ...combinedData, imgPDF, titlePDF }),
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
  }, [combinedData]);

  // Ensure handlePreviewPDF is called only once per mount
  const hasFetchedRef = useRef(false);
  if (!hasFetchedRef.current) {
    hasFetchedRef.current = true;
    handlePreviewPDF();
  }

  // Event listener for 'Escape' key
  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose();
  }

  // Add or remove event listener based on 'isOpen'
  const listenerAddedRef = useRef(false);
  if (isOpen && !listenerAddedRef.current) {
    document.addEventListener('keydown', handleKeyDown);
    listenerAddedRef.current = true;
  } else if (!isOpen && listenerAddedRef.current) {
    document.removeEventListener('keydown', handleKeyDown);
    listenerAddedRef.current = false;
  }

  if (!isOpen) return null;

  return (
    <RemoveScroll enabled={isOpen}>
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000]"
        onClick={onClose}
      >
        <div
          className="bg-white p-0 rounded-md relative w-4/5 max-w-[600px] max-h-[90%] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <Loading />
          ) : (
            pdfUrl && (
              <div className="flex justify-center items-center flex-col h-full">
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="600px"
                  title="PDF Preview"
                />
              </div>
            )
          )}
        </div>
      </div>
    </RemoveScroll>
  );
}

export default ModalPrevia;