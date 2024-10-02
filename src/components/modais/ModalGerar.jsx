import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";
import ModalAlert from "./ModalAlert";
import Loading from "../genericos/Loading";

function ModalGerar({ isOpen, onClose, tempoEstimado, onFetchData }) {
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

        // Realiza a operação com base na opção selecionada
        if (option === 'Buscar dados') {
            setLoading(true); // Ativa o estado de carregamento
            await onFetchData();
            setLoading(false); // Desativa o estado de carregamento
            setModal({ isOpen: true, type: 'SUCESSO', message: 'Relatório gerado com sucesso!' });
        } else if (option === 'Baixar PDF') {
            setModal({ isOpen: true, type: 'ALERTA', message: 'O PDF está sendo gerado, quando finalizar você será notificado.' });
            await onFetchData('PDF');
        } else if (option === 'Baixar CSV') {
            await onFetchData('CSV');
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
                <div className="w-full h-14 bg-[#0A7F8E] flex justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">CONSULTAR DADOS</h5>
                    <button
                        className="font-bold mx-2 w-8 h-8 flex justify-center items-center rounded-full hover:bg-[#0A7F8E] transition-colors duration-300"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="w-[500px] h-[250px] flex flex-col items-center mt-3">
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
                        style={{
                            position: 'absolute',
                            bottom: '60px',
                            right: '10px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                            zIndex: 1000,
                            overflow: 'hidden',
                        }}
                    >
                        {['Buscar dados', 'Baixar PDF', 'Baixar CSV'].map((option) => (
                            <button
                                key={option}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '8px 12px',
                                    backgroundColor: '#f8f9fa',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '14px',
                                    color: '#333',
                                    transition: 'background-color 0.2s ease',
                                }}
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
            <ModalAlert isOpen={modal.isOpen} onClose={() => setModal(prev => ({ ...prev, isOpen: false }))} onConfirm={handleConfirmar} modalType={modal.type} message={modal.message} />
        </div>
    );
}

export default ModalGerar;