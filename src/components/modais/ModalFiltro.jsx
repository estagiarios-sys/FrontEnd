import React, { useEffect, useState } from "react";
import Select, { components } from 'react-select';

const ordenacaoOptions = [
    { value: '>', label: 'Maior' },
    { value: '<', label: 'Menor' },
    { value: '=', label: 'Igual' },
    { value: '>=', label: 'Maior ou igual' },
    { value: '<=', label: 'Menor ou igual' },
    { value: '!=', label: 'Diferente' },
];

const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
        <div>{props.data.label}</div>
    </components.SingleValue>
);

function ModalFiltro({ isOpen, onClose, columns, onSave }) {
    const [selectedCampos, setSelectedCampos] = useState([]);
    const [addedCampos, setAddedCampos] = useState([]);
    
    const campoOptions = columns.map(col => ({
        value: col,
        label: col,
    }));

    const handleCampoChange = (selectedOptions) => {
        setSelectedCampos(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleAddSelectedCampos = () => {
        const camposToAdd = selectedCampos.map(value => {
            const option = campoOptions.find(option => option.value === value);
            return { value: option.value, label: option.label, checked: false };
        });
        setAddedCampos([...addedCampos, ...camposToAdd]);
        setSelectedCampos([]);
    };

    const handleRemoveAllCampos = () => {
        setAddedCampos([]);
        if (onSave) {
            onSave("");
        }
    };

    const handleCheckboxChange = (index) => {
        setAddedCampos(prevCampos => {
            const updatedCampos = [...prevCampos];
            updatedCampos[index].checked = !updatedCampos[index].checked;
            return updatedCampos;
        });
    };

    const handleRemoveCheckedCampos = () => {
        setAddedCampos(prevCampos => prevCampos.filter(campo => !campo.checked));
        if (onSave) {
            onSave('');
        }
    };

    const handleValorChange = (index, value) => {
        const updatedCampos = [...addedCampos];
        updatedCampos[index].valor = value;
        setAddedCampos(updatedCampos);
    };

    const handleValorKeyDown = (index, e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleValorChange(index, e.target.value);
            e.target.blur();
        }
    };

    const handleOrdenacaoChange = (index, selectedOption) => {
        const updatedCampos = [...addedCampos];
        updatedCampos[index].ordenacao = selectedOption ? selectedOption.value : '';
        setAddedCampos(updatedCampos);
    };

    const handleSave = () => {
        const condicoes = addedCampos.map((campo) => {
            const valor = campo.valor || '';
            const ordenacao = campo.ordenacao || '';

            console.log(campo);

            if (campo.valor === undefined || campo.ordenacao === undefined || campo.valor === '' || campo.ordenacao === '') {
                alert('Preencha todos os campos');
                return;
            }else{
                alert('Filtro salvo com sucesso');
                return `${campo.value} ${ordenacao} '${valor}'`;
            }
        });

        const condicoesString = `${condicoes.join( ' AND ')}`;

        // Chama a função onSave do componente pai com o condicoesString
        if (onSave) {
            onSave(condicoesString);
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

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-1000">
            <div className="bg-white p-0 rounded-md relative w-[1300px] h-[600px] flex flex-col">
                <div className="w-full bg-neutral-500 flex flex-row justify-between text-white p-5">
                    <button
                        className="font-bold mx-2 bg-white bg-opacity-50 border border-gray-300 rounded-md w-[60px] h-[30px] flex justify-center items-center text-[16px] cursor-pointer absolute top-[10px] right-[10px] z-[1001]"
                        onClick={onClose}>
                        X
                    </button>
                    <h5 className="font-bold mx-2 text-2xl">Filtros</h5>
                </div>

                <div style={{ display: 'flex', flex: 1, margin: '30px' }}>
                    <div style={{ flex: 1, marginRight: '20px', overflowY: 'auto' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h6 className="font-bold p-1">Campos</h6>
                            <Select
                                isMulti
                                name="campos"
                                options={campoOptions}
                                components={{ SingleValue: CustomSingleValue }}
                                className="basic-multi-select"
                                classNamePrefix="Select"
                                placeholder="Selecione..."
                                onChange={handleCampoChange}
                                value={campoOptions.filter(option => selectedCampos.includes(option.value))}
                                closeMenuOnSelect={false}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '0 20px' }}>
                        <button
                            onClick={handleRemoveCheckedCampos}
                            className='rounded-full bg-neutral-300 w-10 h-10 my-3 flex justify-center items-center'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={handleAddSelectedCampos}
                            className='rounded-full bg-neutral-300 w-10 h-10 my-3 flex justify-center items-center'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                        <button
                            onClick={handleRemoveAllCampos}
                            className='rounded-full bg-red-700 w-10 h-10 my-3 flex justify-center items-center'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                    </div>

                    <div style={{ flex: 2, overflowY: 'auto', margin: '0px 0px 0px 30px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h6 className="font-bold p-1">Campos Selecionados e Condições</h6>
                            <div style={{ maxHeight: '322.4px', overflowY: 'auto' }}>
                                <table className="min-w-full bg-white border border-gray-300" style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                                                Nada
                                            </th>
                                            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                                                Campos
                                            </th>
                                            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                                                Ordenação
                                            </th>
                                            <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">
                                                Valor
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {addedCampos.map((campo, index) => (
                                            <tr key={index}>
                                                <td className="py-2 px-4 border-b border-gray-300 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        className="form-checkbox h-5 w-5 text-red-600"
                                                        checked={campo.checked || false}
                                                        onChange={() => handleCheckboxChange(index)}
                                                    />
                                                </td>
                                                <td className="py-2 px-4 border-b border-gray-300 text-sm">
                                                    {campo.label}
                                                </td>
                                                <td className="py-2 px-4 border-b border-gray-300 text-sm">
                                                    <Select
                                                        options={ordenacaoOptions}
                                                        className="basic-single"
                                                        classNamePrefix="Select"
                                                        placeholder="Selecione..."
                                                        menuPortalTarget={document.body}
                                                        onChange={(selectedOption) => handleOrdenacaoChange(index, selectedOption)}
                                                    />
                                                </td>
                                                <td className="py-2 px-4 border-b border-gray-300 text-sm">
                                                    <input
                                                        type="text"
                                                        value={campo.valor || ''}
                                                        onChange={(e) => handleValorChange(index, e.target.value)}
                                                        onKeyDown={(e) => handleValorKeyDown(index, e)}
                                                        className="border border-gray-300 rounded p-1 w-full"
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
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 20px 20px 20px' }}>
                    <button
                        style={{
                            backgroundColor: '#6c757d',
                            border: 'none',
                            color: '#fff',
                            borderRadius: '5px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginRight: '10px',
                        }}
                        onClick={onClose}
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
                        onClick={handleSave}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalFiltro;
