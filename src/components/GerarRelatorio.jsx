import React, { useState, useRef, useEffect } from "react";
import ModalSql from "./modais/ModalSql";
import { useNavigate } from 'react-router-dom';

function GerarRelatorio({ selectedColumns, selectTable, selectedRelacionada }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [relationshipData, setRelationshipData] = useState([]);
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchRelationshipData = async () => {
            try {
                const response = await fetch('http://localhost:8080/procurar/relationship');
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

    const handleModalSql = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchData = async () => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("columns", selectedColumns.join(","));

            let joinParam = '';

            if (selectedRelacionada && relationshipData.length > 0) {
                const tablePair = `${selectTable} e ${selectedRelacionada}`;

                const relationship = relationshipData.find(rel => rel.tabelas === tablePair);
                if (relationship) {
                    console.log('Relacionamento encontrado:', relationship);
                    joinParam = relationship.join;
                } else {
                    console.log('Relacionamento não encontrado para:', tablePair);
                }

            }

            const url = `http://localhost:8080/procurar/table/${selectTable}?${queryParams.toString()}${joinParam ? `&joins=${encodeURIComponent(joinParam)}` : ''}`;

            console.log('URL gerada:', url); // Verifique a URL gerada
            console.log('Join encontrado:', joinParam);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar os dados: ${response.statusText}`);
            }

            const data = await response.json();

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
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Limpar o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Configurações básicas do texto
        ctx.font = '16px "Segoe UI", Arial';
        ctx.fillStyle = 'black';

        const data = await fetchData();
        console.log('Dados recebidos para as colunas:', data);

        if (data.length > 0) {
            ctx.fillStyle = '#01aab5';
            ctx.fillRect(10, 30, canvas.width - 20, 40);
            ctx.fillStyle = 'white';
            ctx.font = 'bold 18px "Segoe UI", Arial';

            selectedColumns.forEach((column, index) => {
                ctx.fillText(column, 20 + index * 200, 55);
            });

            ctx.font = '16px "Segoe UI", Arial';
            data[0].values.forEach((_, rowIndex) => {
                const yPosition = 90 + rowIndex * 40;

                ctx.fillStyle = rowIndex % 2 === 0 ? '#F1F1F1' : '#FFFFFF';
                ctx.fillRect(10, yPosition - 20, canvas.width - 20, 40);

                selectedColumns.forEach((column, colIndex) => {
                    const value = data[colIndex].values[rowIndex];
                    ctx.fillStyle = 'black';
                    ctx.fillText(value, 20 + colIndex * 200, yPosition);
                });
            });

            // Adicionar bordas à tabela
            ctx.strokeStyle = '#CCCCCC';
            ctx.lineWidth = 2;
            ctx.strokeRect(10, 30, canvas.width - 20, 40 + data[0].values.length * 40);
        } else {
            ctx.fillText('Nenhum dado encontrado.', 10, 40);
        }
    };

    return (
        <div className="flex flex-col w-full">
            <div className="w-full flex flex-row justify-between mt-4">
                <div className="flex flex-col justify-start items-start ml-36">
                    <h1 className="font-bold text-3xl">Ações</h1>
                    <button
                        className="p-2 px-5 border-2 bg-neutral-300 mt-3 hover:bg-neutral-400 active:bg-neutral-500 rounded-sm"
                        onClick={handleGenerateReport}
                    >
                        Gerar Relatório
                    </button>
                </div>
                <div className="flex mr-36 justify-center items-center">
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <button onClick={handleModalSql}>
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
                            <button onClick={redirectToPDF}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                                <label htmlFor="mais">Editar</label>
                            </button>
                        </div>
                    </div>
                    <div className="mx-2">
                        <div className="flex flex-col justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25a.75.75 0 00.75.75h16.5a.75.75 0 00.75-.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" />
                            </svg>
                            <label htmlFor="mais">Exportar</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
                <canvas id="tabelas" ref={canvasRef} className='border-2 border-neutral-600 my-3 w-10/12' width="800" height="400"></canvas>
            </div>
            <ModalSql isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default GerarRelatorio;
