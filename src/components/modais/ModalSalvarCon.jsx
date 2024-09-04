

import React, { useState } from "react";
import ModalModal from './ModalModal';

function ModalSalvarCon({ isOpen, onClose, sqlQuery }) {
    const [inputValue, setInputValue] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange1 = (event) => {
        setInputValue(event.target.value);
        if (error) {
            setError(null); // Limpa a mensagem de erro ao digitar
        }
    };

    const saveQuery = async () => {
        if (!inputValue.trim()) {
            setError("O nome não pode estar vazio."); // Define a mensagem de erro
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
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        onClose(); // Fecha o modal principal
    };

    if (!isOpen) return null;

    return (
        <>
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
                    <div className="w-full bg-neutral-500 flex flex-row justify-between text-white p-2">
                        <h5 className="font-bold mx-2">Consultas Salvas</h5>
                        <button
                            className="font-bold mx-2"
                            onClick={onClose}
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
                    <div style={{ 
                        width: '500px', 
                        height: '200px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        marginTop: '20px', 
                        paddingBottom: '60px' 
                    }}>
                        <div className="w-11/12 bg-neutral-300 rounded-md p-4" style={{ position: 'relative' }}>
                            <h5 className="font-bold mb-4">Nome da Consulta</h5>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange1}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                style={{
                                    marginBottom: '10px',
                                }}
                            />
                            {error && (
                                <div style={{
                                    marginTop: '15px',
                                    position: 'absolute',
                                    bottom: '-25px',
                                    left: '10px',  // Ajusta a posição para a esquerda
                                    width: '100%',
                                    textAlign: 'left',  // Alinhamento à esquerda
                                }}>
                                    <p style={{ 
                                        color: 'red',
                                        margin: 0,
                                        fontSize: '14px', 
                                    }}>
                                        {error}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        padding: '10px', 
                        position: 'absolute', 
                        bottom: '0', 
                        right: '0', 
                        boxSizing: 'border-box', 
                        backgroundColor: '#fff' 
                    }}>
                        <button
                            style={{
                                backgroundColor: '#6c757d',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#fff',
                                padding: '8px 20px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                marginRight: '10px',
                            }}
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            style={{
                                backgroundColor: '#007bff',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#fff',
                                padding: '8px 20px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                            onClick={saveQuery}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
            <ModalModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal} // Chama a função que fecha ambos os modais
                onConfirm={handleCloseSuccessModal} // Fecha ambos os modais ao confirmar
                message="Consulta salva com sucesso!"
                modalType="SUCESSO"
                confirmText="OK"
            />
        </>
    );
}

export default ModalSalvarCon;