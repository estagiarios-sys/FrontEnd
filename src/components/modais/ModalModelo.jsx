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
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);


    // Função para obter as chaves do localStorage e formatar para o Select
    const loadModels = () => {
        const keys = Object.keys(localStorage).filter(key => key !== 'orderByString');
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
            onSelect(selectedItem.value);
            setModalMessage('Modelo gerado com sucesso');
            setIsModalModalOpen(true);  // Passa a key selecionada para o componente pai
            onClose(); // Fecha o modal
        } else {
            setModalMessage('Selecione um Modelo para Salvar');
            setIsModalModalOpen(true);

        }

        setError('');
    };

    if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-1000">
                <div className="bg-white  relative w-[440px] max-w-full shadow-lg">
                    <div className="w-full bg-custom-azul-escuro flex justify-between items-center text-white p-3 ">
                        <h5 className="font-bold text-lg">MODELOS DE RELATÓRIOS</h5>
                        <button
                            className="font-bold mx-2"
                            onClick={onClose}
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
                                zIndex: 1001,
                                transition: 'background-color 0.3s ease',
                                backgroundColor: isHoveredButtonX ? '#00AAB5' : '#0A7F8E',
                            }}
                            onMouseEnter={() => setIsHoveredButtonX(true)}
                            onMouseLeave={() => setIsHoveredButtonX(false)}
                        >
                            X
                        </button>
                    </div>
                    <div className="mt-4 mx-3 flex items-center">
                        <Select
                            value={selectedItem}
                            onChange={setSelectedItem}
                            options={models} // Use as opções carregadas do localStorage
                            placeholder="Selecione um modelo"
                            className="basic-single w-full"
                            classNamePrefix="Select"
                            isClearable
                        />

                        {/* caso voce seja estanho pode usar esse button que é muito feio
                         <button
                            className={`ml-4 p-2 rounded-full transition-transform ${isCleaning ? 'animate-clean' : ''}`}
                            onClick={handleLimpar}
                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                            <FaEraser size={24} color={isCleaning ? '#00AAB5' : '#0A7F8E'} />
                        </button> */}
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm mt-2 mx-3">{error}</p> // Exibe a mensagem de erro
                    )}
                    <div className="flex justify-end space-x-2 p-4 mt-4">
                        <button
                            className="bg-custom-vermelho text-white font-  rounded-[5px] hover:bg-custom-vermelho-escuro focus:outline-none focus:ring-2 focus:ring-custom-vermelho w-[60px] h-[30px] text-tiny"
                            onClick={handleApagar}
                        >
                            Excluir
                        </button>
                        <button
                            className="bg-custom-azul-escuro text-white font-  rounded-[5px] hover:bg-custom-azul focus:outline-none focus:ring-2 focus:ring-custom-azu-escuro w-[60px] h-[30px] text-tiny"
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
                confirmText="OK"
                message={modalMessage}
                title="Confirmação"
            />
        </>
    );
}

export default ModalModelo;
