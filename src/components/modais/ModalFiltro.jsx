import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import ModalAlert from './ModalAlert';

const ordenacaoOptions = [
    { value: '>', label: 'Maior' },
    { value: '<', label: 'Menor' },
    { value: '=', label: 'Igual' },
    { value: '>=', label: 'Maior ou igual' },
    { value: '<=', label: 'Menor ou igual' },
    { value: '!=', label: 'Diferente' },
];

const inputTypeMap = {
    VARCHAR2: 'text',
    CLOB: 'text',
    CHAR: 'text',
    NUMBER: 'number',
    FLOAT: 'number',
    DOUBLE: 'number',
    BINARY_FLOAT: 'number',
    BINARY_DOUBLE: 'number',
    DATE: 'date',
    TIMESTAMP: 'datetime-local',
    'TIMESTAMP WITH TIME ZONE': 'datetime-local',
    'TIMESTAMP WITH LOCAL TIME ZONE': 'datetime-local',
    TIME: 'time',
};

const getInputType = (type) => inputTypeMap[type] || 'text';

const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
        <div>{props.data.label}</div>
    </components.SingleValue>
);

function ModalFiltro({ isOpen, onClose, columns, onSave }) {
    const [selectedCampos, setSelectedCampos] = useState([]);
    const [addedCampos, setAddedCampos] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, message: "", type: "ALERTA" });
    const selectRefs = useRef([]);
    const containerRef = useRef(null);

    const handleScroll = () => {
        // Fecha todos os selects abertos ao scrollar
        selectRefs.current.forEach(ref => {
            if (ref) ref.blur();
        });
    };

    const campoOptions = useMemo(() => columns.map(col => ({
        value: col.value,
        label: col.value,
        type: col.type,
    })), [columns]);

    const handleCampoChange = useCallback((selectedOptions) => {
        setSelectedCampos(selectedOptions?.map(option => option.value) || []);
    }, []);

    const handleAddSelectedCampos = useCallback(() => {
        const camposToAdd = selectedCampos.map(value => {
            const option = campoOptions.find(option => option.value === value);
            return {
                id: `${value}-${Date.now()}-${Math.random()}`, // Geração de ID único
                value: option.value,
                type: option.type,
                checked: false,
                valor: '',
                ordenacao: ''
            };
        });
        setAddedCampos(prev => [...prev, ...camposToAdd]);
        setSelectedCampos([]);
    }, [selectedCampos, campoOptions]);

    const handleRemoveAllCampos = useCallback(() => {
        setAddedCampos([]);
        onSave?.("");
    }, [onSave]);

    const handleCheckboxChange = useCallback((id) => {
        setAddedCampos(prev => prev.map(campo =>
            campo.id === id ? { ...campo, checked: !campo.checked } : campo
        ));
    }, []);

    const handleRemoveCheckedCampos = useCallback(() => {
        const updatedCampos = addedCampos.filter(campo => !campo.checked);
        const condicoesString = updatedCampos
            .map(({ value, ordenacao, valor }) => `${value.split(/\sas\s/)[0].trim()} ${ordenacao} '${valor.trim().replace(/'/g, "\\'")}'`)
            .join(' AND ');
        setAddedCampos(updatedCampos);
        onSave?.(condicoesString);
    }, [addedCampos, onSave]);

    const handleValorChange = useCallback((id, value) => {
        setAddedCampos(prev => prev.map(campo =>
            campo.id === id ? { ...campo, valor: value } : campo
        ));
    }, []);

    const handleValorKeyDown = useCallback((id, e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleValorChange(id, e.target.value);
            e.target.blur();
        }
    }, [handleValorChange]);

    const handleOrdenacaoChange = useCallback((id, selectedOption) => {
        setAddedCampos(prev => prev.map(campo =>
            campo.id === id ? { ...campo, ordenacao: selectedOption?.value || '' } : campo
        ));
    }, []);

    const handleSave = useCallback(() => {
        const hasEmptyFields = addedCampos.some(campo => !campo.valor.trim() || !campo.ordenacao);
        if (hasEmptyFields) {
            setModal({ isOpen: true, message: "Preencha todos os campos", type: "ALERTA" });
            return;
        }

        const condicoesString = addedCampos
            .map(({ value, ordenacao, valor }) => `${value.split(/\sas\s/)[0].trim()} ${ordenacao} '${valor.trim().replace(/'/g, "\\'")}'`)
            .join(' AND ');

        setModal({ isOpen: true, message: "Filtro salvo com sucesso", type: "SUCESSO" });
        onSave?.(condicoesString);
    }, [addedCampos, onSave]);

    const handleConfirm = useCallback(() => {
        if (modal.type === "SUCESSO") {
            onClose();
        }
        setModal(prev => ({ ...prev, isOpen: false }));
    }, [modal.type, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-md w-[1300px] h-[600px] flex flex-col relative">
                {/* Cabeçalho */}
                <div className="w-full h-[80px] bg-custom-azul-escuro flex justify-between items-center text-white p-5">
                    <h5 className="font-bold text-2xl">FILTROS</h5>
                    <button
                        className="font-bold text-lg rounded-full w-8 h-8 flex justify-center items-center bg-[#0A7F8E] hover:bg-[#00AAB5] transition-colors duration-300"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>

                {/* Conteúdo Principal */}
                <div className="flex flex-1 m-8" ref={containerRef}>
                    {/* Seção de Campos */}
                    <div className="w-96 mr-5 overflow-y-auto px-2">
                        <h6 className="font-bold p-1">Campos</h6>
                        <Select
                            isMulti
                            options={campoOptions}
                            components={{ SingleValue: CustomSingleValue }}
                            className="w-full"
                            classNamePrefix="Select"
                            placeholder="Selecione..."
                            onChange={handleCampoChange}
                            value={campoOptions.filter(option => selectedCampos.includes(option.value))}
                            closeMenuOnSelect={false}
                            styles={{
                                valueContainer: (provided) => ({
                                    ...provided,
                                    maxHeight: '120px', // Altura máxima do container de opções selecionadas
                                    overflowY: 'auto', // Habilita o scroll quando a altura for excedida
                                }),
                                multiValue: (provided) => ({
                                    ...provided,
                                    display: 'flex',
                                    alignItems: 'center',
                                }),
                            }}
                        />
                    </div>

                    {/* Botões de Ação com Tooltips Customizados */}
                    <div className="flex flex-col items-center mx-5 justify-center">
                        {[
                            {
                                onClick: handleRemoveCheckedCampos,
                                bg: 'bg-custom-azul',
                                hoverBg: 'bg-custom-azul-escuro',
                                label: 'Remover campos selecionados',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                ),
                            },
                            {
                                onClick: handleAddSelectedCampos,
                                bg: 'bg-custom-vermelho',
                                hoverBg: 'bg-custom-vermelho-escuro',
                                label: 'Adicionar campos selecionados',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                ),
                            },
                            {
                                onClick: handleRemoveAllCampos,
                                bg: 'bg-custom-vermelho',
                                hoverBg: 'bg-custom-vermelho-escuro',
                                label: 'Remover todos os campos',
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                ),
                            },
                        ].map(({ onClick, bg, label, icon, hoverBg }, idx) => (
                            <div key={idx} className="relative group flex flex-col items-center">
                                {/* Tooltip */}
                                <div className="absolute bottom-[90%] px-2 py-1 bg-gray-800 bg-opacity-80 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                                    {label}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 border-opacity-80"></div>
                                </div>
                                <button
                                    className={`rounded-full ${bg} hover:${hoverBg} active:bg-opacity-100 w-10 h-10 my-3 flex justify-center items-center`}
                                    onClick={onClick}
                                    aria-label={label}
                                >
                                    {icon}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Tabela de Campos Selecionados */}
                    <div className="flex-1 overflow-y-auto ml-8">
                        <h6 className="font-bold p-1">Campos Selecionados e Condições</h6>
                        <div className="max-h-[322px] overflow-y-auto" onScroll={handleScroll}>
                            <table className="min-w-full table-fixed bg-white border-2 border-custom-azul-escuro w-full border-t-0">
                                <thead className="sticky top-0 z-10">
                                    <tr>
                                        <th className="py-2 px-4 bg-custom-azul-escuro text-left text-sm font-semibold text-white w-14"></th>
                                        <th className="py-2 px-4 bg-custom-azul-escuro text-left text-sm font-semibold text-white">Campos</th>
                                        <th className="py-2 px-4 bg-custom-azul-escuro text-left text-sm font-semibold text-white">Ordenação</th>
                                        <th className="py-2 px-4 bg-custom-azul-escuro text-left text-sm font-semibold text-white">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addedCampos.map((campo, index) => (
                                        <tr key={campo.id}>
                                            <td className="py-2 px-4 border-b border-custom-azul text-sm">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 accent-custom-azul-escuro"
                                                    checked={campo.checked}
                                                    onChange={() => handleCheckboxChange(campo.id)}
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b border-custom-azul text-sm">{campo.value}</td>
                                            <td className="py-2 px-4 border-b border-custom-azul text-sm">
                                                <Select
                                                    ref={ref => selectRefs.current[index] = ref}
                                                    options={ordenacaoOptions}
                                                    className="basic-single"
                                                    classNamePrefix="Select"
                                                    placeholder="Selecione..."
                                                    menuPortalTarget={containerRef.current} // Referencia a div que será o limite
                                                    menuShouldScrollIntoView={false} // Evita que ele saia da área visível
                                                    menuPosition="fixed" // Posiciona o menu fixo
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 20000 }) }}
                                                    onChange={(option) => handleOrdenacaoChange(campo.id, option)}
                                                    value={ordenacaoOptions.find(option => option.value === campo.ordenacao)}
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b border-custom-azul text-sm">
                                                <input
                                                    type={getInputType(campo.type)}
                                                    value={campo.valor}
                                                    onChange={(e) => handleValorChange(campo.id, e.target.value)}
                                                    onKeyDown={(e) => handleValorKeyDown(campo.id, e)}
                                                    className="border border-custom-azul-escuro focus:ring-1 focus:ring-custom-azul-escuro rounded p-1 focus:outline-none w-full"
                                                    placeholder="Digite o valor"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Rodapé com Botões */}
                <div className="flex p-2 rounded-b-lg absolute bottom-0 w-full bg-white border-t border-gray-300 shadow-md justify-end">
                    {[
                        { onClick: onClose, bg: 'bg-[#6c757d]', label: 'Cancelar', hoverBg: '#495057' },
                        { onClick: handleSave, bg: 'bg-[#00AAB5]', label: 'Salvar', hoverBg: '#0A7F8E' },
                    ].map(({ onClick, bg, label, hoverBg }, idx) => (
                        <button
                            key={idx}
                            className={`font-bold ${bg} border-none text-white rounded-lg px-5 py-2.5 text-base cursor-pointer flex items-center justify-center transition-colors duration-300 mr-2`}
                            onClick={onClick}
                            aria-label={label}
                            title={label}
                            style={{ backgroundColor: bg, transition: 'background-color 0.3s' }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = hoverBg)}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = bg.replace('bg-[', '').replace(']', ''))}
                        >
                            {label}
                        </button>
                    ))}
                </div>


                {/* Modal de Alerta */}
                <ModalAlert
                    isOpen={modal.isOpen}
                    onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={handleConfirm}
                    type={modal.type}
                    message={modal.message}
                />
            </div>
        </div >
    );
}

ModalFiltro.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    })).isRequired,
    onSave: PropTypes.func,
};

export default ModalFiltro;