import React from 'react';

function CamposSelecionados({ selectedCampos }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">Campo</th>
              <th className="py-2 px-4 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-600">Ordem</th>
            </tr>
          </thead>
          <tbody>
            {selectedCampos.length > 0 ? (
              selectedCampos.map((campo, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-300 text-sm">{campo}</td>
                  <td className="py-2 px-4 border-b border-gray-300 text-sm">
                    <select name="ordem" id="ordem">
                      <option value="ASC">ASC</option>
                      <option value="DESC">DESC</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b border-gray-300 text-sm text-gray-500">Nenhum campo selecionado</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CamposSelecionados;
