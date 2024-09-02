import React, { useState, useEffect, useMemo, useRef } from 'react';
import Select from 'react-select';
import './genericos/infoClick.css';
import './genericos/infoHover.css';

function TabelaCampos({ onDataChange }) {
  const [jsonData, setJsonData] = useState({});
  const [relationships, setRelationships] = useState([]);
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState('');
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  const dicaRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    async function fetchJsonData() {
      try {
        const response = await fetch('http://localhost:8080/find/table', {
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
        const response = await fetch('http://localhost:8080/find/relationship', {
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

  const campoOptions = useMemo(() => {
    const options = [];

    if (selectedTabela && jsonData[selectedTabela]) {
      jsonData[selectedTabela].forEach(campo => {
        options.push({ value: `${selectedTabela}.${campo}`, label: `${selectedTabela} - ${campo}` });
      });
    }

    if (selectedRelacionada && selectedTabela) {
      relationships
        .filter(rel => rel.tabelas.includes(selectedTabela) && rel.tabelas.includes(selectedRelacionada))
        .forEach(rel => {
          const [table1, table2] = rel.tabelas.split(' e ');
          const relatedTable = table1 === selectedTabela ? table2 : table1;

          if (jsonData[relatedTable]) {
            jsonData[relatedTable].forEach(campo => {
              options.push({ value: `${relatedTable}.${campo}`, label: `${relatedTable} - ${campo}` });
            });
          }
        });
    }

    // Remove duplicatas dos campos
    return [...new Set(options.map(option => option.value))].map(value => {
      const [table, campo] = value.split('.');
      return { value, label: `${table} - ${campo}` };
    });
  }, [selectedTabela, selectedRelacionada, jsonData, relationships]);

  const relacionadaOptions = useMemo(() => {
    return selectedTabela
      ? [...new Set(
        relationships
          .filter(rel => rel.tabelas.includes(selectedTabela))
          .flatMap(relacionada =>
            relacionada.tabelas.split(' e ')
              .filter(tabela => tabela !== selectedTabela)
          )
      )].map(value => ({
        value,
        label: value,
      }))
      : [];
  }, [selectedTabela, relationships]);

  useEffect(() => {
    const handleClearSelectedCampos = () => {
      setSelectedCampos([]);
    };

    window.addEventListener('clearSelectedCampos', handleClearSelectedCampos);

    return () => {
      window.removeEventListener('clearSelectedCampos', handleClearSelectedCampos);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dicaRef.current &&
        !dicaRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMostrarInfo(false); // Fecha o tooltip ao clicar fora
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col justify-start items-start ml-20">
      <div className="mt-5">
        <label htmlFor="tabelas">Tabela</label>
        <div className="containerClick">
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
          <div id='info-click' className={mostrarInfo ? 'right show' : 'right'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => setMostrarInfo(prev => !prev)} ref={buttonRef}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.1" stroke="currentColor" className="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </button>
            <div className='info-texto'>GASGMASKÇGSA</div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="relacionadas">Relacionadas</label>
        <div className="containerHover">
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
          <div id='info-hover' class= 'right'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.1" stroke="currentColor" className="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <div className='info-texto'>TESTE</div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="campos">Campos</label>
        <div>
          <Select
            isMulti
            name="campos"
            options={campoOptions} // Já sem duplicatas
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
