import React from 'react';

export default function Tabela({
    tableRef,
    tableData,
    renderTotalizer,
    columns, 
    hasData, 
    columnWidths, 
    startIndex, 
    endIndex
}) {
    return (
        <table ref={tableRef} className="w-full text-tiny">
            {hasData && (
                <thead className="bg-custom-azul-escuro text-white">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="p-2 border-b text-center"
                                style={{
                                    resize: 'horizontal',
                                    overflow: 'auto',
                                    width: columnWidths[index] || 'auto'
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
                    tableData[0].values.slice(startIndex, endIndex).map((_, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            {columns.map((column, colIndex) => (
                                <td
                                    key={colIndex}
                                    className="p-2 border-b text-center"
                                >
                                    {tableData[colIndex]?.values[startIndex + rowIndex]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="p-2 text-center">Nenhum dado encontrado.</td>
                    </tr>
                )}
            </tbody>
            {renderTotalizer()}
        </table>
    );
}



