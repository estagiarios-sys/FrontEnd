import React from "react";

function ModalModal({ isOpen, onClose, onConfirm, confirmText = "Confirmar", message, title = "Atenção", buttonColors = {} }) {
    if (!isOpen) return null; // Se o modal não estiver aberto, não renderiza nada.

    // Define as classes de cor padrão para os botões
    const defaultButtonColors = {
        confirm: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
        cancel: "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500",
    };

    // Mescla as cores fornecidas com as cores padrão
    const buttonStyles = {
        confirm: buttonColors.confirm || defaultButtonColors.confirm,
        cancel: buttonColors.cancel || defaultButtonColors.cancel,
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[440px] h-auto max-w-full">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                    <h5 className="text-lg font-semibold text-gray-800">{title}</h5> {/* Título do modal */}
                    <button
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
                        onClick={onClose} // Fecha o modal quando clicado
                    >
                        &times;
                    </button>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700">{message}</p> {/* Mensagem do modal */}
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        className={`text-white font-semibold py-2 px-4 rounded-lg ${buttonStyles.confirm}`}
                        onClick={() => {
                            if (onConfirm) onConfirm(); // Executa a função de confirmação, se fornecida
                            onClose(); // Fecha o modal
                        }}
                    >
                        {confirmText} {/* Texto do botão de confirmação */}
                    </button>
                    <button
                        className={`text-white font-semibold py-2 px-4 rounded-lg ${buttonStyles.cancel}`}
                        onClick={onClose} // Fecha o modal quando clicado
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalModal;