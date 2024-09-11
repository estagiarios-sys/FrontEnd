import React, { useState, useRef, useEffect } from "react";
import ModalSql from "./modais/ModalSql";
import ModalPdfView from "./modais/ModalPdfView";
import ModalExpo from "./modais/ModalExpo";
import ModalSalvos from "./modais/ModalSalvos";
import ModalFiltro from "./modais/ModalFiltro";
import { useNavigate } from 'react-router-dom';
import ModalModelo from "./modais/ModalModelo";
import ModalSalvarCon from "./modais/ModalSalvarCon";
import ModalModal from "./modais/ModalModal";
import { getTotalizers } from "./CamposSelecionados";

function GerarRelatorio({ selectedColumns, selectTable, selectedRelacionada, handleLoadFromLocalStorage }) {

    const [isModalOpenSalvos, setIsModalOpenSalvos] = useState(false); // Modal para exibir as views salvas
    const [isModalOpenSQl, setIsModalOpenSQL] = useState(false); // Modal para exibir o SQL
    const [isModalOpenFiltro, setIsModalOpenFiltro] = useState(false); // Modal para exibir o filtros de selects
    const [isModalPdfOpenView, setIsModalPdfOpenView] = useState(false); // Modal para exibir o PDF_View
    const [isModalExpoOpen, setIsModalExpoOpen] = useState(false); // Modal para exibir o Exportar e suas opções
    const [relationshipData, setRelationshipData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [condicoesString, setCondicoesString] = useState('');
    const [isView, setIsView] = useState(false);
    const [isModalModeloOpen, setIsModalModeloOpen] = useState(false); // Modal para exibir os modelos de pdf
    const [selectedTemplateKey, setSelectedTemplateKey] = useState(null);
    const [isModalSalvarConOpen, setIsModalSalvarCon] = useState(false);
    const [sqlQuery, setSqlQuery] = useState('');
    const [isModalModalAvisoOpen, setIsModalModalAvisoOpen] = useState(false); // ModalModal para exibir avisos
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [renderTotalizerResult, setRenderTotalizerResult] = useState(null); // Usar useState para o totalizador


    const handleSelectTemplate = (key) => {
        setSelectedTemplateKey(key);
        setIsModalModeloOpen(false);
    };

    const handleModalFiltro = () => {
        setIsModalOpenFiltro(true);
    };

    const handleModalSalvos = () => {
        setIsModalOpenSalvos(true);
    };

    const handleModalExpo = () => {
        setIsModalExpoOpen(true);
    };

    const handleModalSql = () => {
        setIsModalOpenSQL(true);
    };


    const handleModalPdfView = () => {
        if (isView) {
            setIsModalPdfOpenView(true);
        } else {
            setIsModalPdfOpenView(false);
            setIsModalModalAvisoOpen(true);
        }
    };

    const handleModalSalvarCon = () => {
        setIsModalSalvarCon(true);
    }

    const handleModalModelo = () => {
        setIsModalModeloOpen(true);
    };

    const closeModalExpo = () => {
        setIsModalExpoOpen(false);
    };

    const closeModalSql = () => {
        setIsModalOpenSQL(false);
    };


    const closeModalPdfView = () => {
        setIsModalPdfOpenView(false);
    };

    const closeModalModalAviso = () => {
        setIsModalModalAvisoOpen(false);
    };

    const closeModalFiltro = () => {
        setIsModalOpenFiltro(false);
    };


    const closeModalSalvos = () => {
        setIsModalOpenSalvos(false);
    };

    const closeModalSalvarCon = () => {
        setIsModalSalvarCon(false);
    }

    const closeModalModelo = () => {
        setIsModalModeloOpen(false);
    };

    const navigate = useNavigate();

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

    const redirectToPDF = () => {
        navigate('./pdfme', {
            state: {
                tableData
            }
        });
    };


    const handleSaveConditions = (conditions) => {
        setCondicoesString(conditions);
    };

    const hasData = tableData.length > 0 && tableData[0].values;

    // Calcular o número total de páginas
    const totalPages = hasData ? Math.ceil(tableData[0].values.length / itemsPerPage) : 0;

    // Função para mudar a página atual
    const changePage = (direction) => {
        setCurrentPage(prevPage => {
            if (direction === 'next' && prevPage < totalPages) return prevPage + 1;
            if (direction === 'prev' && prevPage > 1) return prevPage - 1;
            return prevPage;
        });
    };

    // Calcular o índice inicial e final dos itens da página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const shouldShowPagination = hasData && tableData[0].values.length > 15;

    const orderByString = localStorage.getItem('orderByString');

    const fetchData = async () => {
        try {
            const jsonRequest = {
                table: selectTable,
                columns: selectedColumns,
                conditions: condicoesString, // Adicione a condição aqui
                orderBy: orderByString, // Adicione a ordenação conforme necessário
                joins: [], // Adicione os joins conforme necessário
                totalizers: getTotalizers(), // Adicione os totalizadores conforme necessário
            };

            if (selectedRelacionada && relationshipData.length > 0) {

                console.log('tabelas selecionadas:', selectedRelacionada);

                selectedRelacionada.forEach((tablePair) => {
                    const relationship = relationshipData.find(rel => rel.tabelas === tablePair);
                    if (relationship) {
                        console.log('Relacionamento encontrado:', relationship);
                        jsonRequest.joins.push(relationship.join);
                    } else {
                        console.log('Relacionamento não encontrado para:', tablePair);
                    }
                });
            }

            const url = 'http://localhost:8080/find';

            console.log('Enviando requisição para:', url);
            console.log('JSON Request:', JSON.stringify(jsonRequest));

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

            const [sql, sql2, colunasAtualizada, data, resultTotalizer] = responseData;

            const sqlFinal = "Primeira Consulta: " + sql + " Consulta do totalizador: " + sql2;

            console.log('resultTotalizer:', resultTotalizer);

            console.log('SQL Gerado:', sqlFinal);

            localStorage.setItem('SQLGeradoFinal', sqlFinal);

            setRenderTotalizerResult(resultTotalizer);
            setSqlQuery(sql);
            setColumns(colunasAtualizada);

            return colunasAtualizada.map((column, index) => ({
                column,
                values: data.map(row => row[index]),

            }));
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            return [];
        }
    };

    const fetchLoadQuery = async () => {
        try {
            const url = 'http://localhost:8080/find/loadedQuery';
            const loadedQuery = localStorage.getItem('loadedQuery');

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: loadedQuery,
            });

            handleLoadFromLocalStorage()
            localStorage.removeItem('loadedQuery')

            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
            }

            const responseData = await response.json();

            const { columnsNickName, foundObjects } = responseData;

            if (!Array.isArray(foundObjects) || !Array.isArray(columnsNickName)) {

                throw new Error('Estrutura de resposta inválida');
            }

            const transformedData = columnsNickName.map((column, index) => {
                return {
                    column,
                    values: foundObjects.map(row => row[index])
                };
            });

            setColumns(columnsNickName);

            return transformedData;

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            return [];
        }
    };

    const handleGenerateReport = async () => {
        try {
            let data;
            if (localStorage.getItem('loadedQuery')) {
                data = await fetchLoadQuery();
                setTableData(data);
            } else {
                data = await fetchData();
                setTableData(data);
            }

            if (data && data.length > 0) {
                setIsView(true);
                setCurrentPage(1);
            } else {
                setIsView(false);
            }

        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            setIsView(false);
        }
    };

    const renderTotalizer = () => {
        if (!renderTotalizerResult) return null;

        const totalizerKeys = Object.keys(renderTotalizerResult);

        return (
            <tfoot className= "border-t border-black">
                <tr className="bg-gray-200 text-center">
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
                <tr className="bg-gray-200 text-center">
                    {columns.map((column, index) => {
                        const totalizerKey = totalizerKeys.find(key => key.includes(column));
                        return (
                            <td 
                            className="font-regular text-black pb-3"
                            key={index}>
                                {totalizerKey ? renderTotalizerResult[totalizerKey] : ""}
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
                            onClick={handleGenerateReport}
                        >
                            Gerar Relatório
                        </button>
                        <button
                            className="p-2 px-5 border-2 text-white bg-custom-azul hover:bg-custom-azul-escuro active:bg-custom-azul rounded-sm mr-2"
                            onClick={handleModalSalvarCon}
                        >
                            Salvar Consulta
                        </button>
                    </div>
                </div>
                <div className="flex mr-36 justify-center items-center">
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalSalvos} className="flex flex-col justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
                                </svg>
                                <label htmlFor="mais">Salvos</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalSql} className="flex flex-col justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                </svg>
                                <label htmlFor="mais">SQL</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalFiltro} className="relative flex flex-col justify-center items-center">
                                {condicoesString && (
                                    <span className="absolute -top-2 -right-1 bg-custom-vermelho text-white rounded-full text-xs w-4 h-4 flex justify-center items-center">
                                        {condicoesString.split('AND').length} {/* Número de condições separadas por 'AND' */}
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
                            <button onClick={redirectToPDF} className="flex flex-col justify-center items-center">

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                <label htmlFor="mais">Criar</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalModelo} className="flex flex-col justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                <label htmlFor="mais">Modelos</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalPdfView} className="flex flex-col justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                </svg>
                                <label htmlFor="mais">Prévia</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalExpo} className="flex flex-col justify-center items-center">
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
                    <table className="w-full text-sm">
                        {hasData && (
                            <thead className="bg-custom-azul-escuro text-white">
                                <tr>
                                    {columns.map((column, index) => (
                                        <th key={index} className="p-2 border-b text-center">{column}</th>
                                    ))}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {hasData ? (
                                tableData[0].values.slice(startIndex, endIndex).map((_, rowIndex) => (
                                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} className="p-2 border-b text-center">{tableData[colIndex]?.values[startIndex + rowIndex]}</td>
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
                    <div className="flex justify-center mt-4 mb-4">
                        <button
                            onClick={() => changePage('prev')}
                            disabled={currentPage === 1}
                            className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
                        >
                            Anterior
                        </button>
                        <span className="flex items-center">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => changePage('next')}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 mx-2 bg-custom-azul hover:bg-custom-azul-escuro focus:ring-custom-azul text-white rounded"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
            <ModalFiltro isOpen={isModalOpenFiltro} onClose={closeModalFiltro} columns={selectedColumns} onSave={handleSaveConditions} />
            <ModalSql isOpen={isModalOpenSQl} onClose={closeModalSql} />
            <ModalPdfView isOpen={isModalPdfOpenView} onClose={closeModalPdfView} table={tableData} templateKey={selectedTemplateKey} /> {/* Passa a chave do template selecionado */}
            <ModalExpo isOpen={isModalExpoOpen} onClose={closeModalExpo} table={tableData} selectedColumns={selectedColumns} templateKey={selectedTemplateKey} />
            <ModalSalvos isOpen={isModalOpenSalvos} onClose={closeModalSalvos} generateReport={handleGenerateReport} />
            <ModalModelo isOpen={isModalModeloOpen} onClose={closeModalModelo} onSelect={handleSelectTemplate} />
            <ModalSalvarCon isOpen={isModalSalvarConOpen} onClose={closeModalSalvarCon} sqlQuery={sqlQuery} />
            <ModalModal isOpen={isModalModalAvisoOpen} onClose={closeModalModalAviso} message="Nenhuma tabela foi selecionada para Gerar o Relatório" modalType="ALERTA" confirmText="Fechar" />
        </div>
    );
}

export default GerarRelatorio;