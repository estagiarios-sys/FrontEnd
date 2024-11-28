import React, { useState, useRef, useEffect, useMemo } from "react";
import ModalSql from "./modais/ModalSql.jsx";
import ModalPrevia from "./modais/ModalPrevia.jsx";
import ModalExportar, { downloadCSV, downloadPDF } from "./modais/ModalExportar.jsx";
import ModalSalvos from "./modais/ModalSalvos.jsx";
import ModalFiltro from "./modais/ModalFiltro.jsx";
import ModalSalvarCon from "./modais/ModalSalvarCon.jsx";
import ModalAlert from "./modais/ModalAlert.jsx";
import ModalEditar from "./modais/ModalEditar.jsx";
import { getTotalizers } from "./CamposSelecionados.jsx";
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import ModalConsultar from "./modais/ModalConsultar.jsx";
import Loading from "./genericos/Loading.jsx";
import { linkFinal } from '../config.js';
import Button from "./Campos/Button.jsx";
import IconsTemplate from "./Campos/IconsTemplate.jsx";
import Tabela from "./Campos/Tabela.jsx";
import Cookies from 'js-cookie';

function useModal() {
    const [modals, setModals] = useState({
        salvos: false,
        consultar: false,
        sql: false,
        filtro: false,
        previa: false,
        exportar: false,
        editar: false,
        salvarCon: false,
        alert: { isOpen: false, modalType: 'ALERTA', message: '' }, // Estado do modal alert com tipo e mensagem
    });

    const openModal = (modalName, modalType = 'ALERTA', message = '') => {
        if (modalName === 'alert') {
            setModals((prev) => ({
                ...prev,
                alert: { isOpen: true, modalType, message },
            }));
        } else {
            setModals((prev) => ({ ...prev, [modalName]: true }));
        }
    };

    const closeModal = (modalName) => {
        if (modalName === 'alert') {
            setModals((prev) => ({
                ...prev,
                alert: { isOpen: false, modalType: 'ALERTA', message: '' },
            }));
        } else {
            setModals((prev) => ({ ...prev, [modalName]: false }));
        }
    };

    return { modals, openModal, closeModal };
}

