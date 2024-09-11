import React, { useState } from "react";
import ModalModal from './ModalModal';

function ModalSalvarCon({ isOpen, onClose, sqlQuery }) {
    const [inputValue, setInputValue] = useState('');

    const [isConfirmModalSaveOpen, setIsModalModalSaveOpen] = useState(false);
    const [isConfirmModalUpdateOpen, setIsModalModalUpdateOpen] = useState(false);
    const [isConfirmModalAvisoOpen, setIsModalModalAvisoOpen] = useState(false);
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

    const handleModalModalSave = () => {
        setModalMessage('Consulta salva!');
        setIsModalModalSaveOpen(true);
    };

    const handleModalModalUpdate = () => {
        setModalMessage('Já existe uma consulta com esse nome. Deseja sobrescrever os dados existentes?');
        setIsModalModalUpdateOpen(true);
    };

    const handleModalModalAviso = () => {
        setIsModalModalAvisoOpen(true);
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
            handleModalModalAviso();
            return;
        } else if (inputValue.length > 0 && sqlQuery.length === 0) {
            setModalMessage('Faça uma consulta para salvar.');
            handleModalModalAviso();
            return;
        } else if (inputValue.length === 0 && sqlQuery.length > 0) {
            setModalMessage('Digite um nome para salvar a consulta.');
            handleModalModalAviso();
            return;
        }

        try {
            const dataToSave = {
                queryName: inputValue,
                query: sqlQuery,
            };

            const query = JSON.stringify(dataToSave);

            const response = await fetch('http://localhost:8080/save', {
                method: 'POST',
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
            handleModalModalSave();
        } catch (error) {
            handleModalModalUpdate();
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
            <ModalModal modalType="SUCESSO"
                isOpen={isConfirmModalSaveOpen}
                onClose={() => setIsModalModalSaveOpen(false)}
                onConfirm={onClose}
                confirmText="Ok"
                message={modalMessage}
                title="Confirmação"
                buttonColors={{
                    ok: "bg-gray-600 hover:bg-red-700 focus:ring-gray-600",
                }}
            />
            <ModalModal modalType="ALERTA"
                isOpen={isConfirmModalUpdateOpen}
                onClose={() => setIsModalModalUpdateOpen(false)}
                onConfirm={updateQuery}
                confirmText="Substituir"
                message={modalMessage}
                title="Confirmação"
                buttonColors={{
                    ok: "bg-red-600 hover:bg-red-700 focus:ring-gray-600",
                }}
            />
            <ModalModal modalType="ALERTA"
                isOpen={isConfirmModalAvisoOpen}
                onClose={() => setIsModalModalAvisoOpen(false)}
                onConfirm={() => setIsModalModalAvisoOpen(false)}
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
