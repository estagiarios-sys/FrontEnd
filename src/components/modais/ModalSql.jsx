import React, { useState } from "react";

function ModalSql({ isOpen, onClose }) {
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);

    const resetHoverStates = () => {
        setIsHoveredButtonX(false);
    };

    const handleClose = () => {
        resetHoverStates();
        onClose();
    };

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
                            zIndex: 1001,
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
                </div>
            </div>
        </div>
    );
}

export default ModalSql;
