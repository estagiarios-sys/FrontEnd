import { Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { text, barcodes, line, rectangle, ellipse, svg, tableBeta, image } from "@pdfme/schemas";

interface TableData {
  column: string; // Nome da coluna
  values: string[]; // Valores da coluna
}

export async function generatePDF(tableData: TableData[], templateKey: string | null) {
  function transformTableData(tableData: TableData[]) {
    const headers: string[] = tableData.map((item: TableData) => item.column); // Nome das colunas
    const values: string[][] = tableData[0].values.map((_, rowIndex: number) => 
        tableData.map((col: TableData) => col.values[rowIndex])
    ); // Transforma em linhas e colunas

    return {
        headers,
        values
    };
  }

  const transformedData = transformTableData(tableData);

  const columnCount = tableData.length;
  const widthPercentage = 100 / columnCount;

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const opProduto = `op: ${randomNum}`;

  let backgroundColor: string | undefined;
  let tituloContent: string | undefined;
  let imageContent: string | undefined;

  if (templateKey) {
    const savedTemplate = localStorage.getItem(templateKey);
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
  }

  // Template padrão
  const template: Template = {
    basePdf: {
      width: 210, // Largura em milímetros (A4)
      height: 297, // Altura em milímetros (A4)
      padding: [10, 10, 10, 10] // Padding: [top, right, bottom, left]
    },
    schemas: [
      {
        titulo: {
          type: 'text',
          content: tituloContent || 'Título Aqui', // Usar o título salvo ou o padrão
          fontSize: 47,
          position: { x: 64, y: 7.7 },
          width: 81.1,
          height: 15.2,
        },

        opProduto: {
          type: 'text',
          content: opProduto,
          fontSize: 20,
          position: { x: 166, y: 17.2 },
          width: 36,
          height: 8.5,
        },

        image: {
          type: 'image',
          content: imageContent || 'data:image/png;base64,...', // Usar a imagem salva ou a padrão
          position: {
            x: 8.7,
            y: 2.9
          },
          width: 33,
          height: 25
        },

        qrcode: {
          type: 'qrcode',
          position: { x: 7.1, y: 230 },
          width: 26.60,
          height: 23
        },

        barcodes: {
          type: 'code128',
          position: { x: 148.50, y: 233 },
          width: 56,
          height: 19.4
        },

        infos: {
          type: 'text',
          fontSize: 20,
          position: { x: 56.7, y: 227 },
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
          position: { x: 8.2, y: 224 },
          width: 194,
          height: 0.8,
          color: '#000000'
        },

        table: {
          type: 'table',
          position: {
            x: 28.7,
            y: 37.85
          },
          width: 150,
          height: 57.5,
          content: JSON.stringify(transformedData.values),
          showHead: true,
          head: transformedData.headers,
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
            backgroundColor: backgroundColor || "#2980ba", // Usar a cor de fundo salva ou a padrão
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

  const inputs = [
    {
      table: transformedData.values, 
      titulo: tituloContent || "Título Aqui",  
      opProduto: opProduto,
      qrcode: 'https://systextil.com.br/',
      barcodes: 'https://systextil.com.br/',
      infos: 'Informações Genéricas...',
      image: imageContent || 'data:image/png;base64,...'
    }
  ];

  try {
    console.log("Template:", template);
    console.log("Inputs:", inputs);

    const pdf = await generate({
      template,
      inputs,
      plugins: {
        text,
        line,
        rectangle,
        ellipse,
        svg,
        qrcode: barcodes.qrcode,
        barcode: barcodes.code128,
        Table: tableBeta, 
        image
      }
    });

    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    console.log("Generated PDF Blob:", blob);
    console.log("Generated PDF URL:", url);
    window.open(url);  

    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}
