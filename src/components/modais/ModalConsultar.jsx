import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import ModalAlert from "./ModalAlert";
import Loading from "../genericos/Loading";

function ModalConsultar({ isOpen, onClose, tempoEstimado, onFetchData }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleConfirmar = () => {
        setModal({ isOpen: false, type: '', message: '' });
        onClose();
    };

    // Impedir scroll da página quando o modal está aberto
    useEffect(() => {
        const hasScroll = document.body.scrollHeight > window.innerHeight;

        if (isOpen) {
            if (hasScroll) {
                document.body.style.paddingRight = "6px"; // Adiciona padding
            }
            document.body.style.overflow = "hidden"; // Desativa o scroll
        } else {
            document.body.style.overflow = ""; // Restaura o scroll
            document.body.style.paddingRight = ""; // Remove o padding
        }

        return () => {
            document.body.style.overflow = ""; // Limpeza no fechamento
            document.body.style.paddingRight = ""; // Limpeza no fechamento
        };
    }, [isOpen]);

    const closeModal = () => {
        setShowDropdown(false);
        onClose();
    };

    const mostrarOpcoes = () => {
        setShowDropdown(prev => !prev); // Alterna o estado de visibilidade do dropdown
        setIsClicked(prev => !prev); // Alterna o estado de clique
    };

    const handleOptionClick = async (option) => {
        setShowDropdown(false); // Fecha o dropdown após clicar em uma opção

        try {
            if (option === 'Buscar dados') {
                setLoading(true); // Ativa o estado de carregamento
                await onFetchData();
                setLoading(false); // Desativa o estado de carregamento
                setModal({ isOpen: true, type: 'SUCESSO', message: 'Relatório gerado com sucesso!' });
            } else if (option === 'Baixar PDF') {
                setModal({ isOpen: true, type: 'SUCESSO', message: 'O PDF está sendo gerado, quando finalizar você será notificado.' });
                await onFetchData('PDF');
            } else if (option === 'Baixar CSV') {
                await onFetchData('CSV');
                setModal({ isOpen: true, type: 'SUCESSO', message: 'CSV gerado com sucesso!' });
            }
        } catch (error) {
            console.error('Erro ao processar a opção:', error);
            setModal({ isOpen: true, type: 'ALERTA', message: 'Erro ao processar a consulta. Por favor, tente novamente.' });
        } finally {
            setLoading(false); // Garante que o estado de carregamento seja desativado em caso de erro
        }
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
            setIsClicked(false);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const formatTime = (seconds) => {
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        const formatNumber = (num) => String(num).padStart(2, '0');
        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(secs)}`;
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg relative w-[500px] h-[250px]">
                {loading && <Loading />}
                {/* Cabeçalho */}
                <div className="w-full bg-custom-azul-escuro flex justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">CONSULTAR DADOS</h5>
                    <button
                        className="font-bold text-lg rounded-full w-8 h-8 flex justify-center items-center bg-[#0A7F8E] hover:bg-[#00AAB5] transition-colors duration-300"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="flex flex-col items-center mt-3">
                    <div className="w-11/12 bg-gray-200 bg-opacity-30 rounded-md p-4 relative">
                        <p className="font-medium mb-4">
                            O tempo estimado para a consulta é de {formatTime(tempoEstimado)}. Escolha uma das opções:
                        </p>
                    </div>
                </div>
                <div className="rounded-b-lg flex p-2 absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-between">
                    <div className="ml-auto flex items-center">
                        <button
                            className="font-bold text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer mr-2 flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-300"
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            className="font-bold border-none text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer flex items-center justify-center bg-custom-azul hover:bg-custom-azul-escuro transition-colors duration-300"
                            onClick={mostrarOpcoes}
                        >
                            Opções
                            <FaCaretDown
                                style={{
                                    transition: 'transform 0.3s ease',
                                    transform: isClicked ? 'rotate(180deg)' : 'rotate(0deg)',
                                }}
                            />
                        </button>
                    </div>
                </div>
                {showDropdown && (
                    <div
                        ref={dropdownRef}
                        className="absolute bottom-[60px] right-[10px] bg-white border border-gray-300 rounded-lg shadow-lg z-[1000] overflow-hidden"
                    >
                        {['Buscar dados', 'Baixar PDF', 'Baixar CSV'].map((option) => (
                            <button
                                key={option}
                                className="block w-full px-3 py-2 bg-gray-100 text-left text-sm text-gray-800 cursor-pointer transition-colors duration-200"
                                onClick={() => handleOptionClick(option)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 105, 115, 0.15)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <ModalAlert
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmar}
                modalType={modal.type || 'ALERTA'} // Use um valor padrão se modal.type estiver vazio
                message={modal.message}
            />
        </div>
    );
}

export default ModalConsultar;