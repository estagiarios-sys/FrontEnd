import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CustomSelect from './genericos/CustomSelect';

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

let totalizers = {};

export function removeSelectedTotalizers(camposParaRemover) {

  console.log('camposParaRemover', camposParaRemover);

  camposParaRemover.forEach((campo) => {
    console.log('campo removido asadasdasdads', campo);
    const campoSemApelido = campo.replace(/\s+as\s+.*$/, ''); // Remove o apelido do campo
    delete totalizers[campoSemApelido];
  });
  console.log('totalizadorString', totalizers);
}

export function resetTotalizers() {
  totalizers = {};
  console.log('totalizadorString', totalizers);
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
  const selectedCamposSemApelido = selectedCampos.map((campo) => campo.replace(/\s+as\s+.*$/, ''));
  const [selectedOrder, setSelectedOrder] = useState(null); // Estado para a seleção atual
  const [customNames, setCustomNames] = useState({}); // Estado para os nomes personalizados
  const selectRefs = useRef({}); // Referências para os componentes CustomSelect

  const handleTotalizerSave = (selectedOption, campo) => {

    const campoSemApelido = campo.replace(/\s+as\s+.*$/, ''); // Remove o apelido do campo
    
    if (selectedOption) {
      // Se uma opção for selecionada, adiciona ou atualiza o totalizador no objeto
      totalizers[campoSemApelido] = selectedOption.value;
    } else {
      // Se a opção for desmarcada (ou seja, o totalizador foi removido), remove o campo do objeto
      delete totalizers[campoSemApelido];
    }

    console.log('totalizadorString', totalizers);
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
        return value ? `${campoSemApelido} as '${value} '` : campoSemApelido;
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
            className="w-[596px] min-w-full border-2 border-custom-azul-escuro"
          >
            <thead>
              <tr className="bg-custom-azul-escuro text-white ">
                <th className="py-2 px-4 text-sm w-[60px]"></th>
                <th className="py-2 px-4 text-sm w-[216px]">Campo</th>
                <th className="py-2 px-4 text-sm w-[193px]">Ordem</th>
                <th className="py-2 px-4 text-sm w-[241px]">Totalizador</th>
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
                        className="bg-white hover:bg-gray-70"
                      >
                        {showCheckboxColumn && (
                          <td className="py-2 px-4 border-b border-custom-azul text-sm">
                            <input
                              type="checkbox"
                              checked={checkedCampos.includes(campo)}
                              onChange={() => handleCheckboxChange(campo)}
                              className="form-checkbox h-5 w-5 accent-custom-azul-escuro"
                            />
                          </td>
                        )}
                        <td className="py-2 px-4 border-b border-custom-azul text-sm">
                          <input
                            type="text"
                            onBlur={(e) => handleCustomNameChange(e, campo)}
                            className="border border-custom-azul-escuro focus:ring-1 focus:ring-custom-azul-escuro rounded p-1 focus:outline-none"
                            placeholder={campo}
                          />
                        </td>
                        <td
                          className="py-2 px-4 border-b border-custom-azul text-sm"
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
                            width="9rem"
                            isClearable
                          />
                        </td>
                        <td
                          className="py-2 px-4 border-b border-custom-azul text-sm"
                        >
                          <CustomSelect
                            options={TotalizerOptions}
                            onChange={(selectedOption) => handleTotalizerSave(selectedOption, campo)}
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
                  <td colSpan={showCheckboxColumn ? 3 : 2} className="py-2 px-4 border-b border-gray-300 text-sm text-gray-500 whitespace-nowrap">
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
