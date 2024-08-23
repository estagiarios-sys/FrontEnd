import React, { useEffect } from 'react';
import type { Template } from '@pdfme/common';
import { Viewer } from '@pdfme/ui';

export default function View() {
  useEffect(() => {

    const domContainer = document.getElementById('designer-container');

    const template: Template = {

      basePdf: {
        width: 210, // Largura em milímetros (A4)
        height: 297, // Altura em milímetros (A4)
        padding: [10, 10, 10, 10] // Padding: [top, right, boatom, left]
      },

      schemas: [
        {
          top: {
            type: 'text',
            position: {
              x: 0,
              y: 0
            },
            width: 210.02,
            height: 30,
          },
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
          qrcode: {
            type: 'qrcode',
            content: 'https://systextil.com.br/',
            position: {
              x: 7.1,
              y: 271
            },
            width: 26.60,
            height: 23
          },
          barcodes: {
            type: 'code128',
            content: 'https://systextil.com.br/',
            position: {
              x: 148.50,
              y: 272
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
        }
      ]
    };
    
    const inputs = [{ titulo: '', op_produto: '10', qrcode: 'https://systextil.com.br/', barcodes: 'https://systextil.com.br/', infos: 'Informações Genéricas...', line_1: 'teste', line_2: 'teste' }];

    if (domContainer) {
      new Viewer({ domContainer, template, inputs });
    } else {
      console.error('domContainer is null');
    }
  }, []);

  return <div id="designer-container" style={{ width: '100%', height: '100%' }}></div>;
}
