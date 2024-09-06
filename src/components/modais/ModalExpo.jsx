import React, { useState } from "react";
import { generatePDF as generatePDFExternal } from "../PDF/pdfGenerate";  // Supondo que `generatePDF` está sendo importado corretamente
import ModalModal from "./ModalModal";

function ModalExpo({ isOpen, onClose, table, selectedColumns, templateKey }) {
    const [isModalModalAvisoOpen, setIsModalModalAvisoOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);
    const [isHoveredButtonPDF, setIsHoveredButtonPDF] = useState(false);
    const [isHoveredButtonCSC, setIsHoveredButtonCSC] = useState(false);

    const handleModalModalAviso = (message) => {
        setModalMessage(message);
        setIsModalModalAvisoOpen(true);
    };

    const closeModalModalAviso = () => {
        setIsModalModalAvisoOpen(false);
    };

    const resetHoverStates = () => {
        setIsHoveredButtonX(false);
    };

    const handleClose = () => {
        resetHoverStates();
        onClose();
    };

    // Função para verificar se os dados estão presentes antes de gerar o PDF
    const generatePDF = (table, templateKey) => {
        
        if (!table || table.length === 0) {
            handleModalModalAviso("Por favor, selecione uma tabela e certifique-se de que há dados para exportar.");
            return;
        }
        if (!templateKey) {
            handleModalModalAviso("Por favor, selecione um template antes de exportar.");
            return;
        }

        generatePDFExternal(table, templateKey); // Chama a função externa para gerar o PDF
    };

    // Função para converter os dados em CSV
    const convertToCSV = (columns, tableData) => {
        if (!columns || !tableData || tableData.length === 0) {
            console.error("Columns or tableData are not properly defined.");
            return '';
        }

        let csvContent = columns.join(",") + "\n"; // Adiciona o cabeçalho das colunas

        const numRows = tableData[0]?.values?.length || 0;

        for (let i = 0; i < numRows; i++) {
            let row = [];
            for (let j = 0; j < columns.length; j++) {
                row.push(tableData[j]?.values[i] || ""); // Se `values` estiver indefinido, insere uma string vazia
            }
            csvContent += row.join(",") + "\n";
        }

        return csvContent;
    };

    // Verifique se a função `downloadCSV` só está definida uma vez
    const downloadCSV = (columns, tableData) => {
        if (!columns || columns.length === 0 || !tableData || tableData.length === 0) {
            handleModalModalAviso("Por favor, selecione pelo menos uma coluna e certifique-se de que há dados para exportar.");
            return;
        }

        const csvContent = convertToCSV(columns, tableData);

        if (!csvContent || csvContent.trim() === "") {
            handleModalModalAviso("O arquivo CSV está vazio. Verifique se os dados foram carregados corretamente.");
            return;
        }

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "relatorio.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '0px',
                    borderRadius: '5px',
                    position: 'relative',
                    width: '400px',
                    height: '160px', // Definindo a altura como 500px
                }}
            >
                <div className="w-full bg-custom-azul-escuro flex flex-row justify-between items-center text-white p-3">
                    <h5 className="font-bold mx-2">EXPORTAR AQUIVO</h5>
                    <button
                        className="font-bold mx-2"
                        onClick={handleClose}
                        style={{
                            borderRadius: '50px',
                            hover: 'pointer',
                            hoverBackgroundColor: '#0A7F8E',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonX ? '#00AAB5' : '#0A7F8E',
                        }}
                        onMouseEnter={() => setIsHoveredButtonX(true)}
                        onMouseLeave={() => setIsHoveredButtonX(false)}
                    >
                        X
                    </button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '20px',
                        gap: '60px',
                    }}
                >
                    <button onClick={() => generatePDF(table, templateKey)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonPDF ? 'rgba(0, 170, 181, 0.1)' : 'rgba(229, 231, 235, 0.3)',
                            borderRadius: '5px',
                            padding: '10px',
                            cursor: 'pointer',
                            border: 'none',
                        }}
                        onMouseEnter={() => setIsHoveredButtonPDF(true)}
                        onMouseLeave={() => setIsHoveredButtonPDF(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-file"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span>Baixar PDF</span>
                    </button>

                    <button onClick={() => downloadCSV(selectedColumns, table)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: isHoveredButtonCSC ? 'rgba(0, 170, 181, 0.1)' : 'rgba(229, 231, 235, 0.3)',
                            borderRadius: '5px',
                            padding: '10px',
                            cursor: 'pointer',
                            border: 'none',
                        }}
                        onMouseEnter={() => setIsHoveredButtonCSC(true)}
                        onMouseLeave={() => setIsHoveredButtonCSC(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-download"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>Baixar CSV</span>
                    </button>
                </div>
            </div>

            <ModalModal
                isOpen={isModalModalAvisoOpen}
                onClose={closeModalModalAviso}
                message={modalMessage}
                modalType="ALERTA"
                confirmText="Fechar"
            />
        </div>
    );
}

export default ModalExpo;