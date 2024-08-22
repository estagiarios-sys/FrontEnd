import React from "react";
import {generatePDF} from "../PDF/pdfGenerate";

function ModalExpo({ isOpen, onClose }) {
    if (!isOpen) return null;

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
                    width: '400px',
                    height: '150px', // Definindo a altura como 500px
                }}
            >
                <div className="w-full bg-neutral-500 flex flex-row justify-between text-white p-2">
                    <h5 className="font-bold mx-2">Exportar Arquivo</h5>
                    <button
                        className="font-bold mx-2"
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '6px',
                            right: '1px',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Fundo semi-transparente
                            border: '1px solid #ccc', // Borda cinza clara
                            borderRadius: '5px', // Forma arredondada
                            width: '60px', // Largura do botão
                            height: '30px', // Altura do botão
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '16px',
                            cursor: 'pointer',
                            zIndex: 1001, // Garantindo que o botão esteja sobre o conteúdo
                        }}
                    >
                        X
                    </button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '20px', // Espaçamento superior
                        gap: '60px', // Espaçamento entre os botões
                    }}
                >
                    <button onClick={generatePDF}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '5px',
                            padding: '10px',
                            cursor: 'pointer',
                            border: 'none',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-file"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span>Baixar PDF</span>
                    </button>


                    <button 
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '5px',
                            padding: '10px',
                            cursor: 'pointer',
                            border: 'none',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-download"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>Baixar SVG</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalExpo;
