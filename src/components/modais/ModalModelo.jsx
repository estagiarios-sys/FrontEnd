import React, { useState, useEffect } from "react";
import Select from 'react-select';
import ModalModal from './ModalModal';
import { FaEraser } from 'react-icons/fa'; // Importa o ícone de apagador

function ModalModelo({ isOpen, onClose, onSelect }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isConfirmModalOpen, setIsModalModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isCleaning, setIsCleaning] = useState(false); // Estado para animação de limpeza
    const [models, setModels] = useState([]);
    const [error, setError] = useState(''); // Estado para mensagem de erro

    // Função para obter as chaves do localStorage e formatar para o Select
    const loadModels = () => {
        const keys = Object.keys(localStorage); 
        const modelOptions = keys.map((key) => ({
            value: key,
            label: key,
        }));
        setModels(modelOptions);
    };

    useEffect(() => {
        if (isOpen) {
            loadModels(); // Carrega as opções do modelo quando o modal é aberto
        }
    }, [isOpen]);

    const handleLimpar = () => {
        setIsCleaning(true); // Ativa a animação de limpeza
        setTimeout(() => {
            setSelectedItem(null); // Limpa a seleção após a animação
            setIsCleaning(false); // Desativa a animação de limpeza
        }, 500); // Duração da animação
    };

    const handleApagar = () => {
        if (!selectedItem) {
            setError('Não há nada selecionado'); // Define a mensagem de erro
            return;
        }
        setModalMessage('Você tem certeza de que deseja apagar este item?');
        setIsModalModalOpen(true);
        setError(''); // Limpa a mensagem de erro, se houver
    };

    const handleConfirm = () => {
        if (selectedItem) {
            localStorage.removeItem(selectedItem.value); // Remove o item do localStorage
            loadModels(); // Recarrega os modelos após a exclusão
            setSelectedItem(null); // Limpa a seleção
        }
        setIsModalModalOpen(false); // Fecha o modal de confirmação
    };

    const handleUseModel = () => {
        if (selectedItem) {
            onSelect(selectedItem.value);  // Passa a key selecionada para o componente pai
            onClose(); // Fecha o modal
        }
    };

    if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg relative w-[440px] max-w-full shadow-lg">
                    <div className="w-full bg-green-600 flex justify-between items-center text-white p-3 rounded-t-lg">
                        <h5 className="font-bold text-lg">Modelos de Relatórios</h5>
                        <button
                            className=" text-black rounded-full w-8 h-8 flex items-center justify-center text-xl cursor-pointer"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>
                    <div className="mt-4 mx-3 flex items-center">
                        <Select
                            value={selectedItem}
                            onChange={setSelectedItem}
                            options={models} // Use as opções carregadas do localStorage
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
                    {error && (
                        <p className="text-red-500 text-sm mt-2 mx-3">{error}</p> // Exibe a mensagem de erro
                    )}
                    <div className="flex justify-end space-x-2 p-4 mt-4">
                        <button
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 w-20"
                            onClick={handleApagar}
                        >
                            Excluir
                        </button>
                        <button
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-20 flex flex-col justify-center items-center"
                            onClick={handleUseModel}  // Chama a função para usar o modelo selecionado
                        >
                            Usar
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
