import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import Campo from './Campos/Campo';
import { ordenacaoOptions, TotalizerOptions, getFilteredTotalizerOptions } from './Campos/Options'; // Presumindo que você separou essas opções em outro arquivo

let exportedSelectedCampos = [];

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
        localStorage.setItem('orderByString', orderByString);
      } else {
        setSelectedOrder(null);
        localStorage.removeItem('orderByString');
      }

      if (mainRequestLoaded.totalizers) {
        totalizers = mainRequestLoaded.totalizers;
      }
    }
  }, [mainRequestLoaded]);

  useEffect(() => {
    if (localStorage.getItem('orderByString') === '') {
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
                    <Campo
                      key={value}
                      value={value}
                      type={type}
                      apelido={apelido}
                      index={index}
                      selectedOrder={selectedOrder}
                      totalizers={totalizers}
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

export const getSelectedCampos = () => {
  return exportedSelectedCampos;
};

export default CamposSelecionados;
