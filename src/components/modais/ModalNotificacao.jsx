import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaBell } from 'react-icons/fa';

Modal.setAppElement('#root');

const ModalNotificacao = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null); // Estado para armazenar o URL do PDF
    const [pdfModalIsOpen, setPdfModalIsOpen] = useState(false); // Modal para PDF em tela cheia

    const openModal = async () => {
        try {
            const response = await fetch('http://localhost:8080/pdf/list');
            if (!response.ok) {
                throw new Error('Erro ao buscar notificações');
            }
            const data = await response.json();
            setNotificacoes(data);
            console.log(data);
        } catch (error) {
            console.error(error);
            setNotificacoes([]);
        } finally {
            setModalIsOpen(true); // Abre o modal das notificações
        }
    };

    const fetchPdfById = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/pdf/get/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar PDF');
            }

            const blob = await response.blob();

            // Gera o URL para exibir o PDF
            const url = URL.createObjectURL(blob);
            setPdfUrl(url); // Atualiza o estado com o URL do PDF
            setPdfModalIsOpen(true); // Abre o modal em tela cheia para o PDF

        } catch (error) {
            console.error("Erro ao buscar o PDF:", error);
            alert("Falha ao carregar o PDF: " + error.message);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const closePdfModal = () => {
        setPdfModalIsOpen(false);
        setPdfUrl(null); // Limpa o URL do PDF ao fechar
    };

    return (
        <div className="fixed top-3 right-3">
            <button
                className="text-custom-azul hover:text-custom-azul-escuro transition duration-300"
                onClick={openModal}
            >
                <FaBell size={20} />
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Notificações"
                className="bg-white rounded-lg absolute top-3 right-12 z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-20 shadow-sm flex justify-center items-center z-50"
            >
                <div className="flex justify-between items-center border-b p-3 pb-2 mb-4">
                    <h2 className="font-bold mx-2">Notificações</h2>
                    <button
                        className="text-gray-500 hover:text-custom-azul transition duration-300 rounded-full w-8 h-8 flex justify-center items-center"
                        onClick={closeModal}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="w-[450px] h-[350px] flex flex-col relative">
                    <div className="text-gray-600 mb-5 mx-5 flex flex-col overflow-y-auto h-full">
                        {loading ? (
                            <p>Carregando notificações...</p>
                        ) : (
                            <table className="min-w-full border-collapse border border-gray-200 text-tiny">
                                <thead className="bg-custom-azul text-white sticky top-0 z-10">
                                    <tr>
                                        <th className="border border-gray-200 p-1 hidden">ID</th>
                                        <th className="border border-gray-200 p-1">Título</th>
                                        <th className="border border-gray-200 p-1">Data Início</th>
                                        <th className="border border-gray-200 p-1">Data Final</th>
                                        <th className="border border-gray-200 p-1">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {notificacoes.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center border border-gray-200 p-1">Nenhuma notificação por enquanto.</td>
                                        </tr>
                                    ) : (
                                        notificacoes.map((notificacao, index) => (
                                            <tr key={notificacao.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="border border-gray-200 p-2 hidden">{notificacao.id}</td>
                                                <td className="border border-gray-200 p-2">{notificacao.pdfTitle || 'Sem Título'}</td>
                                                <td className="border border-gray-200 p-2">{new Date(notificacao.requestTime).toLocaleString()}</td>
                                                <td className="border border-gray-200 p-2">{new Date(notificacao.generatedPdfTime).toLocaleString()}</td>
                                                <td className="border border-gray-200 p-2 flex flex-col items-center space-y-1">
                                                    <button className="text-custom-azul hover:text-custom-azul-escuro transition duration-300">Visualizar</button>
                                                    <button className="text-custom-azul hover:text-custom-azul-escuro transition duration-300"
                                                        onClick={() => fetchPdfById(notificacao.id)}
                                                    >PDF</button>
                                                    <button className="text-custom-azul hover:text-custom-azul-escuro transition duration-300">CSV</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Modal para exibir o PDF em tela cheia */}
            <Modal
                isOpen={pdfModalIsOpen}
                onRequestClose={closePdfModal}
                contentLabel="Visualizar PDF"
                className="absolute inset-0 flex justify-center items-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-[1000]"
            >
                <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    onClick={closePdfModal}
                    aria-label="Fechar PDF"
                >
                    ×
                </button>

                {pdfUrl ? (
                    <div className="bg-white p-0 rounded-md relative w-[850px] h-[90%] overflow-hidden flex justify-center items-center">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                            title="PDF Preview"
                        />
                    </div>
                ) : (
                    <p className="text-white">Carregando PDF...</p>
                )}
            </Modal>
        </div>
    );
};

export default ModalNotificacao;