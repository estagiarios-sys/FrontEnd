import React, { useState, useEffect } from "react";
import ModalAlert from './ModalAlert';
import { getTotalizers } from "../CamposSelecionados";

function ModalSalvarCon({ isOpen, onClose, sqlQuery, sql2, img, titlePdf }) {
    const [inputValue, setInputValue] = useState('');
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });
    const [error, setError] = useState(null);

    // useEffect para impedir o scroll da página quando o modal estiver aberto
    useEffect(() => {
        const hasScroll = document.body.scrollHeight > window.innerHeight;

        if (isOpen) {
            if (hasScroll) {
                document.body.style.paddingRight = "6px"; // Adiciona padding para ajustar o layout
            }
            document.body.style.overflow = "hidden"; // Desativa o scroll da página
        } else {
            document.body.style.overflow = ""; // Restaura o scroll ao fechar o modal
            document.body.style.paddingRight = ""; // Remove o padding ao fechar o modal
        }

        return () => {
            // Limpeza ao desmontar o componente ou fechar o modal
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [isOpen]); // Executa o efeito sempre que o estado `isOpen` mudar

    const handleInputChange1 = (event) => {
        setInputValue(event.target.value);
        if (error) {
            setError(null); // Limpa a mensagem de erro ao digitar
        }
    };

    const openModal = (type, message) => {
        setModal({ isOpen: true, type, message });
    };

    const closeModal = () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
    };

    const saveQuery = async () => {
        if (inputValue.length === 0 && sqlQuery.length === 0) {
            openModal('ALERTA', 'Faça uma consulta para salvar.');
            return;
        } else if (inputValue.length > 0 && sqlQuery.length === 0) {
            openModal('ALERTA', 'Faça uma consulta para salvar.');
            return;
        } else if (inputValue.length === 0 && sqlQuery.length > 0) {
            openModal('ALERTA', 'Digite um nome para salvar a consulta.');
            return;
        }

        try {
            const totalizersObject = getTotalizers() || {};
            const totalizersArrayFormatted = Object.entries(totalizersObject).map(([key, totalizer]) => {
                const [table, column] = key.split('.');
                const formattedKey = `${table.toLowerCase()}.${column.toLowerCase()}`;
                return {
                    totalizer: {
                        [formattedKey]: totalizer
                    }
                };
            });

            const dataToSave = {
                queryName: inputValue,
                finalQuery: sqlQuery,
                totalizersQuery: sql2 || "",
                titlePDF: titlePdf,
                totalizers: totalizersArrayFormatted
            };

            const formData = new FormData();
            formData.append('stringSavedQuerySaving', JSON.stringify(dataToSave));
            formData.append('imgPDF', img);

            const response = await fetch('http://localhost:8080/save', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            openModal('SUCESSO', 'Consulta salva!');
        } catch (error) {
            console.error('Error:', error);
            openModal('CONFIRMAR', 'Já existe uma consulta com esse nome. Deseja sobrescrever os dados existentes?');
        }
    };

    const updateQuery = async () => {
        try {
            const dataToSave = {
                queryName: inputValue,
                query: sqlQuery,
            };

            const query = JSON.stringify(dataToSave);

            const response = await fetch('http://localhost:8080/update/saved-query', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: query,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            onClose(); // Fecha o modal após a atualização
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg relative w-[500px] h-[250px]">
                <div className="w-full bg-custom-azul-escuro flex justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">SALVAR CONSULTA</h5>
                    <button
                        className="font-bold text-lg rounded-full w-8 h-8 flex justify-center items-center bg-[#0A7F8E] hover:bg-[#00AAB5] transition-colors duration-300"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="flex flex-col items-center mt-3">
                    <div className="w-11/12 bg-gray-200 bg-opacity-30 rounded-md p-4 relative">
                        <h5 className="font-medium mb-4">Nome da Consulta</h5>
                        <input
                            type="text"
                            onChange={handleInputChange1}
                            className="w-full border border-custom-azul-escuro rounded p-1 focus:ring-1 focus:ring-custom-azul-escuro focus:outline-none"
                        />
                    </div>
                </div>
                <div className="rounded-b-lg flex p-2 absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-between">
                    <div className="ml-auto flex items-center">
                        <button
                            className="font-bold text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer mr-2 flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-300"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="font-bold border-none text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer flex items-center justify-center bg-custom-azul hover:bg-custom-azul-escuro transition-colors duration-300"
                            onClick={saveQuery}
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
            <ModalAlert
                isOpen={modal.isOpen}
                onClose={closeModal}
                onConfirm={modal.type === 'SUCESSO' ? onClose : updateQuery}
                modalType={modal.type || 'ALERTA'}
                message={modal.message}
                confirmText={modal.type === 'SUCESSO' ? 'Ok' : 'Substituir'}
                title="Confirmação"
                buttonColors={{
                    ok: modal.type === 'SUCESSO' ? "bg-gray-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"
                }}
            />
        </div >
    );
}

export default ModalSalvarCon;