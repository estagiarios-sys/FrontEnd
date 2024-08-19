import React, { useState } from 'react';
import TabelaCampos from './TabelaCampos';
import GerarRelatorio from './GerarRelatorio';

function Relatorio() {
    const [selectedData, setSelectedData] = useState({
        tabela: '',
        relacionada: '',
        campos: []
    });

    const handleDataChange = (data) => {
        setSelectedData(data);
    };

    return (
        <div>
            <TabelaCampos onDataChange={handleDataChange} />
            <GerarRelatorio selectedData={selectedData} />
        </div>
    );
}

export default Relatorio;
