import React, { useState } from "react";
import ModalAlert from './ModalAlert';
import { getTotalizers } from "../CamposSelecionados";


function ModalSalvarCon({ isOpen, onClose, sqlQuery, sql2, img, titlePdf}) {
    const [inputValue, setInputValue] = useState('');

    const [isConfirmModalSaveOpen, setIsModalAlertSaveOpen] = useState(false);
    const [isConfirmModalUpdateOpen, setIsModalAlertUpdateOpen] = useState(false);
    const [isConfirmModalAvisoOpen, setIsModalAlertOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);
    const [isHoveredButtonCancelar, setIsHoveredButtonCancelar] = useState(false);
    const [isHoveredButtonCarregar, setIsHoveredButtonCarregar] = useState(false);

    const [error, setError] = useState(null);

    const handleInputChange1 = (event) => {
        setInputValue(event.target.value);
        if (error) {
            setError(null); // Limpa a mensagem de erro ao digitar
        }

    };

    const url = window.location.hostname
    const completUrl = "8082/reportsback"

    const handleModalAlertSave = () => {
        setModalMessage('Consulta salva!');
        setIsModalAlertSaveOpen(true);
    };

    const handleModalAlertUpdate = () => {
        setModalMessage('Já existe uma consulta com esse nome. Deseja sobrescrever os dados existentes?');
        setIsModalAlertUpdateOpen(true);
    };

    const handleModalAlert = () => {
        setIsModalAlertOpen(true);
    }

    const contentContainerStyle = {
        width: '500px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        paddingBottom: '60px',
    };

    const resetHoverStates = () => {
        setIsHoveredButtonX(false);
    };

    const handleClose = () => {
        resetHoverStates();
        setInputValue('');
        onClose();
    };

    const saveQuery = async () => {
        if (inputValue.length === 0 && sqlQuery.length === 0) {
            setModalMessage('Faça uma consulta para salvar.');
            handleModalAlert();
            return;
        } else if (inputValue.length > 0 && sqlQuery.length === 0) {
            setModalMessage('Faça uma consulta para salvar.');
            handleModalAlert();
            return;
        } else if (inputValue.length === 0 && sqlQuery.length > 0) {
            setModalMessage('Digite um nome para salvar a consulta.');
            handleModalAlert();
            return;
        }
    
        try {
            const totalizersObject = getTotalizers() || {};
            const totalizersArrayFormatted = Object.entries(totalizersObject).map(([key, totalizer]) => {
                const [table, column] = key.split('.');
                const formattedKey = `${table.toLowerCase()}.${column.toLowerCase()}`; // Coloca em minúsculas
                return {
                    totalizer: {
                        [formattedKey]: totalizer
                    }
                };
            });
            
            // Criar o objeto JSON com os dados da consulta
            const dataToSave = {
                queryName: inputValue,
                finalQuery: sqlQuery,
                totalizersQuery: sql2 || "",
                titlePDF: titlePdf,
                totalizers: totalizersArrayFormatted
            };

            console.log(dataToSave)
    
            // Criar um FormData
            const formData = new FormData();
    
            // Adicionar o JSON como uma string
            formData.append('stringSavedQuerySaving', JSON.stringify(dataToSave));  // Os dados JSON são enviados como string
    
            // Adicionar a imagem
            formData.append('imgPDF', img);  // A imagem é enviada como um arquivo binário
    
            // Enviar a requisição com fetch
            const response = await fetch(`http://${url}:${completUrl}/save`, {
                method: 'POST',
                body: formData,  // Enviando tudo com FormData
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Success:', result);
            handleModalAlertSave();
        } catch (error) {
            console.error('Error:', error);
            handleModalAlertUpdate();
        }
    };
    


    const updateQuery = async () => {
        try {
            const dataToSave = {
                queryName: inputValue,
                query: sqlQuery,
            };

            const query = JSON.stringify(dataToSave);

            const response = await fetch(`http://${url}:${completUrl}/update/saved-query`, {
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

            console.log('Success:', result);
            onClose(); // Fecha o modal após a atualização
        } catch (error) {
            console.error('Error:', error);
        }
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
                zIndex: 50,
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '0px',
                    borderRadius: '5px',
                    position: 'relative',
                    width: '500px',
                    height: '250px',
                }}
            >
                <div className="w-full bg-custom-azul-escuro flex flex-row justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">SALVAR CONSULTA</h5>
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
                <div style={contentContainerStyle}>
                    <div className="w-11/12 bg-gray-200 bg-opacity-30  rounded-md p-4">
                        <h5 className="font-medium mb-4">Nome da Consulta</h5>
                        <input
                            type="text"
                            onChange={handleInputChange1}
                            className="w-full border border-custom-azul-escuro rounded p-1 focus:ring-1 focus:ring-custom-azul-escuro focus:outline-none"
                        />
                    </div>
                </div>
                {/* Botões de Cancelar e Salvar */}

                <div
                    style={{
                        backgroundColor: '#fff',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '10px',
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        boxSizing: 'border-box',
                    }}
                >

                    <button className="align-left"
                        style={{
                            backgroundColor: '#6c757d',
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            width: '80px',
                            height: '40px',
                            padding: '0', // Remover padding para garantir que o tamanho definido seja exato
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginRight: '10px',
                            display: 'flex', // Usar flexbox para alinhamento
                            alignItems: 'center', // Alinhamento vertical
                            justifyContent: 'center', // Alinhamento horizontal
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonCancelar ? '#5a6268' : '#6c757d'
                        }}
                        onMouseEnter={() => setIsHoveredButtonCancelar(true)}
                        onMouseLeave={() => setIsHoveredButtonCancelar(false)}
                        onClick={() => { onClose(); setInputValue('') }}
                    >
                        Cancelar
                    </button>
                    <button className="align-left"
                        style={{
                            border: 'none',
                            color: '#fff',
                            borderRadius: '5px',
                            width: '80px',
                            height: '40px',
                            padding: '0',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex', // Usar flexbox para alinhamento
                            alignItems: 'center', // Alinhamento vertical
                            justifyContent: 'center', // Alinhamento horizontal
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonCarregar ? '#00AAB5' : '#0A7F8E',
                        }}
                        onMouseEnter={() => setIsHoveredButtonCarregar(true)}
                        onMouseLeave={() => setIsHoveredButtonCarregar(false)}
                        onClick={saveQuery}
                    >
                        Salvar
                    </button>
                </div>
            </div>
            <ModalAlert modalType="SUCESSO"
                isOpen={isConfirmModalSaveOpen}
                onClose={() => setIsModalAlertSaveOpen(false)}
                onConfirm={onClose}
                confirmText="Ok"
                message={modalMessage}
                title="Confirmação"
                buttonColors={{
                    ok: "bg-gray-600 hover:bg-red-700 focus:ring-gray-600",
                }}
            />
            <ModalAlert modalType="ALERTA"
                isOpen={isConfirmModalUpdateOpen}
                onClose={() => setIsModalAlertUpdateOpen(false)}
                onConfirm={updateQuery}
                confirmText="Substituir"
                message={modalMessage}
                title="Confirmação"
                buttonColors={{
                    ok: "bg-red-600 hover:bg-red-700 focus:ring-gray-600",
                }}
            />
            <ModalAlert modalType="ALERTA"
                isOpen={isConfirmModalAvisoOpen}
                onClose={() => setIsModalAlertOpen(false)}
                onConfirm={() => setIsModalAlertOpen(false)}
                confirmText="Ok"
                message={modalMessage}
                title="Aviso"
                buttonColors={{
                    ok: "bg-yellow-600 hover:bg-yellow-700 focus:ring-gray-600",
                }}
            />
        </div>
    );
}

export default ModalSalvarCon;
