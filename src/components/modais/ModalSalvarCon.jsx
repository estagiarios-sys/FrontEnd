import React, { useEffect, useState } from "react";

function ModalSalvarCon({ isOpen, onClose, sqlQuery }) {
    const [inputValue, setInputValue] = useState(''); // Estado para armazenar o valor do input

    const handleInputChange1 = (event) => {
        setInputValue(event.target.value); // Atualiza o estado com o valor digitado para key1
    };

    const saveQuery = async () => {
        try {
            const dataToSave = {
                queryName: inputValue, // Usa o valor do input para key1
                query: sqlQuery, // Usa o JSON convertido para key2
            };

            console.log(sqlQuery);

            const query = JSON.stringify(dataToSave);

            console.log(query);

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

    // Se o modal não estiver aberto, não renderize nada
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
                <div style={contentContainerStyle}>
            <div className="w-11/12 bg-neutral-300 rounded-md p-4">
                <h5 className="font-bold mb-4">Nome da Consulta</h5>
                <input
                    type="text"
                    value={inputValue}
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
                        onClick={onClose}
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
        </div>
    );
}

export default ModalSalvarCon;