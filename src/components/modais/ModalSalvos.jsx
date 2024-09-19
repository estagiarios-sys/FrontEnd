import React, { useEffect, useState } from "react";
import Select from 'react-select';
import ModalAlert from './ModalAlert';
import { getTotalizers } from "../CamposSelecionados";

function ModalSalvos({ isOpen, onClose, generateReport }) {
    const [selectedCampo, setSelectedCampo] = useState(null); // Agora armazena apenas um valor
    const [campoOptions, setCampoOptions] = useState([]);
    const [isConfirmModalOpen, setIsModalAlertOpen] = useState(false);
    const [isConfirmModalOkOpen, setIsModalAlertOkOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [excludeCampo, setExcludeCampo] = useState(null); // Um único valor
    const [isHoveredButtonX, setIsHoveredButtonX] = useState(false);
    const [isHoveredButtonExcluir, setIsHoveredButtonExcluir] = useState(false);
    const [isHoveredButtonCancelar, setIsHoveredButtonCancelar] = useState(false);
    const [isHoveredButtonCarregar, setIsHoveredButtonCarregar] = useState(false);

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

            console.log('Consulta excluída com sucesso');
            console.log(excludeCampo);

            // Atualiza as opções removendo o item excluído
            setCampoOptions(prevOptions => prevOptions.filter(option => option.value !== excludeCampo));
            setSelectedCampo(null); // Limpa a seleção

        } catch (error) {
            console.error('Erro ao excluir a consulta salva:', error);
        } finally {
            setIsModalAlertOpen(false); // Fecha o modal de confirmação
        }
    }

    const handleApagar = () => {
        if (selectedCampo) {
            setModalMessage('Você tem certeza de que deseja apagar essa consulta?');
            setIsModalAlertOpen(true);
        } else {
            setModalMessage('Selecione uma consulta para apagar.');
            setIsModalAlertOkOpen(true);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    async function handleCarregar(generateReport) {
        console.log(selectedCampo)
        if (selectedCampo && selectedCampo.finalQuery) {
            localStorage.setItem('loadedQuery', JSON.stringify(selectedCampo))
            setModalMessage('Consulta carregada!');
            setIsModalAlertOkOpen(true);
    
            if (generateReport) {
                await generateReport();
            }
        } else {
            setModalMessage('Selecione uma consulta para carregar.');
            setIsModalAlertOkOpen(true);
        }
    }

    if (!isOpen) return null;

    const contentContainerStyle = {
        width: '500px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20px',
        paddingBottom: '60px',
    };

    const resetHoverStates = () => {
        setIsHoveredButtonX(false);
        setIsHoveredButtonExcluir(false);
        setIsHoveredButtonCancelar(false);
        setIsHoveredButtonCarregar(false);
    };

    const handleClose = () => {
        resetHoverStates();
        setSelectedCampo('');
        onClose();
    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '0px',
                    borderRadius: '5px',
                    position: 'relative',
                    width: '500px',
                    height: '250px',
                }}
            >
                <div className="w-full bg-custom-azul-escuro flex flex-row justify-between items-center text-white p-2">
                    <h5 className="font-bold mx-2">CONSULTAS SALVAS</h5>
                    <button
                        className="font-bold mx-2"
                        onClick={handleClose}
                        style={{
                            borderRadius: '50px',
                            hover: 'pointer',
                            hoverBackgroundColor: '#0A7F8E',
                            width: '30px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '16px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonX ? '#00AAB5' : '#0A7F8E',
                        }}
                        onMouseEnter={() => setIsHoveredButtonX(true)}
                        onMouseLeave={() => setIsHoveredButtonX(false)}
                    >
                        X
                    </button>
                </div>
                <div style={contentContainerStyle}>
                    <div className="w-11/12 bg-gray-200 bg-opacity-30  rounded-md p-4">
                        <h5 className="font-medium mb-4">Nome do Relatório</h5>
                        <Select
                            name="campos"
                            options={campoOptions}
                            className="basic-select w-full"
                            classNamePrefix="Select"
                            placeholder="Selecione o Campo..."
                            onChange={(selectedOption) => {
                                setSelectedCampo(selectedOption); // Armazena o objeto selecionado
                                setExcludeCampo(selectedOption ? selectedOption.label : null); // Armazena o label para exclusão
                            }}
                            value={selectedCampo} // Usa o objeto selecionado
                            getOptionLabel={(option) => option.label} // Define como mostrar o label
                            getOptionValue={(option) => option.value} // Define como obter o valor
                        />
                    </div>
                </div>
                {/* Botões de Excluir, Cancelar e Salvar */}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        padding: '10px',
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        boxSizing: 'border-box',
                        backgroundColor: '#fff',
                    }}
                >
                    <button 
                        style={{
                            fontWeight: 'bold',
                            backgroundColor: '#ED1846',
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            width: '80px',
                            height: '40px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginRight: '220px',
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonExcluir ? '#B11236' : '#ED1846'
                        }}
                        onMouseEnter={() => setIsHoveredButtonExcluir(true)}
                        onMouseLeave={() => setIsHoveredButtonExcluir(false)}
                        onClick={handleApagar}
                    >
                        Excluir
                    </button>
                    <button className="align-left"
                        style={{
                            fontWeight: 'bold',
                            backgroundColor: '#6c757d',
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            width: '80px',
                            height: '40px',
                            padding: '0', // Remover padding para garantir que o tamanho definido seja exato
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginRight: '10px',
                            display: 'flex', // Usar flexbox para alinhamento
                            alignItems: 'center', // Alinhamento vertical
                            justifyContent: 'center', // Alinhamento horizontal
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonCancelar ? '#5a6268' : '#6c757d'
                        }}
                        onClick={() => {onClose(); setSelectedCampo('')}}
                        onMouseEnter={() => setIsHoveredButtonCancelar(true)}
                        onMouseLeave={() => setIsHoveredButtonCancelar(false)}
                    >
                        Cancelar
                    </button>
                    <button className="align-left"
                        style={{
                            fontWeight: 'bold',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '5px',
                            width: '80px',
                            height: '40px',
                            padding: '0',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex', // Usar flexbox para alinhamento
                            alignItems: 'center', // Alinhamento vertical
                            justifyContent: 'center', // Alinhamento horizontal
                            transition: 'background-color 0.3s ease',
                            backgroundColor: isHoveredButtonCarregar ? '#00AAB5' : '#0A7F8E',
                        }}
                        onClick={() => handleCarregar(generateReport)}
                        onMouseEnter={() => setIsHoveredButtonCarregar(true)}
                        onMouseLeave={() => setIsHoveredButtonCarregar(false)}
                    >
                        Carregar
                    </button>
                </div>
            </div>
            <ModalAlert
                modalType="APAGAR"
                isOpen={isConfirmModalOpen}
                onClose={() => setIsModalAlertOpen(false)}
                onConfirm={deleteSavedQuery}
                confirmText="Excluir"
                message={modalMessage}
                title="Confirmação"
                buttonColors={{
                    confirm: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
                    cancel: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-600",
                }}
            />
            <ModalAlert
                isOpen={isConfirmModalOkOpen}
                onClose={() => setIsModalAlertOkOpen(false)}
                onConfirm={() => {
                    setIsModalAlertOkOpen(false);
                    onClose();
                }}
                confirmText="Confirmar"
                message={modalMessage}
                title="Aviso"
            />
        </div>
    );
}

export default ModalSalvos;
