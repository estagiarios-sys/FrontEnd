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

      let backgroundColor: string | undefined;
      let tituloContent: string | undefined;
      let imageContent: string | undefined;

      if (savedTemplate) {
        try {
          const parsedTemplate = JSON.parse(savedTemplate) as Template;
          
          const headStyles = parsedTemplate.schemas[0]?.table?.headStyles as { [key: string]: any };
          if (headStyles?.backgroundColor) {
            backgroundColor = headStyles.backgroundColor;
          }

          const titulo = parsedTemplate.schemas[0]?.titulo as { [key: string]: any };
          if (titulo?.content) {
            tituloContent = titulo.content;
          }

          const img = parsedTemplate.schemas[0]?.image as { [key: string]: any };
          if (img?.content) {
            imageContent = img.content;
          }
        } catch (error) {
          console.error("Erro ao carregar o template salvo:", error);
        }
      }

      // Crie o template padrão
      const template = getDefaultTemplate(table);

      // Aplique os valores extraídos do localStorage, se existirem
      if (backgroundColor && template.schemas[0]?.table?.headStyles) {
        (template.schemas[0].table.headStyles as { [key: string]: any }).backgroundColor = backgroundColor;
      }

      if (tituloContent && template.schemas[0]?.titulo) {
        (template.schemas[0].titulo as { [key: string]: any }).content = tituloContent;
      }

      if (imageContent && template.schemas[0]?.image) {
        (template.schemas[0].image as { [key: string]: any }).content = imageContent;
      }

      const inputs = [
        {
          table: table[0].values.map((_, rowIndex) =>
            table.map(col => col.values[rowIndex])
          ),
          infos: 'Informações Genéricas...',
          op_produto: 'op: 1234',
          titulo: tituloContent || 'Título Aqui', // Usar o título salvo ou o padrão
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
            line,
            image,
            text,
            Table: tableBeta,
            qrcode: barcodes.qrcode,
            barcode: barcodes.code128,
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
        padding: [10, 10, 10, 10],
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
            content: 'op: 1234',
            fontSize: 20,
            position: { x: 166, y: 17.2 },
            width: 36,
            height: 8.5,
          },
          image: {
            type: 'image',
            position: {
              x: 8.7,
              y: 2.9
            },
            width: 33,
            height: 25
          },
          infos: {
            type: 'text',
            fontSize: 20,
            position: { x: 56.7, y: 197.5 },
            width: 87,
            height: 9.8,
          },
          line_1: {
            type: 'line',
            position: { x: 8.2, y: 30 },
            width: 194,
            height: 0.8,
            color: '#000000'
          },
          line_2: {
            type: 'line',
            position: { x: 8.2, y: 195 },
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
            height: 150,
            showHead: true,
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
            columnStyles: {
              minWidth: 10,
              maxWidth: 60,
            }
          },
          qrcode: {
            type: 'qrcode',
            position: { x: 7.1, y: 197.5 },
            width: 26.60,
            height: 23
          },
          barcodes: {
            type: 'code128',
            position: { x: 148.50, y: 199 },
            width: 56,
            height: 19.4
          },
        }
      ]
    };
  };

  return <div id="designer-container" style={{ width: '100%', height: '100%' }}></div>;
}

export default View;