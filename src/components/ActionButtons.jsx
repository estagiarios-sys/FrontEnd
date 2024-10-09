import React from "react";

function ActionButtons({
  handleModalGenerate,
  handleModalAlert,
  modals,
  openModal,
  closeModal,
  selectedColumns,
  setCombinedData,
  generateFullTableHTML,
  columns,
  tableData,
  columnWidths,
  titlePdf,
  base64Image,
}) {
  return (
    <div className="w-full flex flex-row justify-between mt-4">
      <div className="flex flex-col justify-start items-start ml-36">
        <h1 className="font-bold text-3xl">Ações</h1>
        <div className="flex mt-3">
          <button
            className="p-2 px-5 text-white bg-custom-azul hover:bg-custom-azul-escuro active:bg-custom-azul rounded-lg mr-2"
            onClick={() => openModal('consultar')}
          >
            Consultar
          </button>
          <button
            className="p-2 px-5 text-white bg-custom-azul hover:bg-custom-azul-escuro active:bg-custom-azul rounded-lg mr-2"
            onClick={() => {
              if (selectedColumns.length === 0) {
                openModal('alert', 'ALERTA', 'Por favor, monte uma consulta antes de salvar.');
              } else {
                openModal('salvarCon');
              }
            }}
          >
            Salvar Consulta
          </button>
        </div>
      </div>
      <div className="flex mr-36 justify-center items-center">

      {/* Botão Salvos Comentado pois precisa rever toda a estrutura do componente para que funcione corretamente, até onde foi visto precisa arrumar as rotas. */}
      {/*
        <div className="mx-2">
          <div className="flex flex-col justify-center items-center">
            <button onClick={() => openModal('salvos')} className="flex flex-col justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
              </svg>
              <label htmlFor="mais">Salvos</label>
            </button>
          </div>
        </div>
        */}
      
        <div className="mx-2">
          <div className="flex flex-col justify-center items-center">
            <button onClick={() => openModal('sql')} className="flex flex-col justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              <span>SQL</span>
            </button>
          </div>
        </div>
        <div className="mx-2">
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={() => {
                if (selectedColumns.length === 0) {
                  openModal('alert', 'ALERTA', 'Por favor, selecione pelo menos uma coluna.');
                } else {
                  openModal('filtro');
                }
              }}
              className="relative flex flex-col justify-center items-center"
            >
              {modals.filtro && (
                <span className="absolute -top-2 -right-1 bg-custom-vermelho text-white rounded-full text-xs w-4 h-4 flex justify-center items-center">
                  {modals.filtro}
                </span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" name="mais" />
              </svg>
              <span>Filtros</span>
            </button>
          </div>
        </div>
        <div className="mx-2">
          <div className="flex flex-col justify-center items-center">
            <button onClick={() => openModal('editar')} className="flex flex-col justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              <span>Editar</span>
            </button>
          </div>
        </div>
        <div className="mx-2">
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={() => {
                if (tableData.length === 0) {
                  openModal('alert', 'ALERTA', 'Gere o relatório para visualizar a prévia.');
                } else {
                  const updatedColumnWidths = columnWidths;
                  const combinedData = {
                    fullTableHTML: generateFullTableHTML(columns, tableData, null, updatedColumnWidths, 15),
                    titlePDF: titlePdf,
                    imgPDF: base64Image,
                  };
                  setCombinedData(combinedData);
                  openModal('previa');
                }
              }}
              className="flex flex-col justify-center items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              <span>Prévia</span>
            </button>
          </div>
        </div>
        <div className="mx-2">
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={async () => {
                if (tableData.length === 0) {
                  openModal('alert', 'ALERTA', 'Gere o relatório antes de exportar.');
                } else {
                  const updatedColumnWidths = columnWidths;
                  const combinedData = {
                    fullTableHTML: generateFullTableHTML(columns, tableData, null, updatedColumnWidths),
                    titlePDF: titlePdf,
                    imgPDF: base64Image,
                  };
                  setCombinedData(combinedData);
                  openModal('exportar');
                }
              }}
              className="flex flex-col justify-center items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" />
              </svg>
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionButtons;