import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import ModalModal from './ModalModal';
import { FiFile, FiDownload } from 'react-icons/fi';

function ModalExpo({ isOpen, onClose, table, selectedColumns, combinedData }) {
    const [isModalAvisoOpen, setIsModalAvisoOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleModalAviso = (message) => {
        setModalMessage(message);
        setIsModalAvisoOpen(true);
    };

    const closeModalAviso = () => {
        setIsModalAvisoOpen(false);
    };

    const handleClose = () => {
        onClose();
    };

    const downloadFile = (blob, filename) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const handleDownloadPDF = async () => {
        if (!table || table.length === 0) {
            handleModalAviso('Por favor, selecione uma tabela e certifique-se de que há dados para exportar.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/pdf/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(combinedData),
            });

            if (!response.ok) {
                throw new Error('Erro ao gerar o PDF.');
            }

            const blob = await response.blob();
            const fileName = `relatorio_${new Date().toISOString()}.pdf`;
            downloadFile(blob, fileName);
        } catch (error) {
            handleModalAviso('Erro ao baixar o PDF. Por favor, tente novamente.');
            console.error('Erro ao baixar o PDF:', error);
        }
    };

    const convertToCSV = (columns, tableData) => {
        if (!columns || !tableData || tableData.length === 0) {
            console.error('As colunas ou os dados da tabela não estão definidos corretamente.');
            return '';
        }

        const data = tableData[0].values.map((_, rowIndex) => {
            return columns.reduce((acc, col, colIndex) => {
                acc[col] = tableData[colIndex]?.values[rowIndex] || '';
                return acc;
            }, {});
        });

        return Papa.unparse(data);
    };

    const downloadCSV = async (columns, tableData) => {
        if (!columns || columns.length === 0 || !tableData || tableData.length === 0) {
            handleModalAviso('Por favor, selecione pelo menos uma coluna e certifique-se de que há dados para exportar.');
            return;
        }

        const csvContent = convertToCSV(columns, tableData);

        if (!csvContent || csvContent.trim() === '') {
            handleModalAviso('O arquivo CSV está vazio. Verifique se os dados foram carregados corretamente.');
            return;
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const fileName = `relatorio_${new Date().toISOString()}.csv`;
        downloadFile(blob, fileName);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-96 h-40 relative">
                <div className="w-full bg-custom-azul-escuro flex justify-between items-center text-white p-3">
                    <h5 className="font-bold mx-2">EXPORTAR ARQUIVO</h5>
                    <button
                        className="font-bold mx-2 w-8 h-8 flex justify-center items-center text-lg rounded-full hover:bg-[#0A7F8E] transition-colors duration-300"
                        onClick={handleClose}
                        aria-label="Fechar modal"
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
                        onClick={() => downloadCSV(selectedColumns, table)}
                        icon={<FiDownload size={24} />}
                        label="Baixar CSV"
                    />
                </div>
            </div>

            <ModalModal
                isOpen={isModalAvisoOpen}
                onClose={closeModalAviso}
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
    selectedColumns: PropTypes.arrayOf(PropTypes.string),
    combinedData: PropTypes.object,
};

ModalExpo.defaultProps = {
    table: [],
    selectedColumns: [],
};

export default ModalExpo;