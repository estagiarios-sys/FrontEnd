import React, { useState } from "react";
import ModalAlert from "./ModalAlert";
import Loading from "../genericos/Loading";
import { RemoveScroll } from "react-remove-scroll";

function ModalConsultar({ isOpen, onClose, onFetchData, timeData }) {
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' }); // Controla o estado do modalAlert dependendo tera q ser arrubado pois estava no modelo para gerar varios modais dependendo da acao
    const [loading, setLoading] = useState(false);

    const handleConfirmar = () => {
        setModal({ isOpen: false, type: '', message: '' });
        onClose();
    };

    const handleFetchData = async () => {
        try {
            setLoading(true);
            await onFetchData(); // Chama a função de busca de dados
            setModal({
                isOpen: true,
                type: 'SUCESSO',
                message: 'Relatório gerado com sucesso!',
            });
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setModal({
                isOpen: true,
                type: 'ALERTA',
                message: 'Erro ao processar a consulta. Por favor, tente novamente.',
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <RemoveScroll enabled={isOpen}> {/* Wrap the modal content with RemoveScroll */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg relative w-[500px] h-[250px]">
                    {loading && <Loading />}
                    {/* Cabeçalho do Modal */}
                    <div className="w-full bg-custom-azul-escuro flex justify-between items-center text-white p-2">
                        <h5 className="font-bold mx-2">CONSULTAR DADOS</h5>
                        <button
                            className="font-bold text-lg rounded-full w-8 h-8 flex justify-center items-center bg-[#0A7F8E] hover:bg-[#00AAB5] transition-colors duration-300"
                            onClick={onClose}
                            aria-label="Fechar modal"
                            title="Fechar"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    {/* Corpo do Modal */}
                    <div className="flex flex-col items-center mt-3">
                        <div className="w-11/12 bg-gray-200 bg-opacity-30 rounded-md p-4 relative">
                            <p className="font-medium mb-4">
                            O seu tempo previsto para gerar o relatório é de aproximadamente: {timeData} segundos. <br/> Deseja continuar?
                            </p>
                        </div>
                    </div>
                    {/* Rodapé do Modal */}
                    <div className="rounded-b-lg flex p-2 absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-end">
                        <button
                            className="font-bold text-white rounded-lg w-20 h-10 text-sm cursor-pointer mr-2 flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-300"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="font-bold text-white rounded-lg w-32 h-10 text-sm cursor-pointer flex items-center justify-center bg-custom-azul hover:bg-custom-azul-escuro transition-colors duration-300"
                            onClick={handleFetchData}
                        >
                            Buscar Dados
                        </button>
                    </div>
                </div>
                {/* Modal de Alerta */}
                <ModalAlert
                    isOpen={modal.isOpen}
                    onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={handleConfirmar}
                    modalType={modal.type || 'ALERTA'}
                    message={modal.message}
                />
            </div>
        </RemoveScroll>
    );
}

export default ModalConsultar;