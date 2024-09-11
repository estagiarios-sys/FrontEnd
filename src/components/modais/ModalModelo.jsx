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
    const [isHoveredButtonExcluir, setIsHoveredButtonExcluir] = useState(false);
    const [isHoveredButtonCarregar, setIsHoveredButtonCarregar] = useState(false);


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

        setError(''); // Limpa a mensagem de erro, se houver
    }, [isOpen]);

    const resetHoverStates = () => {
        setIsHoveredButtonX(false);
    };

    const handleClose = () => {
        resetHoverStates();
        onClose();
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
            onClose(); // Fecha o modal
        } else {
            setError('Selecione um modelo para aplicar'); // Define a mensagem de erro
        }
        
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
                            style={{
                                fontWeight: 'bold',
                                backgroundColor: '#ED1846',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#fff',
                                width: '80px',
                                height: '40px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                transition: 'background-color 0.3s ease',
                                backgroundColor: isHoveredButtonExcluir ? '#B11236' : '#ED1846'
                            }}
                            onMouseEnter={() => setIsHoveredButtonExcluir(true)}
                            onMouseLeave={() => setIsHoveredButtonExcluir(false)}
                            onClick={handleApagar}
                        >
                            Excluir
                        </button>
                        <button
                            style={{
                                fontWeight: 'bold',
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
                            onClick={handleUseModel}  // Chama a função para usar o modelo selecionado
                        >
                            Aplicar
                        </button>
                    </div>
                </div>
            </div>
            <ModalModal
                modalType="APAGAR"
                isOpen={isConfirmModalOpen}
                onClose={() => setIsModalModalOpen(false)}
                onConfirm={handleConfirm}
                confirmText="Excluir"
                message={modalMessage}
                title="Confirmação"
            />
        </>
    );
}

export default ModalModelo;
