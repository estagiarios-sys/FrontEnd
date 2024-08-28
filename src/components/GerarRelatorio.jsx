import React, { useState, useEffect } from "react";
import ModalSql from "./modais/ModalSql";
import ModalPdf from "./modais/ModalPdf";
import ModalExpo from "./modais/ModalExpo";
import ModalSalvos from "./modais/ModalSalvos";
import ModalFiltro from "./modais/ModalFiltro";
import { useNavigate } from 'react-router-dom';

function GerarRelatorio({ selectedColumns, selectTable, selectedRelacionada }) {

    const [isModalOpenSalvos, setIsModalOpenSalvos] = useState(false);
    const [isModalOpenSQl, setIsModalOpenSQL] = useState(false);
    const [isModalOpenFiltro, setIsModalOpenFiltro] = useState(false);
    const [isModalPdfOpen, setIsModalPdfOpen] = useState(false);
    const [isModalExpoOpen, setIsModalExpoOpen] = useState(false);

    const [relationshipData, setRelationshipData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [condicoesString, setCondicoesString] = useState(''); // Novo estado

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

    const handleModalPdf = () => {
        setIsModalPdfOpen(true);
    };

    const closeModalExpo = () => {
        setIsModalExpoOpen(false);
    };

    const closeModalSql = () => {
        setIsModalOpenSQL(false);
    };

    const closeModalPdf = () => {
        setIsModalPdfOpen(false);
    };

    const closeModalFiltro = () => {
        setIsModalOpenFiltro(false);
    };

    const closeModalSalvos = () => {
        setIsModalOpenSalvos(false);
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
        navigate('./pdfme');
    };

    const handleSaveQuery = () => {
        console.log('Consulta salva com sucesso!');
    };

    const handleSaveConditions = (conditions) => {
        setCondicoesString(conditions);
    };

    const fetchData = async () => {
        try {
            // Construir o objeto JSON que será enviado na requisição
            const jsonRequest = {
                table: selectTable,
                columns: selectedColumns,
                conditions: condicoesString, // Adicione a condição aqui
                orderBy: '', // Adicione a ordenação conforme necessário
                joins: [], // Adicione os joins conforme necessário
            };
        
            if (selectedRelacionada && relationshipData.length > 0) {
                const tablePair = `${selectTable} e ${selectedRelacionada}`;
                const relationship = relationshipData.find(rel => rel.tabelas === tablePair);
                if (relationship) {
                    console.log('Relacionamento encontrado:', relationship);
                    jsonRequest.joins.push(relationship.join);
                } else {
                    console.log('Relacionamento não encontrado para:', tablePair);
                }
            }
    
            const url = 'http://localhost:8080/find'; // Nova rota
    
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
    
            const [sql, data] = responseData;
    
            console.log('SQL:', sql);

            return selectedColumns.map((column, index) => ({
                column,
                values: data.map(row => row[index]) // Acessa pelo índice
            }));
        } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            return [];
        }
    };

    const handleGenerateReport = async () => {
        const data = await fetchData();
        console.log('Dados recebidos para as colunas:', data);
        setTableData(data);  // Atualize o estado com os dados recebidos
        setColumns(selectedColumns);  // Atualize o estado com as colunas selecionadas
    };

    return (
        <div className="flex flex-col w-full">
            <div className="w-full flex flex-row justify-between mt-4">
                <div className="flex flex-col justify-start items-start ml-36">
                    <h1 className="font-bold text-3xl">Ações</h1>
                    <div className="flex mt-3">
                        <button
                            className="p-2 px-5 border-2 bg-neutral-300 hover:bg-neutral-400 active:bg-neutral-500 rounded-sm mr-2"
                            onClick={handleGenerateReport}
                        >
                            Gerar Relatório
                        </button>
                        <button
                            className="p-2 px-5 border-2 bg-neutral-300 hover:bg-neutral-400 active:bg-neutral-500 rounded-sm"
                            onClick={handleSaveQuery}
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            <label htmlFor="mais">Modelos</label>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalFiltro} className="flex flex-col justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
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
                                <label htmlFor="mais">Editar</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalPdf} className="flex flex-col justify-center items-center">
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
            
            <div className="border-2 border-neutral-600 my-3 w-10/12 mx-auto overflow-auto">
                <table className="w-full text-sm">
                    <thead className="bg-neutral-200 border-b-2 border-neutral-600">
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} className="p-3 text-left">{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.values.map((value, colIndex) => (
                                    <td key={colIndex} className="p-3">{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <ModalSalvos isOpen={isModalOpenSalvos} onClose={closeModalSalvos} />
            <ModalSql isOpen={isModalOpenSQl} onClose={closeModalSql} />
            <ModalPdf isOpen={isModalPdfOpen} onClose={closeModalPdf} />
            <ModalExpo isOpen={isModalExpoOpen} onClose={closeModalExpo} />
            <ModalFiltro 
                isOpen={isModalOpenFiltro} 
                onClose={closeModalFiltro} 
                columns={selectedColumns}
                onSave={handleSaveConditions} // Passe a função para o modal
            />
        </div>
    );
}

export default GerarRelatorio;
