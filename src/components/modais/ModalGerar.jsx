import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

function ModalGerar({ isOpen, onClose, tempoEstimado, onGenerateReport }) {
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);
    const [isHoveredButtonExcluir, setIsHoveredButtonExcluir] = useState(false);
    const [isHoveredButtonCancelar, setIsHoveredButtonCancelar] = useState(false);
    const [isHoveredButtonCarregar, setIsHoveredButtonCarregar] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [progress, setProgress] = useState(0); // Estado para o progresso da barra
    const [intervalId, setIntervalId] = useState(null); // Estado para armazenar o ID do intervalo
    const dropdownRef = useRef(null);

    const contentContainerStyle = {
        width: '500px',
        height: '250px', // Ajustado para incluir a barra de carregamento
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

    const toggleDropdown = () => {
        setShowDropdown((prevState) => !prevState);
        setIsDropdownOpen(prev => !prev);
    };

    // const handleOptionClick = (option) => {
    //     console.log(option);
    //     setShowDropdown(false);
    // };

    const handleOptionClick = (option) => {
        if (option === 'Gerar') {
            onGenerateReport(); // Chama a função recebida como prop
        }
        setShowDropdown(false);
    };

    // Função para fechar o dropdown ao clicar fora
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
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
        // Se o tempo estimado é maior que 0, inicializa a barra de carregamento
        if (tempoEstimado > 0) {
            const interval = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prevProgress + (100 / (tempoEstimado / 1000)); // Incrementa baseado no tempo estimado
                });
            }, 1000); // Atualiza a cada segundo

            setIntervalId(interval);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [tempoEstimado]);

    const formatTime = (seconds) => {
        const totalSeconds = Math.floor(seconds); // Trunca os segundos para remover frações
    
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
                                width: '90px',
                                height: '40px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 10px',
                                transition: 'background-color 0.3s ease',
                                backgroundColor: isHoveredButtonCarregar ? '#00AAB5' : '#0A7F8E',
                            }}
                            onMouseEnter={() => setIsHoveredButtonCarregar(true)}
                            onMouseLeave={() => setIsHoveredButtonCarregar(false)}
                            onClick={toggleDropdown}
                        >
                            Opções
                            <FontAwesomeIcon
                                icon={faCaretDown}
                                style={{
                                    transition: 'transform 0.3s ease',
                                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                            />
                        </button>
                        {showDropdown && (
                            <div
                                ref={dropdownRef} // Adiciona a referência aqui
                                style={{
                                    position: 'absolute',
                                    bottom: '50px',
                                    right: '2px',
                                    backgroundColor: '#f8f9fa', // Cor de fundo mais clara para contraste
                                    border: '2px solid rgba(0, 105, 115, 0.4)', // Borda azul mais forte
                                    borderRadius: '5px',
                                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.4)', // Sombra mais pronunciada
                                    marginBottom: '15px',
                                    zIndex: 999,
                                    width: '150px', // Define uma largura fixa para o dropdown
                                }}
                            >
                                <button
                                    style={{
                                        fontWeight: '500',
                                        display: 'block',
                                        padding: '10px',
                                        width: '100%',
                                        fontSize: '13px',
                                        backgroundColor: '#f9f9f9',
                                        border: 'none',
                                        borderBottom: '1px solid #ddd',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        borderRadius: '5px 5px 0 0', // Bordas arredondadas no topo
                                        transition: 'background-color 0.3s ease',
                                    }}
                                    onClick={() => {
                                        console.log('Gerar: ', onGenerateReport); // Adicione o log aqui
                                        handleOptionClick('Gerar'); // Chame a função handleOptionClick
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eee'} // Hover
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'} // Hover
                                >
                                    Gerar
                                </button>
                                <button
                                    style={{
                                        fontWeight: '500',
                                        display: 'block',
                                        padding: '10px',
                                        width: '100%',
                                        fontSize: '13px',
                                        backgroundColor: '#f9f9f9',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        borderRadius: '0 0 5px 5px', // Bordas arredondadas na parte inferior
                                        transition: 'background-color 0.3s ease',
                                    }}
                                    onClick={() => handleOptionClick('Gerar e Baixar')}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eee'} // Hover
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'} // Hover
                                >
                                    Gerar e Baixar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalGerar;