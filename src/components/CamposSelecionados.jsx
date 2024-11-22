import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Campo from './Campos/Campo';
import { ordenacaoOptions, getFilteredTotalizerOptions } from './Campos/Options';
import {
  getTotalizers,
  getSelectedCampos,
  removeSelectedTotalizers,
  resetTotalizers,
  setExportedSelectedCampos,
  setTotalizers
} from '../utils/totalizers';

function CamposSelecionados({
  selectedCampos = [],
  onDragEnd,
  handleCheckboxChange,
  checkedCampos = [],
  onSelectedCamposChange,
  mainRequestLoaded,
}) {
  setExportedSelectedCampos(selectedCampos);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openSelect, setOpenSelect] = useState(null);
  const selectRefs = useRef({});
  const selectTotalizerRefs = useRef({});

  const resetSelectedCampos = () => {
    onSelectedCamposChange([]);
  };

  useEffect(() => {
    if (mainRequestLoaded) {
      resetSelectedCampos();

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
        setTotalizers(mainRequestLoaded.totalizers);
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
      getTotalizers()[campo.value] = selectedOption.value;
    } else {
      delete getTotalizers()[campo.value];
    }
  };

  const handleOrderBySave = (selectedOption, fieldName) => {
    const newOrder = selectedOption ? `${fieldName} ${selectedOption.value}` : '';
    sessionStorage.setItem('orderByString', newOrder);
    setSelectedOrder(selectedOption ? { fieldName, value: selectedOption.value } : null);
  };

  const handleTdClick = (campo) => {
    const isOpen = openSelect === campo;
    setOpenSelect(isOpen ? null : campo);
    if (selectRefs.current[campo] && !isOpen) {
      selectRefs.current[campo].openMenu();
    }
  };

  const handleTotalizerClick = (campo) => {
    const isOpen = openSelect === campo;
    setOpenSelect(isOpen ? null : campo);
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
          apelido: inputValue + '',
        };
      }
      return selectedCampo;
    });

    onSelectedCamposChange(updatedCampos);
  };

  const showCheckboxColumn = selectedCampos.length > 0;

  const handleScroll = () => {
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
    setOpenSelect(null);
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
                    <Campo
                      key={value}
                      value={value}
                      type={type}
                      apelido={apelido}
                      index={index}
                      selectedOrder={selectedOrder}
                      totalizers={getTotalizers()}
                      checkedCampos={checkedCampos}
                      handleCheckboxChange={handleCheckboxChange}
                      handleCustomNameChange={handleCustomNameChange}
                      handleOrderBySave={handleOrderBySave}
                      handleTotalizerSave={handleTotalizerSave}
                      handleTdClick={handleTdClick}
                      handleTotalizerClick={handleTotalizerClick}
                      selectRefs={selectRefs}
                      selectTotalizerRefs={selectTotalizerRefs}
                      ordenacaoOptions={ordenacaoOptions}
                      getFilteredTotalizerOptions={getFilteredTotalizerOptions}
                      openSelect={openSelect}
                    />
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
export { getTotalizers, getSelectedCampos, removeSelectedTotalizers, resetTotalizers };
