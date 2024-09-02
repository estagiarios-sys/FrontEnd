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
}) {
  const [selectedOrder, setSelectedOrder] = useState(null); // Estado para a seleção atual
  const selectRefs = useRef({}); // Referências para os componentes CustomSelect

  const handleOrderBySave = (selectedOption, fieldName) => {
    const newOrder = selectedOption ? `${fieldName} ${selectedOption.value}` : '';
    localStorage.setItem('orderByString', newOrder);

    // Atualiza o estado com a nova seleção e limpa as outras seleções
    setSelectedOrder(selectedOption ? { fieldName, value: selectedOption.value } : null);
  };

  const handleTdClick = (campo) => {
    // Simula o clique no CustomSelect para abrir o menu
    if (selectRefs.current[campo]) {
      selectRefs.current[campo].openMenu(); // Abre o menu do CustomSelect
    }
  };

  const showCheckboxColumn = selectedCampos.length > 0; // Verifica se a coluna "Nada" deve ser exibida

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
                <th className="py-2 px-4 border-b border-gray-300 text-sm">Ordem</th>
              </tr>
            </thead>
            <tbody>
              {selectedCampos.length > 0 ? (
                selectedCampos.map((campo, index) => (
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
