import React, { useState, useEffect } from "react";
import ModalAlert from './ModalAlert';
import { json } from "react-router-dom";
import { linkFinal } from '../../config.js';


function ModalSalvarCon({ isOpen, onClose, imgPDF, titlePdf, jsonRequest }) {
    const [inputValue, setInputValue] = useState('');
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });
    const [error, setError] = useState(null);
    const [savedQueryId, setSavedQueryId] = useState(null);  // Armazena o ID da consulta salva
    const formData = new FormData();

    useEffect(() => {
        const hasScroll = document.body.scrollHeight > window.innerHeight;
        setSavedQueryId(sessionStorage.getItem('IdQuery'));

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
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [isOpen]);

    const handleConfirm = () => {
        if (modal.type === 'CONFIRMAR') {
            updateQuery();
        } else if (modal.type === 'ALERTA') {
            closeModal();
        } else {
            handleOnClose();
        }
    };

    const handleOnClose = () => {
        setInputValue('');
        onClose();
    };

    const handleInputChange1 = (event) => {
        setInputValue(event.target.value);
        if (error) {
            setError(null);
        }
    };

    const openModal = (type, message) => {
        setModal({ isOpen: true, type, message });
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: '', message: '' });
    };

    const saveQuery = async () => {
        if (!inputValue) {
            setModal({ isOpen: true, type: 'ALERTA', message: 'Digite um nome para a consulta.' });
            return;
        }

        jsonRequest.queryName = inputValue;
        jsonRequest.pdfTitle = titlePdf;

        ['stringSavedQuerySaving', 'imgPDF'].forEach(field => formData.delete(field));
        formData.append('stringSavedQuerySaving', JSON.stringify(jsonRequest));
        formData.append('imgPDF', imgPDF);
       

        try {
            const response = await fetch(`${linkFinal}/saved-query`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': sessionStorage.getItem('token'),
                }
            });

            if (!response.ok) {
                if (response.status === 409) {
                    openModal('CONFIRMAR', 'Já existe uma consulta com esse nome. Deseja sobrescrever os dados existentes?');
                } else {
                    throw new Error('Falha na solicitação');
                }
            } else {
                const data = await response.json();
                console.log('Consulta salva:', data.id);
                setSavedQueryId(data.id);  // Armazena o ID da consulta salva
                openModal('SUCESSO', 'Consulta salva!');
                
            }
        } catch (error) {
            console.error('Error:', error);
            openModal('ALERTA', 'Ocorreu um erro ao salvar a consulta. Tente novamente.');
        }
    };

    const updateQuery = async () => {
       formData.append("id", savedQueryId)
       formData.delete('stringSavedQuerySaving');
       formData.append('stringSavedQueryUpdating', JSON.stringify(jsonRequest));
         
       for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
        }
      
        if (!savedQueryId) {
            openModal('ALERTA', 'ID da consulta não encontrado. Não é possível atualizar.');
            return;
        }

        try {
            const response = await fetch(`${linkFinal}/saved-query/${savedQueryId}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': sessionStorage.getItem('token'),
                }
            });

            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            JSON.stringify(response);
            openModal('SUCESSO', 'Consulta atualizada com sucesso!');
        } catch (error) {
            console.error('Error:', error);
            openModal('ALERTA', 'Erro ao atualizar a consulta. Tente novamente.');
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
                            id='consultaNome'
                            name='consultaNome'
                            onChange={handleInputChange1}
                            className="w-full border border-custom-azul-escuro rounded p-1 focus:ring-1 focus:ring-custom-azul-escuro focus:outline-none"
                        />
                    </div>
                </div>
                <div className="rounded-b-lg flex p-2 absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-between">
                    <div className="ml-auto flex items-center">
                        <button
                            className="font-bold text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer mr-2 flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-300"
                            onClick={handleOnClose}
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
                modalType={modal.type || 'ALERTA'}
                message={modal.message}
                confirmText={modal.type === 'CONFIRMAR' ? 'Substituir' : 'Ok'}
                onConfirm={handleConfirm}
            />
        </div>
    );
}

export default ModalSalvarCon;