function GenerateReport({ selectedColumns, selectTable, selectedRelatedTables, setPdfOK, setMainRequestLoaded }) {
    const { modals, openModal, closeModal } = useModal(); // Usando o hook personalizado para modais
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [conditionsArray, setConditionsArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalizerResults, setTotalizerResults] = useState(null);
    const [columnWidths, setColumnWidths] = useState([]);
    const [combinedData, setCombinedData] = useState(null);
    const [titlePdf, setTitlePdf] = useState('');
    const [imgPdf, setImgPdf] = useState('');
    const [base64Image, setBase64Image] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestLoaded, setRequestLoaded] = useState(null);
    const [shouldResetRequestLoaded, setShouldResetRequestLoaded] = useState(false);
    const [selectedTabela, setSelectedTabela] = useState(null);
    const [sqlGeral, setSqlGeral] = useState('');
    const [sqlTotalizers, setSqlTotalizers] = useState('');
    const [jsonRequest, setJsonRequest] = useState({});
    const [editarRequestLoad, setEditarRequestLoad] = useState(false);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const tableRef = useRef(null);
    const itemsPerPage = 14;
    let orderByString = sessionStorage.getItem('orderByString');
    let idNotificacao = null;


    const handleModalAviso = (message) => {
        openModal('alert', 'ALERTA', message);
    };

    const confirmModalAlert = () => {
        closeModal('alert');
    };

    // Utilizando useMemo para otimizar cálculos
    const hasData = useMemo(() => tableData.length > 0 && tableData[0].values, [tableData]);
    const totalPages = useMemo(() => hasData ? Math.ceil(tableData[0].values.length / itemsPerPage) : 0, [hasData, tableData, itemsPerPage]);
    const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
    const endIndex = useMemo(() => startIndex + itemsPerPage, [startIndex, itemsPerPage]);
    const shouldShowPagination = useMemo(() => hasData && tableData[0].values.length > itemsPerPage, [hasData, tableData]);

    const changePage = (direction) => {
        switch (direction) {
            case 'first':
                setCurrentPage(1);
                break;
            case 'prev':
                setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
                break;
            case 'next':
                setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
                break;
            case 'last':
                setCurrentPage(totalPages);
                break;
            default:
                break;
        }
    };

    // Função para construir o JSON Request
    const buildJsonRequest = () => {
        const modifiedColumns = selectedColumns.map(column => ({
            name: column.value,
            type: column.type,
            nickName: column.apelido
        }));


        if (orderByString == null) {
            orderByString = '';
        }

        const jsonRequest = {
            table: selectTable,
            columns: modifiedColumns,
            conditions: conditionsArray,
            orderBy: orderByString,
            tablesPairs: selectedRelatedTables,
            totalizers: getTotalizers(),
        };

        setJsonRequest(jsonRequest);
        return jsonRequest;
    };

    useEffect(() => {
        if (requestLoaded && requestLoaded.fromSavedQuery) {
            setBase64Image(requestLoaded.pdfImage);
            setTitlePdf(requestLoaded.pdfTitle);

            const editarRequestLoad = {
                pdfImage: requestLoaded.pdfImage,
                pdfTitle: requestLoaded.pdfTitle,
            };

            const mainRequestLoaded = {
                table: requestLoaded.table,
                conditions: requestLoaded.conditions,
                columns: requestLoaded.columns,
                orderBy: requestLoaded.orderBy,
                totalizers: requestLoaded.totalizers,
                tablesPairs: requestLoaded.tablesPairs,
            };

            setSelectedTabela(requestLoaded.table);      

            setMainRequestLoaded(mainRequestLoaded);
            setEditarRequestLoad(editarRequestLoad);
            
            setShouldResetRequestLoaded(true);
        }
    }, [requestLoaded]);


    useEffect(() => {
        setSelectedTabela(selectTable);
    }, [selectTable]);

    useEffect(() => {
        if (shouldResetRequestLoaded) {
            setRequestLoaded(null);
            setShouldResetRequestLoaded(false);
        }
    }, [shouldResetRequestLoaded]);

    const handleSaveConditions = (conditions) => {
        setConditionsArray(conditions);
    };

    // Use useEffect para rolar para a parte inferior sempre que currentPage mudar
    useEffect(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }, [currentPage]);

    const createEmpty = async () => {
        try {
            // Faz a requisição para criar um ID da notificação
            const response = await fetch(`${linkFinal}/pdf/create-empty`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('token'),
                },
                body: titlePdf, // Serializa o título como JSON
            });

            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro ao criar ID da notificação: ${response.statusText}`);
            }

            // Pega o ID retornado
            idNotificacao = await response.json();
            return idNotificacao;
        } catch (error) {
            console.error('Erro ao criar a notificação:', error);
            throw error; // Propaga o erro para ser tratado em outro local se necessário
        }
    };

    const fetchData = async (option) => {
        try {

            if (option === 'PDF') {
                createEmpty();
            }

            const jsonRequest = buildJsonRequest();

            const url = `${linkFinal}/report-data`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Cookies.get('token'),
                },
                body: JSON.stringify(jsonRequest),
            });

        

            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
            }

            const responseData = await response.json();

            // console.log("Dados Recebidos: " + JSON.stringify(responseData));

            const [sql, sql2, updatedColumns, data, resultTotalizer] = responseData;

            const dataFormat = updatedColumns.map((column, index) => {
                return {
                    column,
                    values: data.map(row => row[index]),
                };
            });

            
            const columnsMap = updatedColumns.map((column) => ({
                value: column,
            }));

            
            
            if (option === 'CSV') {
                downloadCSV(columnsMap, dataFormat, handleModalAviso);
                setPdfOK(true);
                return;
            }

            if (option === 'PDF') {
                const combinedData = {
                    pdfId: idNotificacao,
                    fullTableHTML: generateFullTableHTML(updatedColumns, dataFormat, resultTotalizer, columnWidths),
                    titlePDF: titlePdf,
                    imgPDF: base64Image,
                };
                await downloadPDF(combinedData, handleModalAviso, setPdfOK);
                return;
            }
            setSqlGeral(sql);
            setSqlTotalizers(sql2);
            setTotalizerResults(resultTotalizer);
            setColumns(updatedColumns);
            setTableData(dataFormat);
            setCurrentPage(1);

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            throw error;
        }
    };

    const generateFullTableHTML = (columns, dataFormat, resultTotalizer, updatedColumnWidths, maxRows = null) => {
        if (!dataFormat || dataFormat.length === 0) return '<p>Nenhum dado encontrado.</p>';

        let size = 0;
        const filteredColumns = [];
        const filteredWidths = [];

        if (!updatedColumnWidths || updatedColumnWidths.length === 0) {
            updatedColumnWidths = Array(columns.length).fill(1000 / columns.length);
        }

        updatedColumnWidths.forEach((width, index) => {
            if (size + width <= 1000) {
                size += width;
                filteredColumns.push(columns[index]);
                filteredWidths.push(width);
            }
        });

        const tableHeaders = filteredColumns.map((column, index) =>
            `<th class="p-2 border-b text-center" style="width: ${filteredWidths[index] || 'auto'}">${column}</th>`
        ).join('');

        const rowCount = maxRows ? Math.min(dataFormat[0].values.length, maxRows) : dataFormat[0].values.length;

        const tableRows = dataFormat[0].values.slice(0, rowCount).map((_, rowIndex) => {
            const rowHTML = filteredColumns.map((_, colIndex) =>
                `<td class="p-2 border-b text-center">${dataFormat[colIndex]?.values[rowIndex]}</td>`
            ).join('');
            const rowClass = rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white";
            return `<tr class="${rowClass}">${rowHTML}</tr>`;
        }).join('');

        const totalizerHTML = renderTotalizerHTML(filteredColumns, resultTotalizer);

        return `
        <table>
            <thead class="text-black">
                <tr>${tableHeaders}</tr>
            </thead>
            <tbody>${tableRows}</tbody>
            ${totalizerHTML ? totalizerHTML : ''}
        </table>
        `;
    };


    const sendAnalysisData = async () => {
        try {
            setLoading(true);
            const jsonRequest = buildJsonRequest();
            const url = `${linkFinal}/report-data/analyze`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),

                },
                body: JSON.stringify(jsonRequest),
            });
            if (!response.ok) {
                throw new Error(`Erro ao enviar os dados: ${response.statusText}`);
            }
            const estimatedTimeBack = await response.json();
            setEstimatedTime(estimatedTimeBack);
            setLoading(false);
            openModal('consultar');
        } catch (error) {
            setLoading(false);
            openModal('alert', 'ALERTA', 'Erro ao enviar os dados. Por favor, tente novamente.');
            console.error('Erro ao enviar os dados:', error);
        }
    };


    const updateColumnWidths = () => {
        if (tableRef.current) {
            const thElements = tableRef.current.querySelectorAll('th');
            const newColumnWidths = Array.from(thElements).map(th => th.offsetWidth);
            setColumnWidths(newColumnWidths);
            return newColumnWidths;
        }
    };

    const handleTitlePdf = (title) => {
        setTitlePdf(title);
    };

    const handleImgPdf = (img) => {
        setImgPdf(img);
    };

    useEffect(() => {
        const convertToBase64 = (imgPdf) => {
            const reader = new FileReader();
            reader.readAsDataURL(imgPdf);
            reader.onloadend = () => {
                setBase64Image(reader.result);
            };
        };

        if (imgPdf) {
            convertToBase64(imgPdf);
        } else {
            setBase64Image('');
        }
    }, [imgPdf]);


    const handleModalGenerate = () => {
        if (selectedColumns.length === 0) {
            openModal('alert', 'ALERTA', 'Por favor, selecione pelo menos uma coluna.');
            return;
        }
        sendAnalysisData();
        openModal('consultar');
    };

    const renderTotalizerHTML = (columns, resultTotalizer) => {
        if (!totalizerResults || Object.keys(totalizerResults).length === 0) return null;

        const totalizerKeys = Object.keys(resultTotalizer);

        return `
            <ftotalizer class="border-t border-black">
                <tr class="bg-custom-azul-claro text-center">
                    <td class="p-2 border-t-2 border-black" colspan="${columns.length}">
                        <table class="w-full">
                            <tbody>
                                <tr>
                                    <td class="text-left font-semibold text-custom-azul-escuro">
                                        TOTALIZADORES:
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr class="bg-custom-azul-claro text-center">
                    ${columns.map((col, index) => {
            const totalizerKey = totalizerKeys.find(key => key.includes(col));
            return `
                            <td class="font-regular text-black pb-3">
                                ${totalizerKey ? resultTotalizer[totalizerKey] : ""}
                            </td>
                        `;
        }).join('')}
                </tr>
            </ftotalizer>
        `;
    };

    const renderTotalizer = () => {
        if (!totalizerResults || Object.keys(totalizerResults).length === 0) return null;

        return (
            <tfoot className="border-t border-black">
                <tr className="bg-custom-azul-claro text-center">
                    <td className="p-2 border-t-2 border-black" colSpan={columns.length}>
                        <table className="w-full ">
                            <tbody>
                                <tr>
                                    <td className="text-left font-semibold text-custom-azul-escuro ">TOTALIZADORES:</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr className="bg-custom-azul-claro text-center">
                    {columns.map((column, index) => {
                        const totalizerKey = Object.keys(totalizerResults).find(key => key.includes(column));
                        return (
                            <td
                                className="font-regular text-black pb-3"
                                key={index}>
                                {totalizerKey ? totalizerResults[totalizerKey] : ""}
                            </td>
                        );
                    })}
                </tr>
            </tfoot>
        );
    };

    return (
        <div className="flex flex-col w-full justify-center items-center">
            {loading && <Loading />}
            <div className="w-full flex flex-row justify-between mt-4">
                <div className="flex flex-col justify-start items-start ml-36">
                    <h1 className="font-bold text-3xl">Ações</h1>
                    <div className="flex mt-3">
                        <Button
                            text={"consultar"}
                            function={handleModalGenerate}
                        />
                        <Button
                            text={"Salvar Consulta"}
                            function={() => {
                                if (selectedColumns.length === 0) {
                                    openModal('alert', 'ALERTA', 'Por favor, monte uma consulta antes de salvar.');
                                } else {
                                    openModal('salvarCon');
                                }
                            }
                            }
                        />
                    </div>
                </div>
                <div className="flex mr-36 justify-center items-center">
                    <IconsTemplate
                        funcao={() => openModal('salvos')}
                        nome={"Salvos"}
                        icon={"M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"}
                    />
                    {/* Outros botões de modais */}
                    <IconsTemplate
                        funcao={() => openModal('sql')}
                        nome={"SQL"}
                        icon={"M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"}
                    />
                    <IconsTemplate
                        funcao={() => {
                            if (selectedColumns.length === 0) {
                                openModal('alert', 'ALERTA', 'Por favor, selecione pelo menos uma coluna.');
                            } else {
                                openModal('filtro');
                            }
                        }}
                        nome={"Filtros"}
                        icon={"M12 4.5v15m7.5-7.5h-15"}
                    >
                        {/* Ícone de notificações (se houver condições) */}
                        {conditionsArray.length > 0 && (
                            <span className="absolute -top-2 -right-1 bg-custom-vermelho text-white rounded-full text-xs w-4 h-4 flex justify-center items-center">
                                {conditionsArray.length}
                            </span>
                        )}
                    </IconsTemplate>
                    <IconsTemplate
                        funcao={() => openModal('editar')}
                        nome={"Editar"}
                        icon={"m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"}
                    />
                    <IconsTemplate
                        funcao={() => {
                            if (tableData.length === 0) {
                                openModal('alert', 'ALERTA', 'Gere o relatório para visualizar a prévia.');
                            } else {
                                const updatedColumnWidths = updateColumnWidths();
                                const combinedData = {
                                    fullTableHTML: generateFullTableHTML(columns, tableData, totalizerResults, updatedColumnWidths, 15),
                                    titlePDF: titlePdf,
                                    imgPDF: base64Image,
                                };
                                setCombinedData(combinedData);
                                openModal('previa');
                            }
                        }}
                        nome={"Prévia"}
                        icon={"M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"}
                    />
                    <IconsTemplate
                        funcao={async () => {
                            if (tableData.length === 0) {
                                openModal('alert', 'ALERTA', 'Gere o relatório antes de exportar.');
                            } else {
                                const updatedColumnWidths = updateColumnWidths();
                                const combinedData = {
                                    fullTableHTML: generateFullTableHTML(columns, tableData, totalizerResults, updatedColumnWidths),
                                    titlePDF: titlePdf,
                                    imgPDF: base64Image,
                                };
                                setCombinedData(combinedData);
                                openModal('exportar');
                            }
                        }}
                        nome={"Exportar"}
                        icon={"M3 16.5v2.25a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5"}
                    />
                </div>
            </div>
            <div className="text-center w-[1200px]">
                <div className="border-2 border-neutral-600 my-3 w-10/12 mx-auto overflow-auto">
                    <Tabela
                        tableData={tableData}
                        renderTotalizer={renderTotalizer}
                        tableRef={tableRef}
                        columns={columns}
                        hasData={hasData}
                        columnWidths={columnWidths}
                        startIndex={startIndex}
                        endIndex={endIndex}
                    />
                </div>
                {shouldShowPagination && (
                    <div className="flex justify-center mt-4 mb-4 items-center">
                        <button
                            onClick={() => changePage('first')}
                            disabled={currentPage === 1}
                            className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
                            title="Ir para a primeira página"
                        >
                            <FaAngleDoubleLeft />
                        </button>
                        <button
                            onClick={() => changePage('prev')}
                            disabled={currentPage === 1}
                            className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
                            title="Ir para a página anterior"
                        >
                            <FaAngleLeft />
                        </button>
                        <span className="flex items-center mx-2">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => changePage('next')}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
                            title="Ir para a página seguinte"
                        >
                            <FaAngleRight />
                        </button>
                        <button
                            onClick={() => changePage('last')}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
                            title="Ir para a última página"
                        >
                            <FaAngleDoubleRight />
                        </button>
                    </div>
                )}
            </div>
            {/* Modais */}
            <ModalFiltro isOpen={modals.filtro} onClose={() => closeModal('filtro')} columns={selectedColumns} onSave={handleSaveConditions} loadedConditions={requestLoaded?.conditions} loadedColumns={requestLoaded?.columns} selectedTabela={selectedTabela} requestLoaded={requestLoaded}/>
            <ModalSql isOpen={modals.sql} onClose={() => closeModal('sql')} sqlGeral={sqlGeral} sqlTotalizers={sqlTotalizers} />
            <ModalEditar isOpen={modals.editar} onClose={() => closeModal('editar')} handleTitlePdf={handleTitlePdf} handleImgPdf={handleImgPdf} editarRequestLoad={editarRequestLoad} />
            <ModalPrevia isOpen={modals.previa} onClose={() => closeModal('previa')} combinedData={combinedData} />
            <ModalExportar isOpen={modals.exportar} onClose={() => closeModal('exportar')} table={tableData} selectedColumns={selectedColumns} combinedData={combinedData} setPdfOK={setPdfOK} createEmpty={createEmpty} />
            <ModalSalvos isOpen={modals.salvos} onClose={() => closeModal('salvos')} setRequestLoaded={setRequestLoaded} />
            <ModalConsultar isOpen={modals.consultar} onClose={() => closeModal('consultar')} tempoEstimato={estimatedTime} onFetchData={fetchData} />
            <ModalSalvarCon isOpen={modals.salvarCon} onClose={() => closeModal('salvarCon')} imgPDF={imgPdf} titlePdf={titlePdf} jsonRequest={jsonRequest} />
            <ModalAlert isOpen={modals.alert.isOpen} onClose={() => closeModal('alert')} onConfirm={confirmModalAlert} message={modals.alert.message} modalType={modals.alert.modalType} confirmText="Fechar" />
        </div>
    );
}

export default GenerateReport;