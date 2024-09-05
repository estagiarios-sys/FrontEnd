import React, { useEffect, useState } from "react";
import Select from 'react-select';
import ModalModal from './ModalModal';

function ModalSalvos({ isOpen, onClose }) {
    const [selectedCampo, setSelectedCampo] = useState(null); // Agora armazena apenas um valor
    const [campoOptions, setCampoOptions] = useState([]);
    const [isConfirmModalOpen, setIsModalModalOpen] = useState(false);
    const [isConfirmModalOkOpen, setIsModalModalOkOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [excludeCampo, setExcludeCampo] = useState(null); // Um único valor

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
                    value: item.query,
                    label: item.queryName
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
            setIsModalModalOpen(false); // Fecha o modal de confirmação
        }
    }

    const handleApagar = () => {
        if (selectedCampo) {
            setModalMessage('Você tem certeza de que deseja apagar essa consulta?');
            setIsModalModalOpen(true);
        } else {
            setModalMessage('Selecione uma consulta para apagar.');
            setIsModalModalOkOpen(true);
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

    async function handleCarregar() {
        localStorage.setItem('loadedQuery', selectedCampo.value);
        const test = localStorage.getItem('loadedQuery');
        console.log(test);
        setModalMessage('Consulta carregada!');
        setIsModalModalOkOpen(true);
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
                <div className="w-full bg-neutral-500 flex flex-row justify-between text-white p-2">
                    <h5 className="font-bold mx-2">Consultas Salvas</h5>
                    <button
                        className="font-bold mx-2"
                        onClick={() => {onClose(); setSelectedCampo('')}}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '60px',
                            height: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                    >
                        X
                    </button>
                </div>
                <div style={contentContainerStyle}>
                    <div className="w-11/12 bg-neutral-300 rounded-md p-4">
                        <h5 className="font-bold mb-4">Nome do Relatório</h5>
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
                            backgroundColor: '#dc2626',
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginRight: '183.5px',
                        }}
                        onClick={handleApagar}
                    >
                        Excluir
                    </button>
                    <button
                        style={{
                            backgroundColor: '#6c757d',
                            border: 'none',
                            borderRadius: '5px',
                            color: '#fff',
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginRight: '10px',
                        }}
                        onClick={() => {onClose(); setSelectedCampo('')}}
                    >
                        Cancelar
                    </button>
                    <button
                        style={{
                            backgroundColor: '#28a745',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '5px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                        }}
                        onClick={handleCarregar}
                    >
                        Carregar
                    </button>
                </div>
            </div>
            <ModalModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsModalModalOpen(false)}
                onConfirm={deleteSavedQuery}
                confirmText="Excluir"
                message={modalMessage}
                title="Confirmação"
                buttonColors={{
                    confirm: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
                    cancel: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-600",
                }}
            />
            <ModalModal
                isOpen={isConfirmModalOkOpen}
                onClose={() => setIsModalModalOkOpen(false)}
                onConfirm={() => setIsModalModalOkOpen(false)}
                confirmText="Ok"
                message={modalMessage}
                title="Aviso"
                buttonColors={{
                    confirm: "bg-red-600 hover:bg-red-700 focus:ring-red-600",
                    cancel: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-600",
                }}
            />
        </div>

    );
}

export default ModalSalvos;
