import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaBell } from 'react-icons/fa';

Modal.setAppElement('#root');

const ModalNotificacao = ({ setPdfOK, pdfOK, setStatus, status }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [notificacoes, setNotificacoes] = useState([]);
    const [pdfUrl, setPdfUrl] = useState(null); // Estado para armazenar o URL do PDF
    const [pdfModalIsOpen, setPdfModalIsOpen] = useState(false); // Modal para PDF em tela cheia

    const loadData = async () => {
        try {
            const response = await fetch('http://localhost:8080/pdf/list');
            if (!response.ok) {
                throw new Error('Erro ao buscar notificações');
            }
            const data = await response.json();
            setNotificacoes(data);
            console.log('Notificações:', data);
            if (modalIsOpen) {
                setPdfOK(false); // Atualiza o estado de pdfOK
            }
        } catch (error) {
            console.error(error);
            setNotificacoes([]);
            alert('Falha ao buscar notificações: ' + error.message);
        }
    };

    const openModal = async () => {
        await loadData();
        setModalIsOpen(true); // Abre o modal das notificações
        setPdfOK(false); // Reseta o estado de pdfOK
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

    const mapStatus = (status) => {
        switch (status) {
            case 'ERRO':
                return { display: 'ERRO', color: 'bg-red-500', textColor: 'text-red-500', isDisabled: 'custon-disabled-erro' };
            case 'BUSCANDO_DADOS':
                return { display: 'BUSCANDO DADOS', color: 'bg-orange-500', textColor: 'text-orange-500', isDisabled: 'custon-disabled-processing' };
            case 'GERANDO_PDF':
                return { display: 'GERANDO PDF', color: 'bg-yellow-500', textColor: 'text-yellow-500', isDisabled: 'custon-disabled-processing' };
            case 'CONCLUIDO':
                return { display: 'CONCLUÍDO', color: 'bg-green-500', textColor: 'text-green-500', isDisabled: '' };
            default:
                return { display: 'DESCONHECIDO', color: 'bg-gray-400', textColor: 'text-gray-400', isDisabled: '' }; // padrão
        }
    };

    // useEffect para atualizar as notificações quando pdfOK for true
    useEffect(() => {
        const fetchNotificacoes = async () => {
            if (pdfOK || status) {
                await loadData();
                setStatus(false);
            }
        };

        fetchNotificacoes();
    }, [pdfOK, status]); // Dependência do useEffect

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
                    <h2 className="font-semibold mx-2">Notificações</h2>
                    <button
                        className="text-gray-500 hover:text-custom-azul transition duration-300 rounded-full w-8 h-8 flex justify-center items-center"
                        onClick={closeModal}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true" className="text-xl">×</span>
                    </button>
                </div>
                <div className="w-[610px] h-[350px] flex flex-col relative">
                    <div className="text-gray-600 mb-5 mx-5 flex flex-col h-full relative">
                        <div className="relative h-[95%]">
                            {/* Container da tabela com overflow */}
                            <div className="overflow-y-auto h-full">
                                <table className="min-w-full text-tiny overflow-hidden">
                                    <thead className="bg-custom-azul-escuro text-white border border-custom-azul-escuro">
                                        <tr>
                                            <th className="p-1 hidden">ID</th>
                                            <th className="p-1">Título</th>
                                            <th className="p-1">Data Início</th>
                                            <th className="p-1">Data Final</th>
                                            <th className="p-1">Status</th>
                                            <th className="p-1">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notificacoes.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center border border-custom-azul-escuro p-1">Nenhuma notificação por enquanto.</td>
                                            </tr>
                                        ) : (
                                            notificacoes.map((notificacao, index) => {
                                                const { display, color, textColor, isDisabled } = mapStatus(notificacao.status);

                                                return (
                                                    <tr key={notificacao.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                        <td className="text-center border border-gray-300 p-0 hidden">{notificacao.id}</td>
                                                        <td className="text-center border border-gray-300 p-0">{notificacao.pdfTitle || 'Sem Título'}</td>
                                                        <td className="text-center border border-gray-300 p-0 whitespace-nowrap">{new Date(notificacao.requestTime).toLocaleString()}</td>
                                                        <td className="text-center border border-gray-300 p-0 whitespace-nowrap">
                                                            {notificacao.generatedPdfTime ? new Date(notificacao.generatedPdfTime).toLocaleString() : '-'}
                                                        </td>
                                                        <td className="text-center border border-gray-300 p-0 whitespace-nowrap">
                                                            <div className="flex flex-col items-center">
                                                                {/* Indicador de Status */}
                                                                <div className={`w-3 h-3 rounded-full ${color}`} />
                                                                <span className={`text-xs ${textColor} whitespace-nowrap`}>
                                                                    {display}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="text-center border border-gray-300 p-2">
                                                            <button
                                                                className={`text-custom-azul transition duration-300 p-3 ${isDisabled}`} // Adicione a classe correspondente ao estado
                                                                onClick={() => fetchPdfById(notificacao.id)}
                                                                disabled={!!isDisabled} // Desabilita o botão se necessário
                                                            >
                                                                PDF
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Sombra na parte inferior */}
                            {notificacoes.length <= 4 ? (
                                <div className="absolute bottom-0 left-0 right-0 h-0 bg-white pointer-events-none" style={{ marginRight: '6px' }}></div>
                            ) : (
                                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-300 to-transparent pointer-events-none" style={{ marginRight: '6px' }}></div>
                            )}
                        </div>
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
                    className="absolute top-4 right-4 text-white text-2xl w-full h-full"
                    onClick={closePdfModal}
                    aria-label="Fechar PDF"
                >
                </button>

                {pdfUrl ? (
                    <div className="bg-white p-0 rounded-md relative w-[850px] h-[90%] overflow-hidden flex justify-center items-center">
                        <iframe
                            src={pdfUrl}
                            title="PDF Preview"
                            className="w-full h-full"
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