import React, { useState, useRef, useEffect, useMemo } from "react";
import ModalSql from "./modais/ModalSql";
import ModalPdfView from "./modais/ModalPdfView";
import ModalExpo, { downloadCSV, downloadPDF } from "./modais/ModalExpo";
import ModalSalvos from "./modais/ModalSalvos";
import ModalFiltro from "./modais/ModalFiltro";
import ModalSalvarCon from "./modais/ModalSalvarCon";
import ModalAlert from "./modais/ModalAlert";
import ModalEditar from "./modais/ModalEditar";
import { getTotalizers } from "./CamposSelecionados";
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import ModalGerar from "./modais/ModalGerar";

// Hook personalizado para gerenciamento de modais
function useModal() {
    const [modals, setModals] = useState({
        salvos: false,
        gerar: false,
        sql: false,
        filtro: false,
        pdfView: false,
        expo: false,
        editar: false,
        salvarCon: false,
        alert: false,
    });

    const openModal = (modalName) => {
        setModals((prev) => ({ ...prev, [modalName]: true }));
    };

    const closeModal = (modalName) => {
        setModals((prev) => ({ ...prev, [modalName]: false }));
    };

    return { modals, openModal, closeModal };
}

function GenerateReport({ selectedColumns, selectTable, selectedRelatedTables, handleLoadFromLocalStorage }) {
    const { modals, openModal, closeModal } = useModal(); // Usando o hook personalizado para modais
    const [relationshipData, setRelationshipData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [conditionsString, setConditionsString] = useState('');
    const [sqlQuery, setSqlQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalizerResults, setTotalizerResults] = useState(null);
    const [columnWidths, setColumnWidths] = useState([]);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [combinedDataExpo, setCombinedDataExpo] = useState(null);
    const [combinedDataPreviewExpo, setCombinedDataPreviewExpo] = useState(null);
    const [sql2, setSql2] = useState('');
    const [titlePdf, setTitlePdf] = useState("");
    const [imgPdf, setImgPdf] = useState('');
    const [base64Image, setBase64Image] = useState('');
    const [fullTableHTML, setFullTableHTML] = useState('');
    const [fullTableHTMLPreview, setFullTableHTMLPreview] = useState('');
    const tableRef = useRef(null);
    const itemsPerPage = 15;
    const orderByString = localStorage.getItem('orderByString');
    const selectedColumnsValues = selectedColumns.map(column => column.value);

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
        const jsonRequest = {
            table: selectTable,
            columns: selectedColumnsValues,
            conditions: conditionsString,
            orderBy: orderByString,
            joins: [],
            totalizers: getTotalizers(),
        };

        if (selectedRelatedTables && relationshipData.length > 0) {
            selectedRelatedTables.forEach((tablePair) => {
                const relationship = relationshipData.find(rel => rel.tabelas === tablePair);
                if (relationship) {
                    jsonRequest.joins.push(relationship.join);
                }
            });
        }
        return jsonRequest;
    };

    useEffect(() => {
        const fetchRelationshipData = async () => {
            try {
                const response = await fetch('http://localhost:8080/find/relationship');
                const data = await response.json();
                setRelationshipData(data);
            } catch (error) {
                console.error('Erro ao buscar os relacionamentos:', error);
            }
        };
        fetchRelationshipData();
    }, []);

    const handleSaveConditions = (conditions) => {
        setConditionsString(conditions);
    };

    // Use useEffect para rolar para a parte inferior sempre que currentPage mudar
    useEffect(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }, [currentPage]);

    const fetchData = async (option) => {
        try {
            const jsonRequest = buildJsonRequest();

            const url = 'http://localhost:8080/find';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonRequest),
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
            }

            const responseData = await response.json();

            const [sql, sql2, updatedColumns, data, resultTotalizer] = responseData;

            setSql2(sql2);

            const sqlFinal = "Primeira Consulta: " + sql + " Consulta do totalizador: " + sql2;

            localStorage.setItem('SQLGeradoFinal', sqlFinal);

            setTotalizerResults(resultTotalizer);
            setSqlQuery(sql);
            setColumns(updatedColumns);

            const dataFormat = updatedColumns.map((column, index) => {
                return {
                    column,
                    values: data.map(row => row[index]),
                };
            });

            const fullTableHTML = generateFullTableHTML(updatedColumns, dataFormat, resultTotalizer);
            const fullTableHTMLPreview = generateFullTableHTML(updatedColumns, dataFormat, resultTotalizer, 15);
            setFullTableHTML(fullTableHTML);
            setFullTableHTMLPreview(fullTableHTMLPreview);

            const combinedData = {
                fullTableHTML: fullTableHTML,
                titlePDF: titlePdf,
                imgPDF: base64Image,
            };

            setCombinedDataExpo(combinedData);

            const columnsMap = updatedColumns.map((column) => ({
                value: column,
            }));

            if (option === 'CSV') {
                downloadCSV(columnsMap, dataFormat);
            }

            if (option === 'PDF') {
                downloadPDF(combinedData);
            }

            setTableData(dataFormat);
            setCurrentPage(1);

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            return [];
        }
    };

    const fetchLoadedQuery = async () => {
        try {
            const url = 'http://localhost:8080/find/loadedQuery';
            const loadedQuery = localStorage.getItem('loadedQuery');

            if (!loadedQuery) {
                throw new Error('No query found in localStorage');
            }

            const parsedLoadedQuery = JSON.parse(loadedQuery);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedLoadedQuery),
            });

            handleLoadFromLocalStorage();
            localStorage.removeItem('loadedQuery');

            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
            }

            const responseData = await response.json();

            const { columnsNickName, foundObjects, totalizersResults } = responseData;

            if (!Array.isArray(foundObjects) || !Array.isArray(columnsNickName)) {
                throw new Error('Estrutura de resposta inválida');
            }

            const transformedData = columnsNickName.map((column, index) => {
                return {
                    column,
                    values: foundObjects.map(row => row[index]),
                };
            });

            setColumns(columnsNickName);

            if (Array.isArray(totalizersResults) && totalizersResults.length > 0) {
                const resultTotalizer = {};

                totalizersResults.forEach((totalizer, index) => {
                    resultTotalizer[columnsNickName[index]] = totalizer;
                });

                setTotalizerResults(resultTotalizer);
                localStorage.setItem('totalizers', JSON.stringify(resultTotalizer));
            }
            setTableData(transformedData);
            setCurrentPage(1);

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            return [];
        }
    };

    const handleGenerateReport = async () => {
        try {
            if (localStorage.getItem('loadedQuery')) {
                await fetchLoadedQuery();
            } else {
                await fetchData();
            }
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
        }
    };

    const generateFullTableHTML = (columns, dataFormat, resultTotalizer, maxRows = null) => {
        if (!dataFormat || dataFormat.length === 0) return '<p>Nenhum dado encontrado.</p>';

        const tableHeaders = columns.map((column, index) =>
            `<th class="p-2 border-b text-center" style="width: ${columnWidths[index] || 'auto'}">${column}</th>`
        ).join('');

        const rowCount = maxRows ? Math.min(dataFormat[0].values.length, maxRows) : dataFormat[0].values.length;

        const tableRows = dataFormat[0].values.slice(0, rowCount).map((_, rowIndex) => {
            const rowHTML = columns.map((column, colIndex) =>
                `<td class="p-2 border-b text-center">${dataFormat[colIndex]?.values[rowIndex]}</td>`
            ).join('');
            const rowClass = rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white";
            return `<tr class="${rowClass}">${rowHTML}</tr>`;
        }).join('');

        const totalizerHTML = renderTotalizerHTML(columns, resultTotalizer);

        return `
      <table class="w-full text-sm">
        <thead class="bg-custom-azul-escuro text-black">
          <tr>${tableHeaders}</tr>
        </thead>
        <tbody>${tableRows}</tbody>
        ${totalizerHTML ? totalizerHTML : ''}
      </table>
    `;
    };

    useEffect(() => {
        const updateColumnWidths = () => {
            if (tableRef.current) {
                const thElements = tableRef.current.querySelectorAll('th');
                const newColumnWidths = Array.from(thElements).map(th => th.offsetWidth);
                setColumnWidths(newColumnWidths);
            }
        };

        window.addEventListener('resize', updateColumnWidths);

        updateColumnWidths();

        return () => {
            window.removeEventListener('resize', updateColumnWidths);
        };
    }, [columns]);

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
        }
    }, [imgPdf]);

    const sendAnalysisData = async () => {
        try {
            const jsonRequest = buildJsonRequest();

            const url = 'http://localhost:8080/find/analysis';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonRequest),
            });

            if (!response.ok) {
                throw new Error(`Erro ao enviar os dados: ${response.statusText}`);
            }

            const estimatedTimeBack = await response.json();

            setEstimatedTime(estimatedTimeBack);

            openModal('gerar');

        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
    };

    const handleModalGenerate = () => {
        if (selectedColumns.length === 0) {
            openModal('alert');
            return;
        }
        sendAnalysisData();
    };

    const renderTotalizerHTML = (columns, resultTotalizer) => {
        if (!totalizerResults || Object.keys(totalizerResults).length === 0) return null;

        const totalizerKeys = Object.keys(resultTotalizer);

        return `
            <tfoot class="border-t border-black">
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
            </tfoot>
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
        <div className="flex flex-col w-full">
            <div className="w-full flex flex-row justify-between mt-4">
                <div className="flex flex-col justify-start items-start ml-36">
                    <h1 className="font-bold text-3xl">Ações</h1>
                    <div className="flex mt-3">
                        <button
                            className="p-2 px-5 border-2 text-white bg-custom-azul hover:bg-custom-azul-escuro active:bg-custom-azul rounded-sm mr-2"
                            onClick={handleModalGenerate}
                        >
                            Gerar Relatório
                        </button>
                        <button
                            className="p-2 px-5 border-2 text-white bg-custom-azul hover:bg-custom-azul-escuro active:bg-custom-azul rounded-sm mr-2"
                            onClick={() => openModal('salvarCon')}
                        >
                            Salvar Consulta
                        </button>
                    </div>
                </div>
                <div className="flex mr-36 justify-center items-center">
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={() => openModal('salvos')} className="flex flex-col justify-center items-center">
				{/* Ícone e label */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                                </svg>
                                <label htmlFor="mais">Salvos</label>
                            </button>
                        </div>
                    </div>
                    {/* Outros botões de modais */}
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={() => openModal('sql')} className="flex flex-col justify-center items-center">
                                {/* Ícone e label */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                </svg>
                                <label htmlFor="mais">SQL</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={() => openModal('filtro')} className="relative flex flex-col justify-center items-center">
                                {conditionsString && (
                                    <span className="absolute -top-2 -right-1 bg-custom-vermelho text-white rounded-full text-xs w-4 h-4 flex justify-center items-center">
                                        {conditionsString.split('AND').length}
                                    </span>
                                )}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10" >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" name="mais" />
                                </svg>
                                <label htmlFor="mais">Filtros</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={() => openModal('editar')} className="flex flex-col justify-center items-center">
                                {/* Ícone e label */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                <label htmlFor="mais">Editar</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={() => {
                                if (tableData.length > 0) {
                                    const combinedData = {
                                        fullTableHTML: fullTableHTMLPreview,
                                        titlePDF: titlePdf,
                                        imgPDF: base64Image,
                                    };
                                    setCombinedDataPreviewExpo(combinedData);
                                    openModal('pdfView');
                                } else {
                                    openModal('alert');
                                }
                            }} className="flex flex-col justify-center items-center">
                                {/* Ícone e label */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                                <label htmlFor="mais">Prévia</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={() => openModal('expo')} className="flex flex-col justify-center items-center">
                                {/* Ícone e label */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" />
                                </svg>
                                <label htmlFor="mais">Exportar</label>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full text-center">
                <div className="border-2 border-neutral-600 my-3 w-10/12 mx-auto overflow-auto">
                    <table ref={tableRef} className="w-full text-sm">
                        {hasData && (
                            <thead className="bg-custom-azul-escuro text-white">
                                <tr>
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            className="p-2 border-b text-center"
                                            style={{
                                                resize: index === columns.length - 1 ? 'none' : 'horizontal',
                                                overflow: 'auto',
                                                width: columnWidths[index] || 'auto'
                                            }}
                                        >
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {hasData ? (
                                tableData[0].values.slice(startIndex, endIndex).map((_, rowIndex) => (
                                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                        {columns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="p-2 border-b text-center"
                                            >
                                                {tableData[colIndex]?.values[startIndex + rowIndex]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="p-2 text-center">Nenhum dado encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                        {renderTotalizer()}
                    </table>
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
            <ModalFiltro isOpen={modals.filtro} onClose={() => closeModal('filtro')} columns={selectedColumns} onSave={handleSaveConditions} />
            <ModalSql isOpen={modals.sql} onClose={() => closeModal('sql')} />
            <ModalEditar isOpen={modals.editar} onClose={() => closeModal('editar')} handleTitlePdf={handleTitlePdf} handleImgPdf={handleImgPdf} />
            <ModalPdfView isOpen={modals.pdfView} onClose={() => closeModal('pdfView')} combinedData={combinedDataPreviewExpo} />
            <ModalExpo isOpen={modals.expo} onClose={() => closeModal('expo')} table={tableData} selectedColumns={selectedColumns} combinedData={combinedDataExpo} />
            <ModalSalvos isOpen={modals.salvos} onClose={() => closeModal('salvos')} generateReport={handleGenerateReport} />
            <ModalGerar isOpen={modals.gerar} onClose={() => closeModal('gerar')} tempoEstimado={estimatedTime} onFetchData={fetchData} />
            <ModalSalvarCon isOpen={modals.salvarCon} onClose={() => closeModal('salvarCon')} sqlQuery={sqlQuery} sql2={sql2} img={imgPdf} titlePdf={titlePdf} />
            <ModalAlert isOpen={modals.alert} onClose={() => closeModal('alert')} message="Nenhuma tabela foi selecionada para Gerar o Relatório" modalType="ALERTA" confirmText="Fechar" />
        </div>
    );
}

export default GenerateReport;