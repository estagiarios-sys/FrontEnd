import React from "react";

function ModalSql({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    // Estilos para a div específica
    const contentContainerStyle = {
        width: '500px',
        height: '500px',	
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginTop: '20px', // mt-2 em Tailwind
    };

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
                    height: '500px', // Definindo a altura como 500px
                }}
            >
                <div className="w-full bg-neutral-500 flex flex-row justify-between text-white p-2">
                    <h5 className="font-bold mx-2">SQL</h5>
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
                <div style={contentContainerStyle}>
                    <div className="w-11/12 h-5/6 bg-neutral-300 rounded-md">
                        <h5 className="m-6">Select * FROM Clientes</h5>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalSql;
