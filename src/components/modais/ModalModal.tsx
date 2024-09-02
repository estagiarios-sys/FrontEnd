import React, { useState, ChangeEvent } from "react";

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: (inputValue?: string) => void;
    message?: string;
    modalType?: "APAGAR" | "ALERTA" | "DIGITAR_NOME";
    onNameChange?: (value: string) => void; // Adicionando prop onNameChange
}

const modalTypes: Record<string, { title: string; confirmText: string; cancelText: string | null; isAlert: boolean }> = {
    APAGAR: {
        title: "Confirmar Exclusão",
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        isAlert: false,
    },
    ALERTA: {
        title: "Atenção",
        confirmText: "Sim",
        cancelText: null, // Sem botão de cancelar
        isAlert: true,
    },
    DIGITAR_NOME: {
        title: "Salvar Template",
        confirmText: "Confirmar",
        cancelText: "Cancelar",
        isAlert: false,
    },
};

const ModalModal: React.FC<ModalProps> = ({ 
    isOpen = false, 
    onClose = () => {}, 
    onConfirm = () => {}, 
    message = "", 
    modalType = "ALERTA", 
    onNameChange = () => {} // Função padrão para evitar erros
}) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const { title, confirmText, cancelText, isAlert } = modalTypes[modalType] || modalTypes.ALERTA;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onNameChange(e.target.value); // Chama onNameChange quando o input muda
    };

    const handleConfirm = () => {
        if (modalType === "DIGITAR_NOME" && !inputValue.trim()) {
            setError("O nome não pode estar vazio.");
            return; // Não fecha o modal
        }
        setError(null); // Limpa a mensagem de erro
        onConfirm(inputValue); 
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[440px] h-auto max-w-full">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                    <h5 className="text-lg font-semibold text-gray-800">{title}</h5>
                    <button
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 font-bold">{message}</p>
                    {modalType === "DIGITAR_NOME" && (
                        <>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleInputChange}
                                placeholder="Digite um nome"
                                className="w-full p-2 border border-black rounded"
                            />
                            {error && (
                                <p className="text-red-500 text-sm mt-2">{error}</p>
                            )}
                        </>
                    )}
                </div>
                <div className="flex justify-end space-x-2">
                    {!isAlert && (
                        <>
                            <button
                                className="text-white font-semibold py-2 px-4 rounded-lg bg-green-600 hover:bg-green-700 focus:ring-green-500"
                                onClick={handleConfirm}
                            >
                                {confirmText}
                            </button>
                            {cancelText && (
                                <button
                                    className="text-white font-semibold py-2 px-4 rounded-lg bg-gray-500 hover:bg-gray-600 focus:ring-gray-500"
                                    onClick={onClose}
                                >
                                    {cancelText}
                                </button>
                            )}
                        </>
                    )}
                    {isAlert && (
                        <button
                            className="text-white font-semibold py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 focus:ring-red-500"
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalModal;
