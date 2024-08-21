import React from 'react';
import ReactDOM from 'react-dom';
//import Nova from './pdfGenerate';

export default function NewWindow() {
  const openInNewWindow = () => {
    const width = 800; // Ajuste conforme necessário
    const height = 600; // Ajuste conforme necessário
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    const newWindow = window.open(
      '',
      '_blank',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nova Janela</title>
        </head>
        <body>
          <div id="designer-container" style="width: 100%; height: 100%;"></div>
        </body>
        </html>
      `);

      newWindow.document.close();

      newWindow.onload = () => {
       // ReactDOM.render(<Nova />, newWindow.document.getElementById('designer-container'));
      };
    }
  };

  return (
    <button onClick={openInNewWindow} style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
      Abrir em Nova Janela
    </button>
  );
}
