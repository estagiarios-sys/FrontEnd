import React, { useState, useRef, useEffect, useMemo } from "react";
import ModalSql from "./modais/ModalSql";
import ModalPrevia from "./modais/ModalPrevia";
import ModalExportar, { downloadCSV, downloadPDF } from "./modais/ModalExportar";
//import ModalSalvos from "./modais/ModalSalvos";
import ModalFiltro from "./modais/ModalFiltro";
import ModalSalvarCon from "./modais/ModalSalvarCon";
import ModalAlert from "./modais/ModalAlert";
import ModalEditar from "./modais/ModalEditar";
import { getTotalizers } from "./CamposSelecionados";
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa';
import ModalConsultar from "./modais/ModalConsultar";
import Loading from "./genericos/Loading";
import Pagination from "./PaginationComponents";
import ActionButtons from "./ActionButtons";
import DataTable from "./DataTable";

const url2 = window.location.hostname;
const completeUrl = process.env.REACT_APP_API_COMPLETE_URL;

console.log(completeUrl);


function generateFullTableHTML(columns, dataFormat, resultTotalizer, columnWidths, maxRows = null) {
    if (!dataFormat || dataFormat.length === 0) return '<p>Nenhum dado encontrado.</p>';

    let size = 0;
    const filteredColumns = [];
    const filteredWidths = [];

    if (!columnWidths || columnWidths.length === 0) {
        columnWidths = Array(columns.length).fill(1000 / columns.length);
    }

    columnWidths.forEach((width, index) => {
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
}

function renderTotalizerHTML(columns, resultTotalizer) {
    if (!resultTotalizer || Object.keys(resultTotalizer).length === 0) return null;

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
}

function GenerateReport({ selectedColumns, selectTable, selectedRelatedTables, handleLoadFromLocalStorage, setPdfOK, setMainRequestLoaded }) {
    const [modals, setModals] = useState({
        consultar: false,
        filtro: false,
        sql: false,
        editar: false,
        pdfView: false,
        exportar: false,
        salvos: false,
        gerar: false,
        salvarCon: false,
        alert: { isOpen: false, modalType: 'ALERTA', message: '' },
    });

    const openModal = (modalName, modalType = 'ALERTA', message = '') => {
        if (modalName === 'alert') {
            setModals(prev => ({
                ...prev,
                alert: { isOpen: true, modalType, message },
            }));
        } else {
            setModals(prev => ({ ...prev, [modalName]: true }));
        }
    };

    const closeModal = (modalName) => {
        if (modalName === 'alert') {
            setModals(prev => ({
                ...prev,
                alert: { isOpen: false, modalType: 'ALERTA', message: '' },
            }));
        } else {
            setModals(prev => ({ ...prev, [modalName]: false }));
        }
    };

    const [relationshipData, setRelationshipData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [conditionsString, setConditionsString] = useState('');
    const [sqlQuery, setSqlQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalizerResults, setTotalizerResults] = useState(null);
    const [columnWidths, setColumnWidths] = useState([]);
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [combinedData, setCombinedData] = useState(null);
    const [titlePdf, setTitlePdf] = useState('');
    const [imgPdf, setImgPdf] = useState('');
    const [base64Image, setBase64Image] = useState('');
    const [loading, setLoading] = useState(false);
    const tableRef = useRef(null);
    const itemsPerPage = 14;
    const orderByString = localStorage.getItem('orderByString');
    const selectedColumnsValues = selectedColumns.map(column => column.value);
    const [requestLoaded, setRequestLoaded] = useState(false);

    const handleModalAviso = (message) => {
        openModal('alert', 'ALERTA', message);
    };

    const confirmModalAlert = () => {
        closeModal('alert');
    };

    const hasData = useMemo(() => tableData.length > 0 && tableData[0].values, [tableData]);
    const totalPages = useMemo(() => hasData ? Math.ceil(tableData[0].values.length / itemsPerPage) : 0, [hasData, tableData, itemsPerPage]);
    const startIndex = useMemo(() => (currentPage - 1) * itemsPerPage, [currentPage, itemsPerPage]);
    const endIndex = useMemo(() => startIndex + itemsPerPage, [startIndex, itemsPerPage]);
    const shouldShowPagination = useMemo(() => hasData && tableData[0].values.length > itemsPerPage, [hasData, tableData]);


    const sendAnalysisData = async () => {
        try {
            setLoading(true);
            const jsonRequest = buildJsonRequest();

            const url = 'http://localhost:8082/back_reports/find/analysis';

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

            const estimatedTimeResponse = await response.json();
            console.log('Resposta do backend:', estimatedTimeResponse);

            let estimatedTimeBack;

            if (typeof estimatedTimeResponse === 'number') {
                estimatedTimeBack = estimatedTimeResponse;
            } else if (typeof estimatedTimeResponse === 'object' && 'estimatedTime' in estimatedTimeResponse) {
                estimatedTimeBack = estimatedTimeResponse.estimatedTime;
            } else {
                throw new Error('Resposta inesperada do backend.');
            }

            console.log('Tempo estimado recebido:', estimatedTimeBack);

            if (typeof estimatedTimeBack !== 'number' || isNaN(estimatedTimeBack)) {
                throw new Error('Tempo estimado inválido.');
            }

            setEstimatedTime(estimatedTimeBack);
            console.log('Tempo estimado definido no estado:', estimatedTimeBack);

            setLoading(false);

            openModal('consultar');

        } catch (error) {
            setLoading(false);
            openModal('alert', 'ALERTA', 'Erro ao enviar os dados. Por favor, tente novamente.');
            console.error('Erro ao enviar os dados:', error);
        }
    };




    const handleModalGenerate = () => {
        if (selectedColumns.length === 0) {
            openModal('alert', 'ALERTA', 'Por favor, Selecione pelo menos uma coluna!');
            return;
        }
        sendAnalysisData();
    }

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
        if (requestLoaded) {
            setBase64Image(requestLoaded.pdfImage);
            setTitlePdf(requestLoaded.pdfTitle);

            const mainRequestLoaded = {
                mainTable: requestLoaded.mainTable,
                conditions: requestLoaded.conditions,
                columns: requestLoaded.columns,
                orderBy: requestLoaded.orderBy,
                totalizers: requestLoaded.totalizers,
                
            };

            setMainRequestLoaded(mainRequestLoaded);
            setRequestLoaded(false);
        }
    }, [requestLoaded]);

    useEffect(() => {
        const fetchRelationshipData = async () => {
            try {
                const response = await fetch('http://localhost:8082/back_reports/find/relationship');
                if (!response.ok) {
                    throw new Error('Erro ao buscar os relacionamentos');
                }
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

    useEffect(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }, [currentPage]);

    const createEmpty = async () => {
        try {
            const response = await fetch('http://localhost:8082/back_reports/pdf/create-empty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: titlePdf,
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar ID da notificação: ${response.statusText}`);
            }

            const idNotificacao = await response.json();
            return idNotificacao;
        } catch (error) {
            console.error('Erro ao criar a notificação:', error);
            throw error;
        }
    };

    const fetchData = async (option) => {
        try {
            let idNotificacao = null;
            if (option === 'PDF') {
                idNotificacao = await createEmpty();
            }

            const jsonRequest = buildJsonRequest();
            const url = 'http://localhost:8082/back_reports/find';

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

            const dataFormat = updatedColumns.map((column, index) => ({
                column,
                values: data.map(row => row[index]),
            }));

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

            let sqlFinal = "Primeira Consulta: " + sql;

            if (sql2) {
                sqlFinal += " Consulta do totalizador: " + sql2;
            }

            localStorage.setItem('SQLGeradoFinal', sqlFinal);

            setTotalizerResults(resultTotalizer);
            setSqlQuery(sql);
            setColumns(updatedColumns);
            setTableData(dataFormat);
            setCurrentPage(1);

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            openModal('alert', 'ALERTA', 'Erro ao buscar os dados. Por favor, tente novamente.');
        }
    };


    return (
        <div className="flex flex-col w-full justify-center items-center">
            {loading && <Loading />}
            <ActionButtons
                handleModalGenerate={() => fetchData()}
                handleModalAlert={handleModalAviso}
                modals={modals}
                openModal={openModal}
                closeModal={closeModal}
                selectedColumns={selectedColumns}
                setCombinedData={setCombinedData}
                generateFullTableHTML={generateFullTableHTML}
                columns={columns}
                tableData={tableData}
                columnWidths={columnWidths}
                titlePdf={titlePdf}
                base64Image={base64Image}
            />
            <DataTable
                hasData={hasData}
                columns={columns}
                tableData={tableData}
                startIndex={startIndex}
                endIndex={endIndex}
                columnWidths={columnWidths}
                tableRef={tableRef}
                totalizerResults={totalizerResults}
            />
            {shouldShowPagination && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    changePage={changePage}
                />
            )}
            <ModalFiltro isOpen={modals.filtro} onClose={() => closeModal('filtro')} columns={selectedColumns} onSave={handleSaveConditions} />
            <ModalSql isOpen={modals.sql} onClose={() => closeModal('sql')} />
            <ModalEditar isOpen={modals.editar} onClose={() => closeModal('editar')} handleTitlePdf={setTitlePdf} handleImgPdf={setImgPdf} />
            <ModalPrevia isOpen={modals.previa} onClose={() => closeModal('previa')} combinedData={combinedData} />
            <ModalExportar isOpen={modals.exportar} onClose={() => closeModal('exportar')} table={tableData} selectedColumns={selectedColumns} combinedData={combinedData} setPdfOK={setPdfOK} createEmpty={createEmpty} />
            {/* <ModalSalvos isOpen={modals.salvos} onClose={() => closeModal('salvos')} setRequestLoaded={setRequestLoaded} /> */}
            <ModalConsultar isOpen={modals.consultar} onClose={() => closeModal('consultar')} tempoEstimado={estimatedTime} onFetchData={fetchData} />
            <ModalSalvarCon isOpen={modals.salvarCon} onClose={() => closeModal('salvarCon')} sqlQuery={sqlQuery} img={imgPdf} titlePdf={titlePdf} />
            <ModalAlert isOpen={modals.alert.isOpen} onClose={() => closeModal('alert')} onConfirm={confirmModalAlert} message={modals.alert.message} modalType={modals.alert.modalType} confirmText="Fechar" />
        </div>
    );
}

export default GenerateReport;