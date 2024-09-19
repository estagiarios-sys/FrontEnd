import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CustomSelect from './genericos/CustomSelect';
import { type } from '@testing-library/user-event/dist/type';

const ordenacaoOptions = [
  { value: 'ASC', label: 'ASC' },
  { value: 'DESC', label: 'DESC' },
];

const TotalizerOptions = [
  { value: 'COUNT', label: 'CONTAGEM' },
  { value: 'SUM', label: 'SOMA' },
  { value: 'AVG', label: 'MÉDIA' },
  { value: 'MIN', label: 'MÍNIMO' },
  { value: 'MAX', label: 'MÁXIMO' },
];

const getFilteredTotalizerOptions = (type) => {
  switch (type) {
    case 'TINYINT UNSIGNED':
    case 'TINYINT':
    case 'INT':
    case 'FLOAT':
    case 'DOUBLE':
    case 'DECIMAL':
      return TotalizerOptions;
    case 'VARCHAR':
    case 'TEXT':
    case 'CHAR':
      return TotalizerOptions.filter(option => option.value === 'COUNT');
    default:
      return [];
  }
};

let totalizers = [];

export function removeSelectedTotalizers(camposParaRemover) {
  camposParaRemover.forEach((campo) => {
    const campoSemApelido = campo.replace(/\s+as\s+.*$/, ''); // Remove o apelido do campo
    delete totalizers[campoSemApelido];
  });
}

export function resetTotalizers() {
  totalizers = {};
}

export function getTotalizers() {
  return totalizers;
}

function CamposSelecionados({
  selectedCampos = [],
  onDragEnd,
  handleCheckboxChange,
  checkedCampos = [],
  onSelectedCamposChange,
}) {
  const selectedCamposSemApelido = selectedCampos.map((campo) => ({
    value: campo.value.replace(/\s+as\s+.*$/i, ''),
    type: campo.type  // Mantém o tipo original
  }));
  const [selectedOrder, setSelectedOrder] = useState(null);
  const selectRefs = useRef({});
  const selectTotalizerRefs = useRef({});
  
  const handleTotalizerSave = (selectedOption, campo) => {
  const campoSemApelido = campo.value.replace(/\s+as\s+.*$/, '');

    if (selectedOption) {
      totalizers[campoSemApelido] = selectedOption.value;
    } else {
      delete totalizers[campoSemApelido];
    }
  };

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

  const handleTotalizerClick = (campo) => {
    if (selectTotalizerRefs.current[campo]) {
      selectTotalizerRefs.current[campo].openMenu(); // Abre o menu do CustomSelect
    }
  };

  const handleCustomNameChange = (event, campo) => {
    let { value } = event.target;

    if (value.length > 40) {
      value = value.substring(0, 40);
    }

    const updatedCampos = selectedCampos.map((selectedCampo) => {
      
      if (selectedCampo && selectedCampo.value && campo && campo.value) {
        const campoSemApelidoComparacao = selectedCampo.value.replace(/\s+as\s+.*$/i, '');
        const campoSemApelido = campo.value.replace(/\s+as\s+.*$/i, '');
    
        if (campoSemApelidoComparacao === campoSemApelido) {
          return {
            value: value ? `${campoSemApelido} as '${value} '` : campoSemApelido,
            type: selectedCampo.type
          };
        }
      return selectedCampo;
    });

    onSelectedCamposChange(updatedCampos);
  };

  const showCheckboxColumn = selectedCampos.length > 0;

  const handleScroll = () => {
    // Fecha todos os menus abertos do CustomSelect
    Object.values(selectRefs.current).forEach((ref) => {
      if (ref && ref.closeMenu) {
        ref.closeMenu();
      }
    });
    Object.values(selectTotalizerRefs.current).forEach((ref) => {
      if (ref && ref.closeMenu) {
        ref.closeMenu();
      }
    });
  };

  return (
    <div
      style={{ maxHeight: '280px', overflowY: 'auto', position: 'relative' }}
      onScroll={handleScroll}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" type="list" direction="vertical">
          {(provided) => (
            <table
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-auto min-w-full border-2 border-custom-azul-escuro"
            >
              <thead className="bg-custom-azul-escuro text-white sticky top-0 z-10">
                <tr className="bg-custom-azul-escuro text-white ">
                  <th className=" resize-y py-2 px-4 text-sm w-[60px]"></th>
                  <th className="py-2 px-4 text-sm w-[216px]">Campo</th>
                  <th className="py-2 px-4 text-sm w-[193px]">Ordem</th>
                  <th className="py-2 px-4 text-sm w-[241px]">Totalizador</th>
                </tr>
              </thead>
              <tbody>
                {selectedCamposSemApelido.length > 0 ? (
                  selectedCamposSemApelido.map(({ value, type }, index) => (
                    <Draggable key={value} draggableId={value} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white hover:bg-gray-70"
                        >
                          {showCheckboxColumn && (
                            <td className="py-2 px-4 border-b border-custom-azul text-sm">
                              <input
                                type="checkbox"
                                checked={checkedCampos.includes(value)}
                                onChange={() => handleCheckboxChange(value)}
                                className="form-checkbox h-5 w-5 accent-custom-azul-escuro"
                              />
                            </td>
                          )}
                          <td className="py-2 px-4 border-b border-custom-azul text-sm">
                            <input
                              type="text"
                              onBlur={(e) => handleCustomNameChange(e, { value })}
                              className="border border-custom-azul-escuro focus:ring-1 focus:ring-custom-azul-escuro rounded p-1 focus:outline-none"
                              placeholder={value}
                            />
                          </td>
                          <td
                            className="py-2 px-4 border-b border-custom-azul text-sm"
                            onClick={() => handleTdClick(value)}
                          >
                            <CustomSelect
                              ref={(ref) => (selectRefs.current[value] = ref)}
                              options={ordenacaoOptions}
                              value={
                                selectedOrder && selectedOrder.fieldName === value
                                  ? { value: selectedOrder.value, label: selectedOrder.value }
                                  : null
                              }
                              onChange={(selectedOption) => handleOrderBySave(selectedOption, value)}
                              placeholder="Selecione..."
                              className="basic-single"
                              classNamePrefix="select"
                              width="9rem"
                              isClearable
                            />
                          </td>
                          <td
                            className="py-2 px-4 border-b border-custom-azul text-sm"
                            onClick={() => handleTotalizerClick(value)}
                          >
                            <CustomSelect
                              ref={(ref) => (selectTotalizerRefs.current[value] = ref)}
                              options={getFilteredTotalizerOptions(type)}
                              onChange={(selectedOption) => handleTotalizerSave(selectedOption, { value })}
                              placeholder="Selecione..."
                              className="basic-single"
                              classNamePrefix="select"
                              width="12rem"
                              isClearable
                            />
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={showCheckboxColumn ? 3 : 2}
                      className="py-2 px-4 border-b border-gray-300 text-sm text-gray-500 whitespace-nowrap"
                    >
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
    </div>
  );
}

export default CamposSelecionados;
