import React, { useState, useEffect } from "react";

function ModalSql({ isOpen, onClose }) {
    // O isHoveredButtonX não esta sendo utilizado, mas precisa ser declarado para funcionar o hover no botão de fechar
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Função para resetar hover e fechar o modal
    const handleClose = () => {
        setIsHoveredButtonX(false);
        onClose();
    };

    // Função para copiar o SQL gerado para a área de transferência
    const handleCopy = () => {
        navigator.clipboard.writeText(SQL)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 4000); // Volta ao estado original após 4 segundos
            })
            .catch((err) => console.error("Falha ao copiar: ", err));
    };

    // Efeito para impedir o scroll da página quando o modal está aberto
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => document.body.style.overflow = 'auto';
    }, [isOpen]);

    if (!isOpen) return null;

    const SQL = localStorage.getItem('SQLGeradoFinal');

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
            <div className="bg-white p-0 rounded-[5px] relative w-[500px] h-[500px]">
                <div className="w-full bg-custom-azul-escuro flex flex-row justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">SQL</h5>
                    <button
                        className="font-bold mx-2 rounded-full cursor-pointer w-[30px] h-[30px] flex justify-center items-center text-[16px] transition-colors duration-300 ease-in bg-[--azul-claro] hover:bg-[--azul]"
                        onClick={handleClose}
                        onMouseEnter={() => setIsHoveredButtonX(true)}
                        onMouseLeave={() => setIsHoveredButtonX(false)}
                    >
                        X
                    </button>
                </div>
                <div className="w-[500px] h-[500px] flex flex-row justify-center items-start mt-5 relative">
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
