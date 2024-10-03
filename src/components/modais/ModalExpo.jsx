import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Papa from "papaparse";
import ModalAlert from "./ModalAlert";
import { FiFile, FiDownload } from "react-icons/fi";

export async function downloadPDF(combinedData, handleModalAviso, setPdfOK) {
    if (!combinedData || Object.keys(combinedData).length === 0) {
        handleModalAviso(
            "Por favor, selecione pelo menos uma tabela e certifique-se de que há dados para exportar."
        );
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/pdf/set-data", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(combinedData),
        });

        if (!response.ok) {
            throw new Error("Erro ao gerar o PDF.");
        }
    } catch (error) {
        handleModalAviso(
            "Erro ao gerar o PDF. Por favor, tente novamente. Se o erro persistir, entre em contato com o suporte."
        );
        console.error("Erro ao gerar o PDF:", error);
    } finally {
        setPdfOK(true);
    }
}

export function downloadCSV(columns, tableData, handleModalAviso) {
    if (
        !columns ||
        columns.length === 0 ||
        !tableData ||
        tableData.length === 0
    ) {
        handleModalAviso(
            "Por favor, selecione pelo menos uma coluna e certifique-se de que há dados para exportar."
        );
        return;
    }
    console.log('columns', columns);

    const columnsName = columns.map((col) => {
        if (col.value.includes(' as ')) {
            const aliasMatch = col.value.match(/as\s+"(.+?)"/i);
            return aliasMatch ? aliasMatch[1] : col.value;
        }
        console.log('col', col);
        return col.value;
    });
    console.log('columnsName', columnsName);
    const csvContent = convertToCSV(columnsName, tableData);

    if (!csvContent || csvContent.trim() === "") {
        handleModalAviso(
            "O arquivo CSV está vazio. Verifique se os dados foram carregados corretamente."
        );
        return;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const fileName = `relatorio_${new Date().toISOString()}.csv`;
    downloadFile(blob, fileName);
}

const downloadFile = (blob, filename) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

const convertToCSV = (columns, tableData) => {
    if (!columns || !tableData || tableData.length === 0) {
        console.error(
            "As colunas ou os dados da tabela não estão definidos corretamente."
        );
        return "";
    }

    const data = tableData[0].values.map((_, rowIndex) => {
        return columns.reduce((acc, col, colIndex) => {
            acc[col] = tableData[colIndex]?.values[rowIndex] || "";
            return acc;
        }, {});
    });

    return Papa.unparse(data);
};

function ModalExpo({
    isOpen,
    onClose,
    table = [],
    selectedColumns = [],
    combinedData,
    setPdfOK,
}) {
    const [isModalAvisoOpen, setIsModalAvisoOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const handleDownloadPDF = async () => {
        handleModalAviso(
            "O PDF está sendo gerado, quando finalizar você será notificado."
        );
        await downloadPDF(combinedData, handleModalAviso, setPdfOK);
    };

    const handleModalAviso = (message) => {
        setModalMessage(message);
        setIsModalAvisoOpen(true);
    };

    const closeModalAviso = () => {
        setIsModalAvisoOpen(false);
        onClose();
    };

    // Impedir scroll da página quando o modal está aberto
    useEffect(() => {
        const hasScroll = document.body.scrollHeight > window.innerHeight;

        if (isOpen) {
            if (hasScroll) {
                document.body.style.paddingRight = "6px"; // Adiciona padding
            }
            document.body.style.overflow = "hidden"; // Desativa o scroll
        } else {
            document.body.style.overflow = ""; // Restaura o scroll
            document.body.style.paddingRight = ""; // Remove o padding
        }

        return () => {
            document.body.style.overflow = ""; // Limpeza no fechamento
            document.body.style.paddingRight = ""; // Limpeza no fechamento
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-96 h-40 relative">
                <div className="w-full bg-custom-azul-escuro flex justify-between items-center text-white p-3">
                    <h5 className="font-bold mx-2">EXPORTAR ARQUIVO</h5>
                    <button
                        className="font-bold text-lg rounded-full w-8 h-8 flex justify-center items-center bg-[#0A7F8E] hover:bg-[#00AAB5] transition-colors duration-300"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="flex flex-row justify-center items-center mt-5 gap-16">
                    <DownloadButton
                        onClick={handleDownloadPDF}
                        icon={<FiFile size={24} />}
                        label="Baixar PDF"
                    />
                    <DownloadButton
                        onClick={() => {
                            downloadCSV(selectedColumns, table, handleModalAviso);
                        }}
                        icon={<FiDownload size={24} />}
                        label="Baixar CSV"
                    />
                </div>
            </div>

            <ModalAlert
                isOpen={isModalAvisoOpen}
                onClose={closeModalAviso}
                onConfirm={closeModalAviso}
                message={modalMessage}
                modalType="ALERTA"
                confirmText="Fechar"
            />
        </div>
    );
}

function DownloadButton({ onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center bg-gray-200 hover:bg-gray-300 rounded-md p-2 transition-colors duration-300"
            aria-label={label}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

DownloadButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
};

ModalExpo.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    table: PropTypes.arrayOf(
        PropTypes.shape({
            values: PropTypes.array.isRequired,
        })
    ),
    selectedColumns: PropTypes.arrayOf(PropTypes.object),
    combinedData: PropTypes.object,
    setPdfOK: PropTypes.func.isRequired, // Adicionado setPdfOK aos propTypes
};

export default ModalExpo;