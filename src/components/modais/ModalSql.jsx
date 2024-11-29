import React, { useState, useEffect } from "react";
import { RemoveScroll } from "react-remove-scroll";

function ModalSql({ isOpen, onClose, sqlGeral, sqlTotalizers }) {
    const [isCopied, setIsCopied] = useState(false);

    const sqlCopy = 'Consulta Geral: ' + sqlGeral + '\n\nConsulta com Totalizers: ' + sqlTotalizers;

    // Copiar o SQL gerado para a área de transferência
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(sqlCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 4000); // Reseta após 4 segundos
        } catch (err) {
            console.error("Falha ao copiar: ", err);
        }
    };

    if (!isOpen) return null;

    return (
        <RemoveScroll enabled={isOpen}> {/* Wrap the modal content with RemoveScroll */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg relative w-[500px] h-[500px] flex flex-col">
                    <div className="w-full bg-custom-azul-escuro flex justify-between items-center text-white p-2">
                        <h5 className="font-bold mx-2">SQL</h5>
                        <button
                            className="font-bold text-lg rounded-full w-8 h-8 flex justify-center items-center bg-[#0A7F8E] hover:bg-[#00AAB5] transition-colors duration-300"
                            onClick={onClose}
                            aria-label="Fechar modal"
                            title="Fechar"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="w-full h-[370px] flex flex-col justify-center items-center mt-4 relative overflow-auto">
                        <div className="w-11/12 h-full bg-gray-200 bg-opacity-30 rounded-md p-4 overflow-auto">
                            <p>Consulta Geral: {sqlGeral}</p>
                            <br />
                            <p>Consulta com Totalizers: {sqlTotalizers}</p>
                        </div>
                    </div>
                    {/* Rodapé com botão */}
                    <div className="flex p-2 rounded-b-lg w-full bg-white border-t border-gray-300 shadow-md justify-end mt-auto">
                        <button
                            onClick={handleCopy}
                            className={`font-bold py-1 px-2 rounded flex items-center transition-colors duration-300 ${isCopied
                                ? "bg-white text-custom-azul-escuro border border-custom-azul-escuro"
                                : "bg-custom-azul text-white hover:bg-custom-azul-escuro"
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={`w-6 h-6 mr-2 ${isCopied ? "text-custom-azul-escuro" : "text-white"
                                    }`}
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
        </RemoveScroll>
    );
}

export default ModalSql;