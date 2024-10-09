import React from "react";

function DataTable({
  hasData,
  columns,
  tableData,
  startIndex,
  endIndex,
  columnWidths,
  tableRef,
  totalizerResults,
}) {
  const renderTotalizer = () => {
    if (!totalizerResults || Object.keys(totalizerResults).length === 0)
      return null;

    return (
      <tfoot className="border-t border-black">
        <tr className="bg-custom-azul-claro text-center">
          <td className="p-2 border-t-2 border-black" colSpan={columns.length}>
            <table className="w-full ">
              <tbody>
                <tr>
                  <td className="text-left font-semibold text-custom-azul-escuro ">
                    TOTALIZADORES:
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr className="bg-custom-azul-claro text-center">
          {columns.map((column, index) => {
            const totalizerKey = Object.keys(totalizerResults).find((key) =>
              key.includes(column)
            );
            return (
              <td className="font-regular text-black pb-3" key={index}>
                {totalizerKey ? totalizerResults[totalizerKey] : ""}
              </td>
            );
          })}
        </tr>
      </tfoot>
    );
  };

  return (
    <div className="text-center w-[1200px]">
      <div className="border-2 border-neutral-600 my-3 w-10/12 mx-auto overflow-auto">
        <table ref={tableRef} className="w-full text-tiny">
          {hasData && (
            <thead className="bg-custom-azul-escuro text-white">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="p-2 border-b text-center"
                    style={{
                      resize: "horizontal",
                      overflow: "auto",
                      width: columnWidths[index] || "auto",
                    }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {hasData ? (
              tableData[0].values
                .slice(startIndex, endIndex)
                .map((_, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="p-2 border-b text-center">
                        {tableData[colIndex]?.values[startIndex + rowIndex]}
                      </td>
                    ))}
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-2 text-center">
                  Nenhum dado encontrado.
                </td>
              </tr>
            )}
          </tbody>
          {renderTotalizer()}
        </table>
      </div>
    </div>
  );
}

export default DataTable;
