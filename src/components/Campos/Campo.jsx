import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import OrdenacaoSelect from './OrdenacaoSelect';
import TotalizadorSelect from './TotalizadorSelect';

const Campo = ({
  value,
  type,
  apelido,
  index,
  selectedOrder,
  totalizers,
  checkedCampos,
  handleCheckboxChange,
  handleCustomNameChange,
  handleOrderBySave,
  handleTotalizerSave,
  handleTdClick,
  handleTotalizerClick,
  selectRefs,
  selectTotalizerRefs,
  ordenacaoOptions,
  getFilteredTotalizerOptions,
  openSelect,
}) => {
  return (
    <Draggable key={value} draggableId={value} index={index}>
      {(provided) => (
        <tr
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white hover:bg-gray-70"
        >
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
          <OrdenacaoSelect
            ref={(ref) => (selectRefs.current[value] = ref)}
            value={selectedOrder && selectedOrder.fieldName === value ? { value: selectedOrder.value, label: selectedOrder.value } : null}
            onChange={(selectedOption) => handleOrderBySave(selectedOption, value)}
            options={ordenacaoOptions}
            isOpen={openSelect === value}
            onClick={() => handleTdClick(value)}
          />
          <TotalizadorSelect
            ref={(ref) => (selectTotalizerRefs.current[value] = ref)}
            value={totalizers[value] ? getFilteredTotalizerOptions(type).find((option) => option.value === totalizers[value]) || null : null}
            onChange={(selectedOption) => handleTotalizerSave(selectedOption, { value })}
            options={getFilteredTotalizerOptions(type)}
            isOpen={openSelect === value}
            onClick={() => handleTotalizerClick(value)}
          />
        </tr>
      )}
    </Draggable>
  );
};

export default Campo;
