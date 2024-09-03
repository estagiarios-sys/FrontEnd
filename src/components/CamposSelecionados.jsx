import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CustomSelect from './genericos/CustomSelect';

const ordenacaoOptions = [
  { value: 'ASC', label: 'ASC' },
  { value: 'DESC', label: 'DESC' },
];

function CamposSelecionados({
  selectedCampos = [],
  onDragEnd,
  handleCheckboxChange,
  checkedCampos = [],
  onSelectedCamposChange,
}) {
  const selectedCamposSemApelido = selectedCampos.map((campo) => campo.replace(/\s+as\s+.*$/, ''));
  const [selectedOrder, setSelectedOrder] = useState(null); // Estado para a seleção atual
  const [customNames, setCustomNames] = useState({}); // Estado para os nomes personalizados
  const selectRefs = useRef({}); // Referências para os componentes CustomSelect

  const handleOrderBySave = (selectedOption, fieldName) => {
    const newOrder = selectedOption ? `${fieldName} ${selectedOption.value}` : '';
    localStorage.setItem('orderByString', newOrder);

    setSelectedOrder(selectedOption ? { fieldName, value: selectedOption.value } : null);
  };

  const handleTdClick = (campo) => {
    if (selectRefs.current[campo]) {
      selectRefs.current[campo].openMenu(); // Abre o menu do CustomSelect
    }
  };

  const handleCustomNameChange = (event, campo) => {
    let { value } = event.target;

    if (value.length > 40) {
      value = value.substring(0, 40);
    }

    setCustomNames((prevCustomNames) => ({
      ...prevCustomNames,
      [campo]: value,
    }));
  
    const updatedCampos = selectedCampos.map((selectedCampo) => {

      const campoSemApelidoComparacao = selectedCampo.replace(/\s+as\s+.*$/, '');
      const campoSemApelido = campo.replace(/\s+as\s+.*$/, '');

      if (campoSemApelidoComparacao === campoSemApelido) {
        return value ? `${campoSemApelido} as '${value}'` : campoSemApelido;
      } else {
        return selectedCampo;
      }
    });
  
    onSelectedCamposChange(updatedCampos);
  };

  const showCheckboxColumn = selectedCampos.length > 0;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" type="list" direction="vertical">
        {(provided) => (
          <table
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-w-full bg-gray-100"
          >
            <thead>
              <tr className="bg-gray-200">
                {showCheckboxColumn && (
                  <th className="py-2 px-4 border-b border-gray-300 text-sm">"Nada"</th>
                )}
                <th className="py-2 px-4 border-b border-gray-300 text-sm">Campo</th>
                <th className="py-2 px-4 border-b border-gray-300 text-sm">Apelido</th>
                <th className="py-2 px-4 border-b border-gray-300 text-sm">Ordem</th>
              </tr>
            </thead>
            <tbody>
              {selectedCamposSemApelido.length > 0 ? (
                selectedCamposSemApelido.map((campo, index) => (
                  <Draggable key={campo} draggableId={campo} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white hover:bg-gray-50"
                      >
                        {showCheckboxColumn && (
                          <td className="py-2 px-4 border-b border-gray-300 text-sm">
                            <input
                              type="checkbox"
                              checked={checkedCampos.includes(campo)}
                              onChange={() => handleCheckboxChange(campo)}
                              className="form-checkbox h-5 w-5 text-red-600"
                            />
                          </td>
                        )}
                        <td className="py-2 px-4 border-b border-gray-300 text-sm">{campo}</td>
                        <td className="py-2 px-4 border-b border-gray-300 text-sm">
                          <input
                            type="text"
                            onBlur={(e) => handleCustomNameChange(e, campo)}
                            className="border border-gray-300 rounded p-1"
                            placeholder={campo}
                          />
                        </td>
                        <td
                          className="py-2 px-4 border-b border-gray-300 text-sm"
                          onClick={() => handleTdClick(campo)}
                        >
                          <CustomSelect
                            ref={(ref) => (selectRefs.current[campo] = ref)}
                            options={ordenacaoOptions}
                            value={
                              selectedOrder && selectedOrder.fieldName === campo
                                ? { value: selectedOrder.value, label: selectedOrder.value }
                                : null
                            }
                            onChange={(selectedOption) => handleOrderBySave(selectedOption, campo)}
                            placeholder="Selecione..."
                            className="basic-single"
                            classNamePrefix="select"
                            isClearable
                          />
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))
              ) : (
                <tr>
                  <td colSpan={showCheckboxColumn ? 3 : 2} className="py-2 px-4 border-b border-gray-300 text-sm text-gray-500">
                    Nenhum campo selecionado
                  </td>
                </tr>
              )}
              {provided.placeholder}
            </tbody>
          </table>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default CamposSelecionados;
