import React, { useState, useEffect } from "react";
import DragDropFile from "../genericos/DragDrop.jsx";
import ModalAlert from "./ModalAlert.jsx";

function ModalEditar({ isOpen, onClose, handleTitlePdf, handleImgPdf }) {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });

    const handleImageUpload = (file) => {
        setImage(file);
    };

    const handleConfirmar = () => {
        if (modal.type === 'ALERTA') {
            setModal({ isOpen: false, type: '', message: '' });
        } else if (modal.type === 'APAGAR') {
            setTitle('');
            setImage(null);
            handleTitlePdf('');
            handleImgPdf('');
            setModal({ isOpen: false, type: '', message: '' });
        } else if (modal.type === 'CONFIRMAR') {
            setTitle('');
            setImage(null);
            setModal({ isOpen: false, type: '', message: '' });
            onClose();
        } else if (modal.type === 'SUCESSO') {
            setModal({ isOpen: false, type: '', message: '' });
            onClose();
        }
    };

    const handleClose = () => {
        if (title !== '' || image !== null) {
            setModal({ isOpen: true, type: 'CONFIRMAR', message: 'Os dados carregados não foram salvos, deseja realmente sair?' });
            return;
        }
        onClose();
    };

    const handleCarregar = () => {
        if (title === '' && image === null) {
            setModal({ isOpen: true, type: 'ALERTA', message: 'Nenhum dado inserido para carregar.' });
            return;
        } else {
            handleTitlePdf(title);
            handleImgPdf(image);
            setModal({ isOpen: true, type: 'SUCESSO', message: 'Dados carregados com sucesso!' });
        }
    };

    const handleExcluir = () => {
        if (title === '' && image === null) {
            setModal({ isOpen: true, type: 'ALERTA', message: 'Nenhum dado carregado para excluir.' });
            return;
        } else {
            setModal({ isOpen: true, type: 'APAGAR', message: 'Deseja realmente apagar os dados carregados?' });
        }

    };

    // Impedir scroll da página quando o modal está aberto
    useEffect(() => {
        const hasScroll = document.body.scrollHeight > window.innerHeight;

        if (isOpen) {
            if (hasScroll) {
                document.body.style.paddingRight = "6px"; // Adiciona padding
            }
            document.body.style.overflow = "hidden"; // Desativa o scroll
        } else {
            document.body.style.overflow = ""; // Restaura o scroll
            document.body.style.paddingRight = ""; // Remove o padding
        }

        return () => {
            document.body.style.overflow = ""; // Limpeza no fechamento
            document.body.style.paddingRight = ""; // Limpeza no fechamento
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg relative flex flex-col w-[500px] h-[550px]">
                {/* Cabeçalho */}
                <div className="w-full bg-[#0A7F8E] flex justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">EDITAR</h5>
                    <button
                        className="font-bold text-lg rounded-full w-8 h-8 flex justify-center items-center bg-[#0A7F8E] hover:bg-[#00AAB5] transition-colors duration-300"
                        onClick={handleClose}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 w-full p-4 overflow-auto">
                    {/* Título */}
                    <div className="mb-4">
                        <h5 className="font-medium mb-1">Título:</h5>
                        <input
                            type="text"
                            maxLength={20}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Digite..."
                            className="border border-[#0A7F8E] focus:ring-1 focus:ring-[#0A7F8E] rounded p-2 focus:outline-none w-full"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.target.blur();
                                }
                            }}
                        />
                    </div>

                    {/* Logotipo */}
                    <div>
                        <h5 className="font-medium mb-1">Logotipo:</h5>
                        <div className="p-2 flex justify-center items-center overflow-auto border border-dashed border-gray-300 rounded">
                            <DragDropFile onFileUpload={handleImageUpload} />
                        </div>
                    </div>
                </div>

                {/* Rodapé */}
                <div className="flex p-2 rounded-b-lg absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-between">
                    <div className="flex items-center">
                        <button
                            className="align-right font-bold text-white rounded-lg w-20 h-10 text-sm cursor-pointer mr-[220px] bg-custom-vermelho hover:bg-custom-vermelho-escuro transition-colors duration-300"
                            onClick={() => {
                                handleExcluir();
                            }}
                        >
                            Excluir
                        </button>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="align-left font-bold border-none text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer flex items-center justify-center bg-custom-azul hover:bg-custom-azul-escuro transition-colors duration-300"
                            onClick={() => {
                                handleCarregar();
                            }}
                        >
                            Carregar
                        </button>
                    </div>
                </div>
            </div>
            {/* Modal de Alerta */}
            <ModalAlert
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmar}
                modalType={modal.type}
                message={modal.message}
            />
        </div>
    );
}

export default ModalEditar;