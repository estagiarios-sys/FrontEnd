import React, { useState, useEffect } from "react";

function ModalSql({ isOpen, onClose }) {
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Função para resetar os estados de hover
    const resetHoverStates = () => {
        setIsHoveredButtonX(false);
    };

    // Função para fechar o modal
    const handleClose = () => {
        resetHoverStates();
        onClose();
    };

    // Função para copiar o SQL gerado para a área de transferência
    const handleCopy = () => {
        navigator.clipboard.writeText(SQL)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false); // Volta ao estado original após 3 segundos
                }, 4000);
            })
            .catch((err) => {
                console.error("Falha ao copiar: ", err);
            });
    };

    // Efeito para impedir o scroll da página quando o modal está aberto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Impede o scroll da página
        } else {
            document.body.style.overflow = 'auto'; // Permite o scroll da página
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Se o modal não estiver aberto, retorna null
    if (!isOpen) return null;

    // Estilos para a div que contém o conteúdo do modal
    const contentContainerStyle = {
        width: '500px',
        height: '500px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: '20px',
        position: 'relative',
    };

    const SQL = localStorage.getItem('SQLGeradoFinal');

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
                    height: '500px',
                }}
            >
                <div className="w-full bg-custom-azul-escuro flex flex-row justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">SQL</h5>
                    <button
                        className="font-bold mx-2"
                        onClick={handleClose}
                        style={{
                            borderRadius: '50px',
                            cursor: 'pointer',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '16px',
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonX ? '#00AAB5' : '#0A7F8E',
                        }}
                        onMouseEnter={() => setIsHoveredButtonX(true)}
                        onMouseLeave={() => setIsHoveredButtonX(false)}
                    >
                        X
                    </button>
                </div>
                <div style={contentContainerStyle}>
                    <div className="w-11/12 h-5/6 bg-gray-200 bg-opacity-30 rounded-md">
                        <h5 className="m-6">{SQL}</h5>
                    </div>
                    <div className="absolute bottom-20 right-3 mt-4">
                        <button
                            onClick={handleCopy}
                            className={`${isCopied ? "bg-white text-custom-azul-escuro border-custom-azul-escuro border" : "bg-custom-azul-escuro hover:bg-custom-azul text-white"
                                } font-bold py-1 px-2 rounded flex items-center`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={`${isCopied ? "text-custom-azul-escuro" : "text-white"} w-6 h-6 mr-2`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                />
                            </svg>
                            {isCopied ? "Copiado!" : "Copiar SQL"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalSql;
