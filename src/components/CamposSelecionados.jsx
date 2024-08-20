import React from 'react';

function CamposSelecionados({ selectedData }) {
  return (
    <div className="mr-32">
      <table className="table-auto text-neutral-600">
        <thead className="bg-neutral-300">
          <tr>
            <th scope="col" className="border-2 border-x-2 w-4/5">Campo</th>
            <th scope="col" className="w-96">Ordem</th>
          </tr>
        </thead>
        <tbody className="text-left">
          {selectedData.campos.map((name, index) => (
            <tr key={index} className="border-2">
              <th scope="row" className="border-2 p-2">{name}</th>
              <td>
                <select name="ordem" id={`ordem-${index}`} className="w-24 p-2">
                  <option value="asc">Ascendente</option>
                  <option value="desc">Descendente</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CamposSelecionados;
