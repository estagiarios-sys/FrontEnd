import React, { useEffect, useState } from "react";
import Select, { components } from 'react-select';

const campoOptions = [
    { value: 'campo1', label: 'Campo 1' },
    { value: 'campo2', label: 'Campo 2' },
    { value: 'campo3', label: 'Campo 3' },
    { value: 'campo4', label: 'Campo 4' },
    { value: 'campo5', label: 'Campo 5' },
    { value: 'campo6', label: 'Campo 6' },
    { value: 'campo7', label: 'Campo 7' },
    { value: 'campo8', label: 'Campo 8' },
];

const relacaoOptions = [
    { value: 'igual', label: 'Igual' },
    { value: 'diferente', label: 'Diferente' },
];

const ordenacaoOptions = [
    { value: 'asc', label: 'x' },
    { value: 'desc', label: 'y' },
];

const CustomOption = (props) => (
    <components.Option {...props}>
        <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
            style={{ marginRight: '10px' }}
        />
        {props.label}
    </components.Option>
);

const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
        <div>{props.data.label}</div>
    </components.SingleValue>
);

function ModalCondicao({ isOpen, onClose }) {
    const [selectedCampos, setSelectedCampos] = useState([]); // Campos selecionados para adicionar
    const [addedCampos, setAddedCampos] = useState([]); // Campos já adicionados à seção "Campos Selecionados e Condições"

    const handleCampoChange = (selectedOptions) => {
        setSelectedCampos(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleAddSelectedCampos = () => {
        const camposToAdd = selectedCampos.map(value => {
            const option = campoOptions.find(option => option.value === value);
            return { value: option.value, label: option.label };
        });
        setAddedCampos([...addedCampos, ...camposToAdd]);
        setSelectedCampos([]);
    };

    const handleRemoveSelectedCampos = () => {
        setAddedCampos(prevCampos => prevCampos.filter(campo => !selectedCampos.includes(campo.value)));
    };

    const handleRemoveAllCampos = () => {
        setAddedCampos([]);
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
            e.target.blur(); // Remove o foco do input
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
                                components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                                className="basic-multi-select"
                                classNamePrefix="Select"
                                placeholder="Selecione..."
                                onChange={handleCampoChange}
                                value={campoOptions.filter(option => selectedCampos.includes(option.value))}
                                closeMenuOnSelect={false} // Mantém o menu aberto após selecionar uma opção
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
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
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
                                                Condição
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
                                                    />
                                                </td>
                                                <td className="py-2 px-4 border-b border-gray-300 text-sm">
                                                    <input
                                                        type="text"
                                                        value={campo.valor || ''} // Use the value from your state or default to an empty string
                                                        onChange={(e) => handleValorChange(index, e.target.value)} // Function to handle value changes
                                                        onKeyDown={(e) => handleValorKeyDown(index, e)}
                                                        className="form-input w-3/4 border border-gray-300 rounded-md"
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
                        onClick={() => alert('Gravar clicado')}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalCondicao;