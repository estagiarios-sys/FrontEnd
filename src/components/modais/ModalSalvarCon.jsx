import React, { useEffect, useState } from "react";
import ModalModal from './ModalModal';

function ModalSalvarCon({ isOpen, onClose, sqlQuery }) {
    const [inputValue, setInputValue] = useState('');
    const [isConfirmModalSaveOpen, setIsModalModalSaveOpen] = useState(false);
    const [isConfirmModalUpdateOpen, setIsModalModalUpdateOpen] = useState(false);
    const [isConfirmModalAvisoOpen, setIsModalModalAvisoOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleInputChange1 = (event) => {
        setInputValue(event.target.value);
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

    const saveQuery = async () => {
        if (inputValue.length === 0 && sqlQuery.length === 0) {
            setModalMessage('Faça uma consulta para salvar.');
            handleModalModalAviso();
            return;
        } else if (inputValue.length > 0 && sqlQuery.length === 0) {
            setModalMessage('Faça uma consulta para salvar.');
            handleModalModalAviso();
            return;
        } else if(inputValue.length === 0 && sqlQuery.length > 0) {
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
    
            console.log(query);
    
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

            console.log(query);

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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const contentContainerStyle = {
        width: '500px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        paddingBottom: '60px',
    };

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
                    width: '500px',
                    height: '250px',
                }}
            >
                <div className="w-full bg-neutral-500 flex flex-row justify-between text-white p-2">
                    <h5 className="font-bold mx-2">Consultas Salvas</h5>
                    <button
                        className="font-bold mx-2"
                        onClick={() => {onClose(); setInputValue('')}}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '60px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '16px',
                            cursor: 'pointer',
                            zIndex: 1001,
                        }}
                    >
                        X
                    </button>
                </div>
                <div style={contentContainerStyle}>
                    <div className="w-11/12 bg-neutral-300 rounded-md p-4">
                        <h5 className="font-bold mb-4">Nome da Consulta</h5>
                        <input
                            type="text"
                            onChange={handleInputChange1}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                {/* Botões de Cancelar e Salvar */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '10px',
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        boxSizing: 'border-box',
                        backgroundColor: '#fff',
                    }}
                >
                    <button
                        style={{
                            backgroundColor: '#6c757d',
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginRight: '10px',
                        }}
                        onClick={() => {onClose(); setInputValue('')}}
                    >
                        Cancelar
                    </button>
                    <button
                        style={{
                            backgroundColor: '#28a745',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '5px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
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
