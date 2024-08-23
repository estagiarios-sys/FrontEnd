import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function TabelaCampos({ onDataChange }) {
  const [jsonData, setJsonData] = useState({});
  const [relationships, setRelationships] = useState([]);
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState('');
  const [selectedCampos, setSelectedCampos] = useState([]);

  useEffect(() => {
    async function fetchJsonData() {
      try {
        const response = await fetch('http://localhost:8080/procurar/table', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error('Erro ao buscar os dados do JSON:', error);
      }
    }

    async function fetchRelationships() {
      try {
        const response = await fetch('http://localhost:8080/procurar/relationship', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        setRelationships(data); 
      } catch (error) {
        console.error('Erro ao buscar as relações:', error);
      }
    }

    fetchJsonData();
    fetchRelationships();
  }, []);

  const tabelas = Object.keys(jsonData);

  useEffect(() => {
    onDataChange({ tabela: selectedTabela, relacionada: selectedRelacionada, campos: selectedCampos });
  }, [selectedTabela, selectedRelacionada, selectedCampos, onDataChange]);

  const tabelaOptions = tabelas.map(tabela => ({
    value: tabela,
    label: tabela,
  }));

  const campoOptions = [];

  // Adiciona campos da tabela selecionada
  if (selectedTabela && jsonData[selectedTabela]) {
    jsonData[selectedTabela].forEach(campo => {
      campoOptions.push({ value: `${selectedTabela}.${campo}`, label: `${selectedTabela} - ${campo}` });
    });
  }

  // Adiciona campos das tabelas relacionadas
  if (selectedRelacionada && selectedTabela) {
    relationships
      .filter(rel => rel.tabelas.includes(selectedTabela) && rel.tabelas.includes(selectedRelacionada))
      .forEach(rel => {
        const [table1, table2] = rel.tabelas.split(' e ');
        const relatedTable = table1 === selectedTabela ? table2 : table1;

        if (jsonData[relatedTable]) {
          jsonData[relatedTable].forEach(campo => {
            campoOptions.push({ value: `${relatedTable}.${campo}`, label: `${relatedTable} - ${campo}` });
          });
        }
      });
  }

  const relacionadaOptions = selectedTabela
    ? relationships
        .filter(rel => rel.tabelas.includes(selectedTabela))  
        .map(relacionada => ({
          value: relacionada.tabelas.replace(selectedTabela, '').replace(' e ', '').trim(),
          label: relacionada.tabelas.replace(selectedTabela, '').replace(' e ', '').trim(),
        }))
    : [];

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
            placeholder="Selecione uma relação..."
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
            options={[...new Set(campoOptions)]} // Remove campos duplicados
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
