import React, { useEffect, useState } from "react";
import Select from 'react-select';
import ModalAlert from './ModalAlert';

function ModalSalvos({ isOpen, onClose, generateReport }) {
    const [selectedCampo, setSelectedCampo] = useState(null);
    const [campoOptions, setCampoOptions] = useState([]);
    const [excludeCampo, setExcludeCampo] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [modalMessage, setModalMessage] = useState('');

    // Impedir scroll da página quando o modal está aberto
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        document.body.style.paddingRight = isOpen ? '6px' : '';
        
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    useEffect(() => {
        async function fetchSavedQueries() {
            try {
                const response = await fetch('http://localhost:8080/find/saved-query', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.statusText}`);
                }

                const data = await response.json();

                const options = data.map(item => ({
                    label: item.queryName,
                    finalQuery: item.finalQuery,
                    queryWithTotalizers: {
                        "query": item.totalizersQuery,
                        "totalizers": item.totalizers.map(totalizerObj => totalizerObj.totalizer)
                    }
                }));
                setCampoOptions(options);
            } catch (error) {
                console.error('Erro ao buscar as consultas salvas:', error);
            }
        }

        fetchSavedQueries();
    }, []);

    async function deleteSavedQuery() {
        try {
            const response = await fetch(`http://localhost:8080/delete/${excludeCampo}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            setCampoOptions(prevOptions => prevOptions.filter(option => option.value !== excludeCampo));
            setSelectedCampo(null);

        } catch (error) {
            console.error('Erro ao excluir a consulta salva:', error);
        } finally {
            setModalType(null); // Fechar o modal após a exclusão
        }
    }

    const handleApagar = () => {
        if (selectedCampo) {
            setModalMessage('Você tem certeza de que deseja apagar essa consulta?');
            setModalType('confirmDelete'); // Definir modal de confirmação
        } else {
            setModalMessage('Selecione uma consulta para apagar.');
            setModalType('warning'); // Definir modal de aviso
        }
    };

    async function handleCarregar(generateReport) {
        if (selectedCampo && selectedCampo.finalQuery) {
            localStorage.setItem('loadedQuery', JSON.stringify(selectedCampo));
            setModalMessage('Consulta carregada!');
            setModalType('warning'); // Definir modal de aviso

            if (generateReport) {
                await generateReport();
            }
        } else {
            setModalMessage('Selecione uma consulta para carregar.');
            setModalType('warning'); // Definir modal de aviso
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
        >
            <div className="bg-white rounded-lg relative w-[500px] h-[250px]">
                <div className="w-full bg-custom-azul-escuro flex flex-row justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">CONSULTAS SALVAS</h5>
                    <button
                        className="font-bold mx-2 w-8 h-8 flex justify-center items-center rounded-full hover:bg-[#0A7F8E] transition-colors duration-300"
                        onClick={() => {
                            onClose();
                            setSelectedCampo('');
                        }}
                        aria-label="Fechar modal"
                    >
                        ×
                    </button>
                </div>
                <div className="flex flex-col items-center mt-5 pb-16">
                    <div className="w-11/12 bg-gray-200 bg-opacity-30 rounded-md p-4">
                        <h5 className="font-medium mb-4">Nome do Relatório</h5>
                        <Select
                            name="campos"
                            options={campoOptions}
                            className="basic-select w-full"
                            classNamePrefix="Select"
                            placeholder="Selecione o Campo..."
                            onChange={(selectedOption) => {
                                setSelectedCampo(selectedOption);
                                setExcludeCampo(selectedOption ? selectedOption.label : null);
                            }}
                            value={selectedCampo}
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.label}
                        />
                    </div>
                </div>
                {/* Botões de Excluir, Cancelar e Salvar */}
                <div className="flex p-2 rounded-b-lg absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-between">
                    <div className="flex items-center">
                        <button
                            className="align-right font-bold text-white rounded-lg w-20 h-10 text-sm cursor-pointer mr-[220px] bg-custom-vermelho hover:bg-custom-vermelho-escuro transition-colors duration-300"
                            onClick={handleApagar}
                        >
                            Excluir
                        </button>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="align-left font-bold text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer mr-2 flex items-center justify-center bg-gray-500 hover:bg-gray-600 transition-colors duration-300"
                            onClick={() => { onClose(); setSelectedCampo('') }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="align-left font-bold border-none text-white rounded-lg w-20 h-10 p-0 text-sm cursor-pointer flex items-center justify-center bg-custom-azul hover:bg-custom-azul-escuro transition-colors duration-300"
                            onClick={() => handleCarregar(generateReport)}
                        >
                            Carregar
                        </button>
                    </div>
                </div>
            </div>
            {/* Modais */}
            {modalType === 'confirmDelete' && (
                <ModalAlert
                    modalType="APAGAR"
                    isOpen={true}
                    onClose={() => setModalType(null)}
                    onConfirm={deleteSavedQuery}
                    confirmText="Excluir"
                    message={modalMessage}
                    title="Confirmação"
                    buttonColors={{
                        confirm: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
                        cancel: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-600",
                    }}
                />
            )}
            {/* Modal de Aviso */}
            {modalType === 'warning' && (
                <ModalAlert
                    isOpen={true}
                    onClose={() => setModalType(null)}
                    onConfirm={() => setModalType(null)}
                    confirmText="Confirmar"
                    message={modalMessage}
                    title="Aviso"
                />
            )}
        </div>
    );
}

export default ModalSalvos;