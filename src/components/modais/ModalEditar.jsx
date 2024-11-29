import React, { useState, useEffect } from "react";
import DragDropFile from "../genericos/DragDrop.jsx"; // Componente de arrastar e soltar para upload de arquivos
import ModalAlert from "./ModalAlert.jsx"; // Componente de modal personalizado para exibir alertas
import { RemoveScroll } from "react-remove-scroll";

function ModalEditar({ isOpen, onClose, handleTitlePdf, handleImgPdf, editarRequestLoad }) {
    // Estados para armazenar o título, imagem e as informações do modal
    const [title, setTitle] = useState(''); // Armazena o título do PDF
    const [image, setImage] = useState(null); // Armazena a imagem (logotipo) carregada
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' }); // Controla o estado do modal de alerta (aberto/fechado, tipo, mensagem)

    //Função para converter uma string base64 em um arquivo File
    const base64ToFile = (base64String, fileName) => {
        const byteString = atob(base64String.split(',')[1]);
        const mimeType = base64String.split(',')[0].match(/:(.*?);/)[1];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        return new File([uint8Array], fileName, { type: mimeType });
    };

    // Carrega os dados do editarRequestLoad ao montar o componente
    useEffect(() => {
        if (editarRequestLoad) {
            setTitle(editarRequestLoad.pdfTitle);

            // Se a imagem estiver em base64, converte para File
            if (editarRequestLoad.pdfImage) {
                const imageFile = base64ToFile(editarRequestLoad.pdfImage, 'image.png');
                setImage(imageFile);
            }
        }
    }, [editarRequestLoad]);

    // Função para armazenar o arquivo de imagem carregado
    const handleImageUpload = (file) => {
        setImage(file);
    };

    // Lógica para confirmar ações no modal de alerta
    const handleConfirmar = () => {
        if (modal.type === 'ALERTA') {
            setModal({ isOpen: false, type: '', message: '' }); // Fecha o modal de alerta
        } else if (modal.type === 'APAGAR') {
            // Limpa o título e a imagem se o modal for do tipo "APAGAR"
            setTitle('');
            setImage(null);
            handleTitlePdf(''); // Atualiza o título do PDF no componente pai
            handleImgPdf(''); // Atualiza a imagem do PDF no componente pai
            setModal({ isOpen: false, type: '', message: '' }); // Fecha o modal
        } else if (modal.type === 'CONFIRMAR') {
            setModal({ isOpen: false, type: '', message: '' }); // Fecha o modal de confirmação e encerra o modal de edição
            onClose(); // Fecha o modal principal
        } else if (modal.type === 'SUCESSO') {
            setModal({ isOpen: false, type: '', message: '' }); // Fecha o modal de sucesso
            onClose(); // Fecha o modal principal
        }
    };

    // Função para fechar o modal principal
    const handleClose = () => {
        // Se houver título ou imagem carregada, exibe uma confirmação antes de fechar
        if (title !== '' || image !== null) {
            setModal({ isOpen: true, type: 'CONFIRMAR', message: 'Os dados carregados não foram salvos, deseja realmente sair?' });
            return;
        }
        onClose(); // Fecha o modal diretamente se não houver dados
    };

    // Função para carregar os dados (título e imagem)
    const handleCarregar = () => {
        if (title === '' && image === null) {
            // Exibe alerta se nenhum dado tiver sido inserido
            setModal({ isOpen: true, type: 'ALERTA', message: 'Nenhum dado inserido para carregar.' });
            return;
        } else {
            handleTitlePdf(title); // Envia o título para o componente pai
            handleImgPdf(image); // Envia a imagem para o componente pai
            // Exibe mensagem de sucesso
            setModal({ isOpen: true, type: 'SUCESSO', message: 'Dados carregados com sucesso!' });
        }
    };

    // Função para excluir os dados carregados (título e imagem)
    const handleExcluir = () => {
        if (title === '' && image === null) {
            // Exibe alerta se não houver dados carregados
            setModal({ isOpen: true, type: 'ALERTA', message: 'Nenhum dado carregado para excluir.' });
            return;
        } else {
            // Exibe confirmação de exclusão
            setModal({ isOpen: true, type: 'APAGAR', message: 'Deseja realmente apagar os dados carregados?' });
        }
    };

    if (!isOpen) return null; // Não renderiza o modal se ele não estiver aberto

    return (
        <RemoveScroll enabled={isOpen}> {/* Wrap the modal content with RemoveScroll */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg relative flex flex-col w-[500px] h-[580px]">
                {/* Cabeçalho */}
                <div className="w-full bg-[#0A7F8E] flex justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">EDITAR</h5>
                    <button
                        className="font-bold text-lg rounded-full w-8 h-8 flex justify-center items-center bg-[#0A7F8E] hover:bg-[#00AAB5] transition-colors duration-300"
                        onClick={handleClose}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true">×</span> {/* Ícone de fechar */}
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 w-full p-4 overflow-auto">
                    <div className="w-12/12 bg-gray-200 bg-opacity-30 rounded-md p-2 relative">
                        {/* Campo de título */}
                        <div className="mb-4">
                            <h5 className="font-medium mb-1">Título:</h5>
                            <input
                                type="text"
                                maxLength={20} // Limite de caracteres para o título
                                value={title}
                                onChange={(e) => setTitle(e.target.value)} // Atualiza o estado `title`
                                placeholder="Digite..."
                                className="border border-[#0A7F8E] focus:ring-1 focus:ring-[#0A7F8E] rounded p-2 focus:outline-none w-full"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.target.blur(); // Remove o foco ao pressionar Enter
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Campo para logotipo */}
                    <div>
                        <h5 className="font-medium mb-1">Logotipo:</h5>
                        <div className="p-2 flex justify-center items-center overflow-auto border border-dashed border-gray-300 rounded">
                            <DragDropFile onFileUpload={handleImageUpload} // Componente para arrastar e soltar arquivos
                                image={image} // Exibe a imagem carregada
                            />
                        </div>
                    </div>
                </div>

                {/* Rodapé com botões */}
                <div className="flex p-2 rounded-b-lg absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-between">
                    <div className="flex items-center">
                        <button
                            className="align-right font-bold text-white rounded-lg w-20 h-10 text-sm cursor-pointer mr-[220px] bg-custom-vermelho hover:bg-custom-vermelho-escuro transition-colors duration-300"
                            onClick={handleExcluir} // Botão para excluir os dados
                        >
                            Excluir
                        </button>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="align-left font-bold border-none text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer flex items-center justify-center bg-custom-azul hover:bg-custom-azul-escuro transition-colors duration-300"
                            onClick={handleCarregar} // Botão para carregar os dados
                        >
                            Carregar
                        </button>
                    </div>
                </div>
            </div>

            {/* Componente ModalAlert para exibir alertas e confirmações */}
            <ModalAlert
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                modalType={modal.type || 'ALERTA'} // Garante que um valor válido seja passado
                message={modal.message}
                onConfirm={handleConfirmar} // Callback ao confirmar ação no modal
            />

        </div>
        </RemoveScroll>
    );
}

export default ModalEditar;