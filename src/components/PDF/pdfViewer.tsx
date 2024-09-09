import type { Template } from '@pdfme/common';
import React, { useEffect } from 'react';
import { Viewer } from '@pdfme/ui';
import { barcodes, text, tableBeta, line, rectangle, ellipse, svg, image } from "@pdfme/schemas";

interface TableData {
  column: string; // Nome da coluna
  values: string[]; // Valores da coluna
}

interface ViewProps {
  table: TableData[]; 
  templateKey: string | null;
}

const View: React.FC<ViewProps> = ({ table, templateKey  }) => {

  useEffect(() => {
    const generatePDF = () => {
      const domContainer = document.getElementById('designer-container');
      const savedTemplate = templateKey ? localStorage.getItem(templateKey) : null;

      if (!domContainer) {
        console.error('domContainer is null');
        return;
      }

      let updatedSchemas: any;

      if (savedTemplate) {
        try {
          const parsedTemplate = JSON.parse(savedTemplate) as Template;
          
          updatedSchemas = parsedTemplate.schemas[0];
          
        } catch (error) {
          console.error("Erro ao carregar o template salvo:", error);
        }
      }

      // Crie o template padrão
      const template = getDefaultTemplate(table);

      // Aplique as alterações de posição ou redimensionamento dos objetos (exceto tabela)
      if (updatedSchemas) {
        Object.keys(updatedSchemas).forEach(key => {
          if (key !== 'table') {
            template.schemas[0][key] = updatedSchemas[key];
          }
        });
      }

      const inputs = [
        {
          table: table[0].values.map((_, rowIndex) =>
            table.map(col => col.values[rowIndex])
          ),
          infos: 'Informações Aqui',
          op_produto: 'op: 555555',
          titulo: 'Título Aqui',
          qrcode: 'https://systextil.com.br/',
          barcodes: '1234567890',
        }
      ];

      try {
        new Viewer({
          domContainer,
          template,
          inputs,
          plugins: {
            table: tableBeta,
            line,
            image,
            text,
            qrcode: barcodes.qrcode,
            barcode: barcodes.code128,
            rectangle,
            ellipse,
            svg
          }
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    };

    generatePDF();
  }, [table]);

  const getDefaultTemplate = (table: TableData[]): Template => {
    const columnCount = table.length;
    const widthPercentage = 100 / columnCount;

    return {
      basePdf: {
        width: 210,
        height: 297,
        padding: [5, 5, 5, 5],
      },
      schemas: [
        {
          titulo: {
            type: 'text',
            content: 'Título Aqui', // Valor padrão que pode ser sobrescrito
            fontSize: 47,
            position: { x: 64, y: 7.7 },
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
          
          table: {
            type: 'table',
            position: {
              x: 10,
              y: 36
            },
            width: 190,
            height: 200, // Limite o tamanho da tabela para não ultrapassar a página, esta dando erro aqui
            showHead: true,
            pageBreak: 'auto', // Habilitar quebra de página, se necessário
            head: table.map(col => col.column),
            headWidthPercentages: Array(columnCount).fill(widthPercentage),
            tableStyles: {
              borderWidth: 0.3,
              borderColor: "#000000"
            },
            headStyles: {
              fontName: "Helvetica",
              fontSize: 13,
              characterSpacing: 0,
              alignment: "left",
              verticalAlignment: "middle",
              lineHeight: 1,
              fontColor: "#ffffff",
              backgroundColor: "#2980ba", // Valor padrão que pode ser sobrescrito
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
            columnStyles: {},
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
        }
      ]
    };
  };
  return <div id="designer-container" style={{ width: '100%', height: '100hv' }}></div>;
}

export default View;
