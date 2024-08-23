import type { Template } from '@pdfme/common';
import React, { useEffect } from 'react';
import { Viewer } from '@pdfme/ui';

export default function View() {
  useEffect(() => {

    const domContainer = document.getElementById('container');

    const template: Template = {

      basePdf: {
        width: 210, // Largura em milímetros (A4)
        height: 297, // Altura em milímetros (A4)
        padding: [10, 10, 10, 10] // Padding: [top, right, boatom, left]
      },

      schemas: [
        {
          titulo: {
            type: 'text',
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
            position: {
              x: 8.7,
              y: 2.9
            },
            width: 33,
            height: 25
          },

          qrcode: {
            type: 'qrcode',
            position: {
              x: 7.1,
              y: 271
            },
            width: 26.60,
            height: 23
          },

          barcodes: {
            type: 'code128',
            position: {
              x: 148.50,
              y: 272
            },
            width: 56,
            height: 19.4
          },

          infos: {
            type: 'text',
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
              x: 28.7,
              y: 37.85
            },
            width: 150,
            height: 57.5,
            showHead: true,
            head: ["Name", "City", "Description"],
            headWidthPercentages: [30, 30, 40],
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

    const inputs = [
      {
        table: [
          ["Alice", "New York", "Alice is a freelance web designer and developer"],
          ["Bob", "Paris", "Bob is a freelance illustrator and graphic designer"]
        ],
        titulo: 'Título Aqui',
        op_produto: 'op: 555555',
        qrcode: 'https://systextil.com.br/',
        barcodes: 'https://systextil.com.br/',
        infos: 'Informações Genéricas...',
        image: '',
        line_1: 'test',
        line_2: 'test'
      }
    ];

    if (domContainer) {
      new Viewer({ domContainer, template, inputs });
    } else {
      console.error('domContainer is null');
    }
  }, []);

  return <div id="container" style={{ width: '100%', height: '100%' }}></div>;
}
