import React, { useState } from "react";
import ModalAlert from './ModalAlert';
import { getTotalizers } from "../CamposSelecionados";

function ModalSalvarCon({ isOpen, onClose, sqlQuery, sql2, img, titlePdf }) {
    const [inputValue, setInputValue] = useState('');
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });
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
                        onClick={onClose}
                        style={{
                            borderRadius: '50px',
                            hover: 'pointer',
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
                <div style={{ width: '500px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', paddingBottom: '60px' }}>
                    <div className="w-11/12 bg-gray-200 bg-opacity-30 rounded-md p-4">
                        <h5 className="font-medium mb-4">Nome da Consulta</h5>
                        <input
                            type="text"
                            onChange={handleInputChange1}
                            className="w-full border border-custom-azul-escuro rounded p-1 focus:ring-1 focus:ring-custom-azul-escuro focus:outline-none"
                        />
                    </div>
                </div>
                <div style={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'flex-end', padding: '10px', position: 'absolute', bottom: '0', right: '0', boxSizing: 'border-box' }}>
                    <button
                        style={{
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            width: '80px',
                            height: '40px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginRight: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isHoveredButtonCancelar ? '#5a6268' : '#6c757d'
                        }}
                        onMouseEnter={() => setIsHoveredButtonCancelar(true)}
                        onMouseLeave={() => setIsHoveredButtonCancelar(false)}
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        style={{
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            width: '80px',
                            height: '40px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
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
        </div>
    );
}

export default ModalSalvarCon;
