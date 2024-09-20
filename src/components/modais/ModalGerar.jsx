import React, { useState, useEffect, useRef } from "react";
import { FaCaretDown } from "react-icons/fa";

function ModalGerar({ isOpen, onClose, tempoEstimado, onGenerateReport, onDownloadPDF }) {
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);
    const [isHoveredButtonExcluir, setIsHoveredButtonExcluir] = useState(false);
    const [isHoveredButtonCancelar, setIsHoveredButtonCancelar] = useState(false);
    const [isHoveredButtonCarregar, setIsHoveredButtonCarregar] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const dropdownRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
        mostrarOpcoes();
    };

    const contentContainerStyle = {
        width: '500px',
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        paddingBottom: '60px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        padding: '10px',
        position: 'absolute',
        bottom: '0',
        width: '100%',
        backgroundColor: '#fff',
        borderTop: '1px solid #ccc',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
        justifyContent: 'space-between',
    };

    const leftButtonContainerStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const rightButtonContainerStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const resetHoverStates = () => {
        setIsHoveredButtonX(false);
        setIsHoveredButtonExcluir(false);
        setIsHoveredButtonCancelar(false);
        setIsHoveredButtonCarregar(false);
    };

    const closeModal = () => {
        resetHoverStates();
        if (onClose) {
            onClose();
        }
    };

    const mostrarOpcoes = () => {
        setShowDropdown(prev => !prev); // Alterna o estado de visibilidade do dropdown
        setIsDropdownOpen(prev => !prev); // Alterna o ícone de seta para cima/baixo
    };

    const handleOptionClick = async (option) => {
        if (option === 'Gerar') {
            await onGenerateReport();
        } else if (option === 'Gerar e Baixar') {
            await onGenerateReport(); 
            await onDownloadPDF();
        }
        setShowDropdown(false); // Fecha o dropdown após clicar em uma opção
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

    useEffect(() => {
        if (tempoEstimado > 0) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prevProgress + (100 / (tempoEstimado / 1000));
                });
            }, 1000);

            setIntervalId(interval);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [tempoEstimado]);

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
                    height: '300px',
                }}
            >
                <div className="w-full bg-custom-azul-escuro flex flex-row justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">por enquanto carregamento</h5>
                    <button
                        className="font-bold mx-2"
                        style={{
                            borderRadius: '50px',
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
                        onClick={closeModal}
                    >
                        X
                    </button>
                </div>
                <div style={contentContainerStyle}>
                    <div className="w-11/12 bg-gray-200 bg-opacity-30 rounded-md p-4">
                        <p className="font-medium mb-4">
                            O tempo estimado para gerar o relatório é de {formatTime(tempoEstimado)}. Deseja realmente gerar?
                        </p>
                        <div style={{
                            width: '100%',
                            height: '10px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '5px',
                            overflow: 'hidden',
                            marginTop: '10px',
                        }}>
                            <div
                                style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    backgroundColor: '#0A7F8E',
                                    transition: 'width 0.5s ease',
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={buttonContainerStyle}>
                    <div style={leftButtonContainerStyle}>
                        <button
                            style={{
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#fff',
                                width: '80px',
                                height: '40px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                                backgroundColor: isHoveredButtonExcluir ? '#B11236' : '#ED1846',
                            }}
                            onMouseEnter={() => setIsHoveredButtonExcluir(true)}
                            onMouseLeave={() => setIsHoveredButtonExcluir(false)}
                            onClick={closeModal}
                        >
                            Excluir
                        </button>
                    </div>
                    <div style={rightButtonContainerStyle}>
                        <button
                            style={{
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#fff',
                                width: '80px',
                                height: '40px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                marginRight: '10px',
                                transition: 'background-color 0.3s ease',
                                backgroundColor: isHoveredButtonCancelar ? '#5a6268' : '#6c757d',
                            }}
                            onMouseEnter={() => setIsHoveredButtonCancelar(true)}
                            onMouseLeave={() => setIsHoveredButtonCancelar(false)}
                            onClick={closeModal}
                        >
                            Cancelar
                        </button>
                        <button
                            style={{
                                fontWeight: 'bold',
                                border: 'none',
                                borderRadius: '5px',
                                color: '#fff',
                                width: '120px',
                                height: '40px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                                backgroundColor: isHoveredButtonCarregar ? '#00AAB5' : '#0A7F8E',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center', // Centraliza o texto e o ícone
                                gap: '8px', // Espaçamento entre o texto e o ícone
                            }}
                            onMouseEnter={() => setIsHoveredButtonCarregar(true)}
                            onMouseLeave={() => setIsHoveredButtonCarregar(false)}
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
                            onClick={() => handleOptionClick('Gerar e Baixar')}
                        >
                            Gerar e Baixar
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}

export default ModalGerar;
