import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CustomSelect from './genericos/CustomSelect';

let exportedSelectedCampos = [];

// Suas opções de ordenação e totalizadores
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

// Função para obter opções filtradas
const getFilteredTotalizerOptions = (type) => {
  switch (type) {
    case 'NUMBER':
    case 'FLOAT':
    case 'DOUBLE':
    case 'BINARY_FLOAT':
    case 'BINARY_DOUBLE':
      return TotalizerOptions;
    case 'DATE':
    case 'VARCHAR2':
    case 'CLOB':
    case 'CHAR':
      return TotalizerOptions.filter(option => option.value === 'COUNT');
    default:
      return [];
  }
};

let totalizers = {};

export function removeSelectedTotalizers(camposParaRemover) {
  camposParaRemover.forEach((campo) => {
    delete totalizers[campo];
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
  mainRequestLoaded,
}) {
  exportedSelectedCampos = selectedCampos;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openSelect, setOpenSelect] = useState(null); // Para rastrear qual select está aberto
  const selectRefs = useRef({});
  const selectTotalizerRefs = useRef({});

  useEffect(() => {
    if (mainRequestLoaded) {
      if (mainRequestLoaded.orderBy) {
        const orderByString = mainRequestLoaded.orderBy;
        const [fieldName, orderDirection] = orderByString.trim().split(/\s+/);
        setSelectedOrder({ fieldName, value: orderDirection });
        sessionStorage.setItem('orderByString', orderByString);
      } else {
        setSelectedOrder(null);
        sessionStorage.removeItem('orderByString');
      }

      if (mainRequestLoaded.totalizers) {
        totalizers = mainRequestLoaded.totalizers;
      }
    }
  }, [mainRequestLoaded]);

  useEffect(() => {
    if (sessionStorage.getItem('orderByString') === '') {
      setSelectedOrder(null);
    }
  }, [selectedCampos]);

  const handleTotalizerSave = (selectedOption, campo) => {
    if (selectedOption) {
      totalizers[campo.value] = selectedOption.value;
    } else {
      delete totalizers[campo.value];
    }
  };

  const handleOrderBySave = (selectedOption, fieldName) => {
    const newOrder = selectedOption ? `${fieldName} ${selectedOption.value}` : '';
    sessionStorage.setItem('orderByString', newOrder);
    setSelectedOrder(selectedOption ? { fieldName, value: selectedOption.value } : null);
  };

  const handleTdClick = (campo) => {
    const isOpen = openSelect === campo;
    setOpenSelect(isOpen ? null : campo); // Fecha se já estiver aberto, ou abre se estiver fechado
    if (selectRefs.current[campo] && !isOpen) {
      selectRefs.current[campo].openMenu();
    }
  };

  const handleTotalizerClick = (campo) => {
    const isOpen = openSelect === campo;
    setOpenSelect(isOpen ? null : campo); // Fecha se já estiver aberto, ou abre se estiver fechado
    if (selectTotalizerRefs.current[campo] && !isOpen) {
      selectTotalizerRefs.current[campo].openMenu();
    }
  };

  const handleCustomNameChange = (event, campo) => {
    let inputValue = event.target.value;

    if (inputValue.length > 40) {
      inputValue = inputValue.substring(0, 40);
    }

    const updatedCampos = selectedCampos.map((selectedCampo) => {
      if (selectedCampo.value === campo.value) {
        return {
          ...selectedCampo,
          //DEIXAR O ESPAÇO NO FINAL PARA VOLTAR O VALOR CORRETO DO BANCO DE DADOS POSTERIORMENTE
          apelido: inputValue + ' ',
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
    setOpenSelect(null); // Reseta o estado
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
              className="w-auto min-w-full border-2 border-custom-azul-escuro border-t-0"
            >
              <thead className="bg-custom-azul-escuro text-white sticky top-0 z-10">
                <tr className="bg-custom-azul-escuro text-white ">
                  <th className="resize-y py-2 px-4 text-sm w-[60px]"></th>
                  <th className="py-2 px-4 text-sm w-[216px]">Campo</th>
                  <th className="py-2 px-4 text-sm w-[193px]">Ordem</th>
                  <th className="py-2 px-4 text-sm w-[241px]">Totalizador</th>
                </tr>
              </thead>
              <tbody>
                {selectedCampos.length > 0 ? (
                  selectedCampos.map(({ value, type, apelido }, index) => (
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
                                id={`checkbox-${value}`}
                                name={`checkbox-${value}`}
                                checked={checkedCampos.includes(value)}
                                onChange={() => handleCheckboxChange(value)}
                                className="form-checkbox h-5 w-5 accent-custom-azul-escuro"
                              />
                            </td>
                          )}
                          <td className="py-2 px-4 border-b border-custom-azul text-sm">
                            <input
                              type="text"
                              id={`input-${value}`}
                              name={`input-${value}`}
                              defaultValue={apelido || ''}
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
                              value={
                                totalizers[value]
                                  ? getFilteredTotalizerOptions(type).find(
                                    (option) => option.value === totalizers[value]
                                  ) || null
                                  : null
                              }
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

export const getSelectedCampos = () => {
  return exportedSelectedCampos;
};

export default CamposSelecionados;
