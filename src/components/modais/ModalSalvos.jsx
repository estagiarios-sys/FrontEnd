import React, { useEffect, useState } from "react";
import Select from 'react-select';
import ModalAlert from './ModalAlert';

function ModalSalvos({ isOpen, onClose, generateReport, setBase64Image, setTitlePdf }) {
    const [selectedCampo, setSelectedCampo] = useState(null);
    const [campoOptions, setCampoOptions] = useState([]);
    const [excludeCampo, setExcludeCampo] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' }); // Usando o estado modal

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
                    },
                    imgSaved: item.imgPDF,
                    titleSaved: item.titlePDF
                }));
                setCampoOptions(options);
            } catch (error) {
                console.error('Erro ao buscar as consultas salvas:', error);
            }
        }

        fetchSavedQueries();
    }, [selectedCampo, isOpen]);

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

            // Exibir modal de sucesso ao excluir
            setModal({ isOpen: true, type: 'SUCESSO', message: 'Consulta excluída com sucesso!' });

        } catch (error) {
            console.error('Erro ao excluir a consulta salva:', error);
        }
    }

    // Função para verificar se a consulta foi selecionada
    function verifyCampoSelected(message) {
        if (!selectedCampo) {
            setModal({ isOpen: true, type: 'ALERTA', message });
            return false;
        }
        return true;
    }

    const handleApagar = () => {
        if (!verifyCampoSelected('Selecione uma consulta para apagar.')) return;
        setModal({
            isOpen: true,
            type: 'CONFIRMAR',
            message: 'Você tem certeza de que deseja apagar essa consulta?',
        });
    };

    async function handleCarregar(generateReport) {
        if (!verifyCampoSelected('Selecione uma consulta para carregar.')) return;
        
        localStorage.setItem('loadedQuery', JSON.stringify(selectedCampo)); 

        const base64ImageWithMetadata = "data:image/png;base64," + selectedCampo.imgSaved;

        setBase64Image(base64ImageWithMetadata);
        setTitlePdf(selectedCampo.titleSaved);

        setModal({ isOpen: true, type: 'SUCESSO', message: 'Consulta carregada com sucesso!' });

        if (generateReport) {
            await generateReport();
        }
    }

    const handleConfirmar = () => {
        if (modal.type === 'CONFIRMAR') {
            deleteSavedQuery();
        } else if (modal.message === 'Consulta carregada com sucesso!') {
            onClose();
        }
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            {/* Renderização do modal de alerta */}
            <ModalAlert
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={handleConfirmar}
                modalType={modal.type || 'ALERTA'} // Usar 'ALERTA' como valor padrão
                message={modal.message}
            />
        </div>
    );
}

export default ModalSalvos;
