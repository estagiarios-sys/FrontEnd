import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function TabelaCampos({ onDataChange }) {
  const [jsonData, setJsonData] = useState({});
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState('');
  const [selectedCampos, setSelectedCampos] = useState([]);

  useEffect(() => {
    async function fetchJsonData() {
      try {
        const response = await fetch('http://localhost:8080/procurar/tabela', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);

        setJsonData(data);
      } catch (error) {
        console.error('Erro ao buscar os dados do JSON:', error);
      }
    }

    fetchJsonData();
  }, []);

  const tabelas = Object.keys(jsonData); // Obtenha os nomes das tabelas a partir do JSON

  useEffect(() => {
    onDataChange({ tabela: selectedTabela, relacionada: selectedRelacionada, campos: selectedCampos });
  }, [selectedTabela, selectedRelacionada, selectedCampos, onDataChange]);

  
  const tabelaOptions = tabelas.map(tabela => ({
    value: tabela,
    label: tabela,
  }));

  
  const campoOptions = selectedTabela && jsonData[selectedTabela]
    ? jsonData[selectedTabela].map(campo => ({ value: campo, label: campo }))
    : [];

  
  const relacionadaOptions = [
    { value: 'relacionada1', label: 'Relacionada 1' },
    { value: 'relacionada2', label: 'Relacionada 2' }
  ];

  return (
    <div className="flex flex-col justify-start items-start ml-20">
      <div className="mt-5">
        <label htmlFor="tabelas">Tabela</label>
        <div>
          <Select
            name="tabelas"
            options={tabelaOptions}
            className="basic-single w-60"
            classNamePrefix="Select"
            placeholder="Selecione uma tabela..."
            onChange={(selectedOption) => {
              setSelectedTabela(selectedOption ? selectedOption.value : '');
              setSelectedRelacionada('');  
              setSelectedCampos([]);
            }}
            value={tabelaOptions.find(option => option.value === selectedTabela)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="relacionadas">Relacionadas</label>
        <div>
          <Select
            name="relacionadas"
            options={relacionadaOptions}
            className="basic-single w-60"
            classNamePrefix="Select"
            placeholder="Selecione outra tabela..."
            onChange={(selectedOption) => {
              setSelectedRelacionada(selectedOption ? selectedOption.value : '');
            }}
            value={relacionadaOptions.find(option => option.value === selectedRelacionada)}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="campos">Campos</label>
        <div>
          <Select
            isMulti
            name="campos"
            options={campoOptions}
            className="basic-multi-select w-60"
            classNamePrefix="Select"
            placeholder="Selecione os Campos..."
            onChange={(selectedOptions) => {
              setSelectedCampos(selectedOptions ? selectedOptions.map(option => option.value) : []);
            }}
            value={campoOptions.filter(option => selectedCampos.includes(option.value))}
          />
        </div>
      </div>
    </div>
  );
}

export default TabelaCampos;
