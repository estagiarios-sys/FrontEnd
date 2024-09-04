import React, { useState, useEffect, useMemo, useRef } from 'react';
import Select from 'react-select';
import './genericos/infoClick.css';
import './genericos/infoHover.css';
import './genericos/lista.css';

function TabelaCampos({ onDataChange, handleAllLeftClick }) {
  const [jsonData, setJsonData] = useState({});
  const [relationships, setRelationships] = useState([]);
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState([]);
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [mostrarInfo1, setMostrarInfo1] = useState(false);
  const [mostrarInfo2, setMostrarInfo2] = useState(false);
  const [mostrarInfo3, setMostrarInfo3] = useState(false);

  const [menuIsOpen, setMenuIsOpen] = useState(false);

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
  
    if (selectedRelacionada && selectedRelacionada.length > 0 && selectedTabela) {
      selectedRelacionada.forEach(relacionadaTabela => {
        relationships
          .filter(rel => rel.tabelas.includes(selectedTabela) && rel.tabelas.includes(relacionadaTabela))
          .forEach(rel => {
            const tabelas = rel.tabelas.split(' e '); 
  
            tabelas.forEach(table => {
              if (table !== selectedTabela && jsonData[table]) {
                jsonData[table].forEach(campo => {
                  options.push({ value: `${table}.${campo}`, label: `${table} - ${campo}` });
                });
              }
            });
          });
      });
    }
  
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
        setMostrarInfo1(false);
        setMostrarInfo2(false);
        setMostrarInfo3(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (selectedOptions) => {
    setSelectedCampos(selectedOptions ? selectedOptions.map(option => option.value) : []);
    // Mantém o menu aberto após a seleção
    setMenuIsOpen(true);
  };

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
              setSelectedRelacionada([]);
              setSelectedCampos([]);
              handleAllLeftClick();
            }}
            value={tabelaOptions.find(option => option.value === selectedTabela)}
          />
          <div id='info-click' className={mostrarInfo1 ? 'right show' : 'right'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => setMostrarInfo1(prev => !prev)} ref={buttonRef}>
              <svg class="icon-info-click" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill="currentColor" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
              </svg>
            </button>
            <div className='info-texto'>Selecione a tabela que será consultada</div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="relacionadas">Relacionadas</label>
        <div className="containerHover">
          <Select
            isMulti
            name="relacionadas"
            options={relacionadaOptions}
            className="basic-single w-60"
            classNamePrefix="Select"
            placeholder="Selecione uma relação..."
            onChange={(selectedOptions) => {
              setSelectedRelacionada(selectedOptions ? selectedOptions.map(option => option.value) : []);
              handleAllLeftClick();
            }}
            value={relacionadaOptions.filter(option => selectedRelacionada.includes(option.value))}
            closeMenuOnSelect={false}
          />
          <div id='info-click' className={mostrarInfo2 ? 'right show' : 'right'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => setMostrarInfo2(prev => !prev)} ref={buttonRef}>
              <svg class="icon-info-click" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill="currentColor" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
              </svg>
            </button>
            <div className='info-texto'>Selecione a tabela que será relacionada com a principal</div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="campos">Campos</label>
        <div className="containerHover">
          <Select
            isMulti
            name="campos"
            options={campoOptions}
            className="basic-multi-select w-60"
            classNamePrefix="Select"
            placeholder="Selecione os Campos..."
            onChange={handleChange}
            value={campoOptions.filter(option => selectedCampos.includes(option.value))}
            menuIsOpen={menuIsOpen} // Controla a visibilidade do menu
            onMenuOpen={() => setMenuIsOpen(true)} // Abre o menu
            onMenuClose={() => setMenuIsOpen(false)} // Fecha o menu
          />
          <div id='info-click' className={mostrarInfo3? 'right show' : 'right'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => setMostrarInfo3(prev => !prev)} ref={buttonRef}>
              <svg class="icon-info-click" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill="currentColor" fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
              </svg>
            </button>
            <div className='info-texto'>Selecione os campos que serão utilizados na consulta</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabelaCampos;
