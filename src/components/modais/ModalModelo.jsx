import React, { useState, useMemo } from "react";
import Select from 'react-select';
import ModalModal from './ModalModal';
import { FaEraser } from 'react-icons/fa'; // Importa o ícone de apagador

function ModalModelo({ isOpen, onClose }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isConfirmModalOpen, setIsModalModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isCleaning, setIsCleaning] = useState(false); // Estado para animação de limpeza
    const models = useMemo(() => [
        { value: "Modelo 1", label: "Modelo 1" },
        { value: "Modelo 2", label: "Modelo 2" },
        { value: "Modelo 3", label: "Modelo 3" },
        { value: "Modelo 4", label: "Modelo 4" },
        { value: "Modelo 5", label: "Modelo 5" },
        { value: "Systextil", label: "Systextil" }
    ], []);

    const handleLimpar = () => {
        setIsCleaning(true); // Ativa a animação de limpeza
        setTimeout(() => {
            setSelectedItem(null); // Limpa a seleção após a animação
            setIsCleaning(false); // Desativa a animação de limpeza
        }, 500); // Duração da animação
    };

    const handleApagar = () => {
        setModalMessage('Você tem certeza de que deseja apagar este item?');
        setIsModalModalOpen(true);
    };

    const handleConfirm = () => {
        setSelectedItem(null);
        setIsModalModalOpen(false); // Fecha o modal de confirmação
    };

    if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg relative w-[440px] max-w-full shadow-lg">
                    <div className="w-full bg-green-600 flex justify-between items-center text-white p-3 rounded-t-lg">
                        <h5 className="font-bold text-lg">Modelos de Relatórios</h5>
                        <button
                            className="bg-white text-black border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-xl cursor-pointer"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="mt-4 mx-3 flex items-center">
                        <Select
                            value={selectedItem}
                            onChange={setSelectedItem}
                            options={models}
                            placeholder="Selecione um modelo"
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '100%',
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    height: 40,
                                    borderColor: '#d1d5db',
                                    boxShadow: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        borderColor: '#2563eb',
                                    }
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    maxHeight: 85,
                                    borderRadius: '8px',
                                    border: '1px solid #d1d5db',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                }),
                                menuList: (provided) => ({
                                    ...provided,
                                    padding: 0,
                                    maxHeight: 85,
                                    overflowY: 'auto',
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected ? '#2563eb' : 'white',
                                    color: state.isSelected ? 'white' : 'black',
                                    '&:hover': {
                                        backgroundColor: '#e2e8f0',
                                    }
                                }),
                            }}
                        />
                        <button
                            className={`ml-4 p-2 rounded-full transition-transform ${isCleaning ? 'animate-clean' : ''}`}
                            onClick={handleLimpar}
                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            <FaEraser size={24} color={isCleaning ? '#ff6347' : '#000'} />
                        </button>
                    </div>
                    <div className="flex justify-end space-x-2 p-4 mt-4">
                        <button
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 w-20"
                            onClick={handleApagar}
                        >
                            Excluir
                        </button>
                        <button
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-20"
                            onClick={() => alert('Abrir clicado')}
                        >
                            Abrir
                        </button>
                    </div>
                </div>
            </div>
            <ModalModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsModalModalOpen(false)}
                onConfirm={handleConfirm}
                confirmText="Excluir"
                message={modalMessage}
                title="Confirmação"
                buttonColors={{
                    confirm: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
                    cancel: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-600",
                }}
            />
        </>
    );
}

export default ModalModelo;
