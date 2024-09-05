import React, { useEffect, useRef, useState } from 'react';
import { Designer } from '@pdfme/ui';
import { Template } from '@pdfme/common';
import { text, image, barcodes, line, rectangle, ellipse, svg, tableBeta } from "@pdfme/schemas";
import ModalModal from 'components/modais/ModalModal';

export default function Nova() {
  
  const designerRef = useRef<Designer | null>(null);
  const [savedTemplate, setSavedTemplate] = useState<Template | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura do modal
  const [modalMessage, setModalMessage] = useState(""); // Estado para a mensagem do modal
  const [templateName, setTemplateName] = useState(""); // Estado para armazenar o nome do template

  useEffect(() => {

    const domContainer = document.getElementById('designer-container');

    if (domContainer) {
      const template: Template = {
        // esse cara gera a borda rosa do pdf que serve para enquadrar a tabela, essa mesma borda não é gerada na hora da exportação.
        basePdf: { 
          width: 210, // Largura em milímetros (A4)
          height: 297, // Altura em milímetros (A4)
          padding: [5, 5, 5, 5] // Padding: [top, right, bottom, left]
        },
        schemas: [
          {
            titulo: {
              type: 'text',
              content: 'Título Aqui',
              fontSize: 47,
              position: {
                x: 64,
                y: 7.7
              },
              width: 81.1,
              height: 15.2,
            },

            op_produto: {
              type: 'text',
              content: 'op: 555555',
              fontSize: 20,
              position: {
                x: 166,
                y: 17.2
              },
              width: 36,
              height: 8.5,
            },

            image: {
              type: 'image',
              content: 'data:image/png;base64,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',
              position: {
                x: 8.7,
                y: 6
              },
              width: 33,
              height: 23
            },

            qrcode: {
              type: 'qrcode',
              content: 'https://systextil.com.br/',
              position: {
                x: 7.1,
                y: 269
              },
              width: 26.60,
              height: 20
            },

            barcodes: {
              type: 'code128',
              content: 'https://systextil.com.br/',
              position: {
                x: 145,
                y: 269
              },
              width: 56,
              height: 19.4
            },

            infos: {
              type: 'text',
              content: 'Informações Genéricas...',
              fontSize: 20,
              position: {
                x: 56.7,
                y: 277.3
              },
              width: 87,
              height: 9.8,
            },

            line_1: {
              type: 'line',
              position: {
                x: 8.2,
                y: 30
              },
              width: 194,
              height: 0.8,
              color: '#000000'
            },

            line_2: {
              type: 'line',
              position: {
                x: 8.2,
                y: 266
              },
              width: 194,
              height: 0.8,
              color: '#000000'
            },

            table: {
              type: 'table',
              position: {
                x: 20,
                y: 46
              },
              width: 170,
              height: 53,
              content: JSON.stringify([
                ["%dataCollumn%", "%dataCollumn%", "%dataCollumn%"],
                ["%dataCollumn%", "%dataCollumn%", "%dataCollumn%"]
              ]),
              showHead: true,
              head: ["%tableName%", "%tableName%", "%tableName%"],
              headWidthPercentages: [30, 30, 40],
              tableStyles: {
                borderWidth: 0.3,       //espessura da borda
                borderColor: "#000000" //cor da borda da tabela
              },
              
              headStyles: {
                fontName: "Helvetica",
                fontSize: 13,
                characterSpacing: 0,
                alignment: "left",
                verticalAlignment: "middle",
                lineHeight: 1,
                fontColor: "#ffffff",
                backgroundColor: "#2980ba",
                borderWidth: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0
                },
                padding: {
                  top: 5,
                  right: 5,
                  bottom: 5,
                  left: 5
                }
              },
              bodyStyles: {
                fontName: "Helvetica",
                fontSize: 13,
                characterSpacing: 0,
                alignment: "left",
                verticalAlignment: "middle",
                lineHeight: 1,
                fontColor: "#000000",
                borderColor: "#888888",
                alternateBackgroundColor: "#f5f5f5",
                borderWidth: {
                  top: 0.1,
                  right: 0.1,
                  bottom: 0.1,
                  left: 0.1
                },
                padding: {
                  top: 5,
                  right: 5,
                  bottom: 5,
                  left: 5
                }
              },
              columnStyles: {}
            }
          }
        ]
      };

      const plugins = { text, image, line, rectangle, ellipse, svg, qrcode: barcodes.qrcode, barcode: barcodes.code128, table: tableBeta };

      const designer = new Designer({ domContainer, template, options: { lang: 'en', labels: { fieldsList: 'Lista de Elementos' } }, plugins })

      designerRef.current = designer;

      designer.onSaveTemplate((updatedTemplate: Template) => {
        console.log('Template antes de ser salvo:', updatedTemplate); // Adicione este log
        setSavedTemplate(updatedTemplate);
      });
      
      setTimeout(() => {
        const currentTemplate = designer.getTemplate();
        designer.saveTemplate();
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
      
      // Abre o modal para perguntar o nome do template
      setModalMessage("Digite o nome para salvar o template:");
      setIsModalOpen(true);
    }
  };


  const handleConfirmModal = (inputValue?: string) => {
    if (inputValue) {
      // Salva o template no localStorage
      localStorage.setItem(inputValue, JSON.stringify(savedTemplate));
      console.log('Template salvo com o nome:', inputValue);
      
      // Atualiza a mensagem do modal para mostrar um sucesso
      setModalMessage("Template salvo com sucesso!");
      setIsModalOpen(false);
      
      // Limpa o nome do template
      setTemplateName("");
    } else {
      alert("Por favor, digite um nome válido para o template.");
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
      <button className='ml-0.5  h-8 border border-black rounded-md transition-colors duration-300 hover:border-blue-200' onClick={handleManualSave}>Salvar</button>

      <div id="designer-container" style={{ width: '100%', height: '100%' }}></div>
      
      {/* Componente ModalModal */}
      <ModalModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        onConfirm={handleConfirmModal} 
        message={modalMessage} 
        modalType="DIGITAR_NOME" 
        // Passa a função de atualização do nome
        onNameChange={handleNameChange}
      />
    </div>
  );
}