import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";

function ModalGerar({ isOpen, onClose, tempoEstimado, onFetchData }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const dropdownRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);
    const [isCarregando, setIsCarregando] = useState(false); // Estado para controlar se o carregamento está ativo
    const [visivel, setVisivel] = useState(true);

    // Impedir scroll da página quando o modal está aberto
    useEffect(() => {
        const hasScroll = document.body.scrollHeight > window.innerHeight;
        setProgress(0); // Reseta o progresso ao abrir o modal

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

    const handleClick = () => {
        setIsClicked(!isClicked);
        mostrarOpcoes();
    };

    const closeModal = () => {
        setShowDropdown(false);
        setProgress(0); // Reseta o progresso ao fechar o modal
        setIsCarregando(false); // Garante que o carregamento não esteja ativo
        onClose();
    };

    const handleCancel = () => {
        setIsCarregando(false); // Desativa o estado de carregamento
        setProgress(0); // Reseta o progresso para 0
        setVisivel(true);
    };

    const mostrarOpcoes = () => {
        setShowDropdown(prev => !prev); // Alterna o estado de visibilidade do dropdown
        setIsDropdownOpen(prev => !prev); // Alterna o ícone de seta para cima/baixo
    };

    const handleOptionClick = async (option) => {
        if (isCarregando) return; // Não faz nada se já estiver carregando
        setIsCarregando(true); // Define que o carregamento está ativo
        setProgress(0); // Reseta o progresso ao iniciar o carregamento
        setVisivel(false);
        setShowDropdown(false); // Fecha o dropdown após clicar em uma opção

        const totalTime = tempoEstimado * 1000; // Converte o tempo estimado em milissegundos
        const intervalTime = 100; // Intervalo de tempo em milissegundos
        const steps = totalTime / intervalTime; // Número total de passos
        const progressIncrement = 100 / steps; // Quanto o progresso deve aumentar a cada intervalo

        // Função para atualizar o progresso
        const updateProgress = (currentProgress) => {
            if (currentProgress >= 100) return; // Para se já atingiu 100%

            setProgress((prev) => Math.min(prev + progressIncrement, 100)); // Aumenta o progresso
            setTimeout(() => updateProgress(currentProgress + progressIncrement), intervalTime); // Chama novamente após o intervalo
        };

        // Inicia a atualização do progresso após a operação
        updateProgress(0);

        // Realiza a operação com base na opção selecionada
        if (option === 'Gerar') {
            await onFetchData();
        } else if (option === 'Gerar e Baixar PDF') {
            await onFetchData('PDF');
        } else if (option === 'Gerar e Baixar CSV') {
            await onFetchData('CSV');
        }

        // Aguarda o tempo estimado antes de concluir o carregamento
        await new Promise((resolve) => setTimeout(resolve, totalTime));

        setProgress(100); // Define o progresso final como 100%
        setShowDropdown(false); // Fecha o dropdown após clicar em uma opção
        setIsCarregando(false); // Reset o estado de carregamento
        setVisivel(true);
        onClose();
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
            setIsDropdownOpen(false);
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
                {/* Cabeçalho */}
                <div className="w-full h-14 bg-[#0A7F8E] flex justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">Gerar Relatório</h5>
                    {visivel && (
                        <button
                            className="font-bold mx-2 w-8 h-8 flex justify-center items-center rounded-full hover:bg-[#0A7F8E] transition-colors duration-300"
                            onClick={onClose}
                            aria-label="Fechar modal"
                            title="Fechar"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    )}
                </div>
                <div class="w-[500px] h-[250px] flex flex-col items-center mt-3">
                    <div className="w-11/12 bg-gray-200 bg-opacity-30 rounded-md p-4 relative">
                        <p className="font-medium mb-4">
                            O tempo estimado para gerar o relatório é de {formatTime(tempoEstimado)}. Deseja realmente gerar?
                        </p>
                        {/* Barra de progresso */}
                        <div class="relative w-full h-[20px] bg-gray-300 rounded overflow-hidden mt-2.5">
                            {/* Porcentagem sobre a barra */}
                            <span class={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12px] font-bold ${progress > 50 ? 'text-white' : 'text-black'} z-10`}>
                                {`${Math.floor(progress)}%`}
                            </span>
                            {/* Barra de progresso */}
                            <div className={`h-full bg-[#0A7F8E] transition-width duration-500 ease-in-out`} style={{ width: `${progress}%` }}>
                            </div>
                        </div>
                        {isCarregando && (
                            <div class="flex justify-center mt-2.5">
                                <button
                                    onClick={handleCancel}
                                    className="font-bold text-white rounded-lg w-20 h-10 text-sm cursor-pointer bg-custom-vermelho hover:bg-custom-vermelho-escuro transition-colors duration-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {visivel && (
                    <div class="rounded-b-lg flex p-2 absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-between">
                        <div className="ml-auto flex items-center">
                            <button
                                className="font-bold text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer mr-2 flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-300"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="font-bold border-none text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer flex items-center justify-center bg-custom-azul hover:bg-custom-azul-escuro transition-colors duration-300"
                                onClick={handleClick}
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
                )}
                {showDropdown && (
                    <div
                        ref={dropdownRef}
                        style={{
                            position: 'absolute',
                            bottom: '60px',
                            right: '20px',
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                        }}
                    >
                        <button
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                            onClick={() => handleOptionClick('Gerar')}
                        >
                            Gerar
                        </button>
                        <button
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                            onClick={() => handleOptionClick('Gerar e Baixar PDF')}
                        >
                            Gerar e Baixar PDF
                        </button>
                        <button
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#f8f9fa',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                            }}
                            onClick={() => handleOptionClick('Gerar e Baixar CSV')}
                        >
                            Gerar e Baixar CSV
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ModalGerar;