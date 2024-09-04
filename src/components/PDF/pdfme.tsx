import React, { useEffect, useRef, useState } from 'react';
import { Designer } from '@pdfme/ui';
import { Template } from '@pdfme/common';
import { text, image, barcodes, line, rectangle, ellipse, svg, tableBeta } from "@pdfme/schemas";
import ModalModal from 'components/modais/ModalModal';

export default function Nova() {
  
  const designerRef = useRef<Designer | null>(null);
  const [savedTemplate, setSavedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    const domContainer = document.getElementById('designer-container');

    if (domContainer) {
      const template: Template = {
        // Configurações do template
        basePdf: { 
          width: 210,
          height: 297,
          padding: [10, 10, 10, 10]
        },
        schemas: [
          {
            top: { type: 'text', position: { x: 0, y: 0 }, width: 210.02, height: 30 },
            bottom: { type: 'text', position: { x: 0, y: 267.029376 }, width: 210.02, height: 30 },
            titulo: { type: 'text', content: 'Título Aqui', fontSize: 47, position: { x: 64, y: 7.7 }, width: 81.1, height: 15.2 },
            op_produto: { type: 'text', content: 'op: 555555', fontSize: 20, position: { x: 166, y: 17.2 }, width: 36, height: 8.5 },
            image: { type: 'image', content: 'data:image/png;base64,...', position: { x: 8.7, y: 2.9 }, width: 33, height: 25 },
            qrcode: { type: 'qrcode', content: 'https://systextil.com.br/', position: { x: 7.1, y: 271 }, width: 26.60, height: 23 },
            barcodes: { type: 'code128', content: 'https://systextil.com.br/', position: { x: 148.50, y: 272 }, width: 56, height: 19.4 },
            infos: { type: 'text', content: 'Informações Genéricas...', fontSize: 20, position: { x: 56.7, y: 277.3 }, width: 87, height: 9.8 },
            line_1: { type: 'line', position: { x: 8.2, y: 30 }, width: 194, height: 0.8, color: '#000000' },
            line_2: { type: 'line', position: { x: 8.2, y: 266 }, width: 194, height: 0.8, color: '#000000' },
            table: { type: 'table', position: { x: 20, y: 46 }, width: 170, height: 53, content: JSON.stringify([["%dataCollumn%", "%dataCollumn%", "%dataCollumn%"], ["%dataCollumn%", "%dataCollumn%", "%dataCollumn%"]]), showHead: true, head: ["%tableName%", "%tableName%", "%tableName%"], headWidthPercentages: [30, 30, 40], tableStyles: { borderWidth: 0.3, borderColor: "#000000" }, headStyles: { fontName: "Helvetica", fontSize: 13, characterSpacing: 0, alignment: "left", verticalAlignment: "middle", lineHeight: 1, fontColor: "#ffffff", backgroundColor: "#2980ba", borderWidth: { top: 0, right: 0, bottom: 0, left: 0 }, padding: { top: 5, right: 5, bottom: 5, left: 5 } }, bodyStyles: { fontName: "Helvetica", fontSize: 13, characterSpacing: 0, alignment: "left", verticalAlignment: "middle", lineHeight: 1, fontColor: "#000000", borderColor: "#888888", alternateBackgroundColor: "#f5f5f5", borderWidth: { top: 0.1, right: 0.1, bottom: 0.1, left: 0.1 }, padding: { top: 5, right: 5, bottom: 5, left: 5 } }, columnStyles: {} }
          }
        ]
      };

      const plugins = { text, image, line, rectangle, ellipse, svg, qrcode: barcodes.qrcode, barcode: barcodes.code128, table: tableBeta };

      const designer = new Designer({ domContainer, template, options: { lang: 'en', labels: { fieldsList: 'Lista de Elementos' } }, plugins });

      designerRef.current = designer;

      designer.onSaveTemplate((updatedTemplate: Template) => {
        setSavedTemplate(updatedTemplate);
      });

      setTimeout(() => {
        const currentTemplate = designer.getTemplate();
        designer.saveTemplate(); // Garante que o template atual seja salvo
      }, 3000);

    } else {
      console.error('Container do DOM não encontrado');
    }
  }, []);

  useEffect(() => {
    console.log('Estado atual de savedTemplate:', savedTemplate);
  }, [savedTemplate]);

  const handleManualSave = () => {
    if (designerRef.current) {
      const updatedTemplate = designerRef.current.getTemplate();
      setSavedTemplate(updatedTemplate);
      setModalMessage("Digite o nome para salvar o template:");
      setIsModalOpen(true);
    }
  };

  const handleConfirmModal = () => {
    if (templateName && savedTemplate) {
      // Salva o template no localStorage
      localStorage.setItem(templateName, JSON.stringify(savedTemplate));
      console.log('Template salvo com o nome:', templateName);
      setModalMessage("Template salvo com sucesso!");
      setIsModalOpen(true);
      setTemplateName(""); // Limpa o nome do template
    } else {
      setModalMessage("Digite um nome válido para o template.");
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNameChange = (inputValue: string) => {
    setTemplateName(inputValue);
  };

  return (
    <div>
      <button className='ml-0.5 h-8 border border-black rounded-md transition-colors duration-300 hover:border-blue-200' onClick={handleManualSave}>
        Salvar
      </button>
      <div id="designer-container" style={{ width: '100%', height: '100%' }}></div>
      <ModalModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        onConfirm={handleConfirmModal} 
        message={modalMessage} 
        modalType="DIGITAR_NOME" 
        onNameChange={handleNameChange}
      />
    </div>
  );
}
