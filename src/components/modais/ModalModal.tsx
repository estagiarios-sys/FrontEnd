import React, { useState, ChangeEvent } from "react";

interface ModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    message?: string;
    modalType?: "APAGAR" | "ALERTA" | "DIGITAR_NOME" | "SUCESSO";
    onNameChange?: (value: string) => void;
    confirmText?: string;  // Nova propriedade opcional para o texto do botão de confirmação
}

const modalTypes: Record<string, { title: string; defaultConfirmText: string; cancelText: string | null; isAlert: boolean }> = {
    APAGAR: {
        title: "Confirmar Exclusão",
        defaultConfirmText: "Confirmar",
        cancelText: "Cancelar",
        isAlert: false,
    },
    ALERTA: {
        title: "Atenção",
        defaultConfirmText: "Sim",
        cancelText: null,
        isAlert: true,
    },
    DIGITAR_NOME: {
        title: "Salvar Template",
        defaultConfirmText: "Confirmar",
        cancelText: "Cancelar",
        isAlert: false,
    },
    SUCESSO: {
        title: "Sucesso",
        defaultConfirmText: "OK",
        cancelText: null,
        isAlert: true,
    },
};

const ModalModal: React.FC<ModalProps> = ({
    isOpen = false,
    onClose = () => {},
    onConfirm = () => {},
    message = "",
    modalType = "ALERTA",
    onNameChange = () => {},
    confirmText // Agora pode receber o texto do botão diretamente
}) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const { title, defaultConfirmText, cancelText, isAlert } = modalTypes[modalType] || modalTypes.ALERTA;

    // Usa o confirmText passado, ou o defaultConfirmText se confirmText não for fornecido
    const finalConfirmText = confirmText || defaultConfirmText;

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onNameChange(e.target.value);
    };

    const handleConfirm = () => {
        if (modalType === "DIGITAR_NOME" && !inputValue.trim()) {
            setError("O nome não pode estar vazio.");
            return;
        }
        setError(null);
        onConfirm();
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
                                placeholder="Digite um nome1111"
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
                                {finalConfirmText}
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
                            {finalConfirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ModalModal;
