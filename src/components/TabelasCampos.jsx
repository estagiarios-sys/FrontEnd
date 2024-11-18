import React, { useState, useEffect, useMemo, useRef } from 'react';
import Select from 'react-select';
import { getSelectedCampos } from './CamposSelecionados';
import { linkFinal } from '../config.js';

function TabelaCampos({ onDataChange, handleAllLeftClick, mainRequestLoaded }) {
  const [jsonData, setJsonData] = useState({});
  const [relationships, setRelationships] = useState([]);
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState([]);
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [columnsData, setColumnsData] = useState({});
  const [mostrarInfo1, setMostrarInfo1] = useState(false);
  const [mostrarInfo2, setMostrarInfo2] = useState(false);
  const [mostrarInfo3, setMostrarInfo3] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [valores, setValores] = useState([]);


  const dicaRef = useRef(null);
  const buttonRef = useRef(null);
  const campos = getSelectedCampos();
  const tablesPairs = [];
  // const valores = [];

  // Busca os dados de tabelas e relacionamentos
  useEffect(() => {
    async function fetchJsonData() {
      try {
        const response = await fetch(`${linkFinal}/tables`, {
          credentials: 'include',
          headers: {
            'Authorization': localStorage.getItem('token'),
          },
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
        const response = await fetch(`${linkFinal}/relationships`, {
          credentials: 'include',
          headers: {
            'Authorization': localStorage.getItem('token'),
          },
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

  useEffect(() => {
    async function fetchColumns() {
      if (!selectedTabela) return;

      try {
        const response = await fetch(`${linkFinal}/tables/columns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token'),
          },
          body: JSON.stringify({ mainTable: selectedTabela, tablesPairs: tablesPairs }),
        });

        const data = await response.json();

        // Extraia os valores do primeiro item
        const extractedValues = Object.values(data)[0];
        console.log('Valores:', extractedValues);

        // Atualize o estado valores
        setValores(extractedValues);

        // Atualize as colunas no estado
        setColumnsData(data);
      } catch (error) {
        console.error('Erro ao buscar as colunas:', error);
        setColumnsData({});
      }
    }

    fetchColumns();
  }, [selectedTabela]);


  // Atualiza o estado quando usar o ModalSalvos
  useEffect(() => {
    if (mainRequestLoaded) {
      setSelectedTabela(mainRequestLoaded.table);
      setSelectedRelacionada(mainRequestLoaded.tablesPairs);
    }
  }, [mainRequestLoaded]);

  const tabelas = Array.from(jsonData).map(tabela => ({
    value: tabela,
    label: tabela
  }));

  useEffect(() => {
    if (onDataChange) {
      const data = {
        tabela: selectedTabela,
        relacionada: [...new Set(selectedRelacionada)],
        campos: [...new Set(selectedCampos)],
      };
      console.log('onDataChange Triggered:', data);
      onDataChange(data);
    }
  }, [selectedTabela, selectedRelacionada, selectedCampos]);

  const campoOptions = useMemo(() => {
    const selectedValues = new Set(campos.map(campo => campo.value));
    const options = new Map();

    if (selectedTabela && jsonData[selectedTabela]) {
      Object.entries(jsonData[selectedTabela]).forEach(([campo, tipo]) => {
        const optionValue = `${selectedTabela}.${campo}`;
        if (!selectedValues.has(optionValue)) {
          options.set(optionValue, {
            value: optionValue,
            label: `${selectedTabela} - ${campo}`,
            type: tipo,
          });
        }
      });
    }

    // Adiciona campos das tabelas selecionadas como relacionadas
    if (selectedRelacionada.length > 0) {
      selectedRelacionada.forEach(relacionadaTabela => {
        const relacionadaTabelaNome = relacionadaTabela.includes(' e ')
          ? relacionadaTabela.split(' e ')[1]
          : relacionadaTabela;

        if (jsonData[relacionadaTabelaNome]) {
          Object.entries(jsonData[relacionadaTabelaNome]).forEach(([campo, tipo]) => {
            const optionValue = `${relacionadaTabelaNome}.${campo}`;
            if (!selectedValues.has(optionValue)) {
              options.set(optionValue, {
                value: optionValue,
                label: `${relacionadaTabelaNome} - ${campo}`,
                type: tipo,
              });
            }
          });
        }
      });
    }

    // Ordena as opções
    return Array.from(options.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedTabela, jsonData, selectedRelacionada, relationships, campos]);

  const relacionadaOptions = useMemo(() => {
    if (!selectedTabela) return [];

    const todasRelacionadas = new Set();

    relationships
      .filter(rel => rel.includes(selectedTabela))
      .flatMap(rel => rel.split(' e '))
      .forEach(tabela => {
        if (tabela !== selectedTabela) {
          const relacionamento = `${selectedTabela} e ${tabela}`;
          const relacionamentoInverso = `${tabela} e ${selectedTabela}`;

          if (!todasRelacionadas.has(relacionamentoInverso) && !todasRelacionadas.has(relacionamento)) {
            todasRelacionadas.add(relacionamento);
          }
        }
      });

    selectedRelacionada.forEach(relacionadaTabela => {
      const relacionadaTabelaNome = relacionadaTabela.includes(' e ') ? relacionadaTabela.split(' e ')[1] : relacionadaTabela;

      relationships
        .filter(rel => rel.includes(relacionadaTabelaNome))
        .flatMap(rel => rel.split(' e '))
        .forEach(tabela => {
          if (tabela !== relacionadaTabelaNome && tabela !== selectedTabela) {
            const relacionamento = `${relacionadaTabelaNome} e ${tabela}`;
            const relacionamentoInverso = `${tabela} e ${relacionadaTabelaNome}`;

            if (!todasRelacionadas.has(relacionamentoInverso) && !todasRelacionadas.has(relacionamento)) {
              todasRelacionadas.add(relacionamento);
            }
          }
        });

      if (!todasRelacionadas.has(relacionadaTabela)) {
        todasRelacionadas.add(relacionadaTabela);
      }
    });

    if (todasRelacionadas.size === 0) return [];

    const relacionamentosAdicionados = Array.from(todasRelacionadas).map(value => ({
      value: value,
      label: value,
    }));

    return relacionamentosAdicionados;
  }, [selectedTabela, selectedRelacionada, relationships]);

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

  // Função para remover um campo
  const removeField = (fieldToRemove) => {
    setSelectedCampos((prev) => prev.filter((field) => field.value !== fieldToRemove));
  };

  const handleChange = selectedOptions => {
    const updatedCampos = selectedOptions
      ? selectedOptions.map(option => ({
        value: option.value,
        type: option.type,
        apelido: '',
      }))
      : [];
    console.log('handleChange Triggered. New selectedCampos:', updatedCampos);
    setSelectedCampos(updatedCampos);
    setMenuIsOpen(true);
  };

  // Adiciona campos automaticamente ao selecionar tabela ou relacionamentos
  useEffect(() => {
    if (selectedTabela && jsonData[selectedTabela]) {
      const defaultFields = Object.keys(jsonData[selectedTabela]).map(campo => ({
        value: `${selectedTabela}.${campo}`,
        type: jsonData[selectedTabela][campo],
        apelido: '',
      }));

      setSelectedCampos(prev => {
        const newFields = defaultFields.filter(
          field => !prev.some(f => f.value === field.value)
        );
        console.log('Auto-selecting default fields for selectedTabela:', newFields);
        return [...prev, ...newFields];
      });
    }
  }, [selectedTabela, jsonData]);

  useEffect(() => {
    if (selectedRelacionada.length > 0) {
      const relatedFields = selectedRelacionada.flatMap(relacionada => {
        const tableName = relacionada.includes(' e ')
          ? relacionada.split(' e ')[1]
          : relacionada;
        if (jsonData[tableName]) {
          return Object.keys(jsonData[tableName]).map(campo => ({
            value: `${tableName}.${campo}`,
            type: jsonData[tableName][campo],
            apelido: '',
          }));
        }
        return [];
      });

      setSelectedCampos(prev => {
        const newFields = relatedFields.filter(
          field => !prev.some(f => f.value === field.value)
        );
        console.log('Auto-selecting related fields for selectedRelacionada:', newFields);
        return [...prev, ...newFields];
      });
    }
  }, [selectedRelacionada, jsonData]);

  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: '120px',
      overflowY: 'auto',
    }),
    multiValue: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
  };

  return (
    <div className="flex flex-col justify-start items-start ml-20">
      <div className="mt-5">
        <label htmlFor="tabelas">Tabela</label>
        <div className="containerClick">
          <Select
            name="tabelas"
            inputId="tabelas"
            options={tabelas}
            className="basic-single w-96"
            classNamePrefix="Select"
            placeholder="Selecione uma tabela..."
            onChange={(selectedOption) => {
              setSelectedTabela(selectedOption ? selectedOption.value : '');
              setSelectedRelacionada([]);
              setSelectedCampos([]);
              handleAllLeftClick();
            }}
            value={tabelas.find(option => option.value === selectedTabela)}
          />
          <div id='info-click' className={mostrarInfo1 ? 'up show' : 'up'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => setMostrarInfo1(prev => !prev)} ref={buttonRef}>
              <svg className="icon-info-click" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clipRule="evenodd" />
              </svg>
            </button>
            <div className='info-texto'>Selecione a tabela que será consultada</div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="relacionadas">Relacionadas</label>
        <div className="containerClick">
          <Select
            isMulti
            name="relacionadas"
            inputId="relacionadas"
            options={relacionadaOptions}
            className="basic-single w-96"
            classNamePrefix="Select"
            placeholder="Selecione uma relação..."
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
              setSelectedRelacionada(selectedValues);
              handleAllLeftClick();
            }}
            value={relacionadaOptions.filter(option => selectedRelacionada.includes(option.value))}
            closeMenuOnSelect={false}
            styles={customStyles}
          />

          <div id='info-click' className={mostrarInfo2 ? 'up show' : 'up'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => setMostrarInfo2(prev => !prev)} ref={buttonRef}>
              <svg className="icon-info-click" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clipRule="evenodd" />
              </svg>
            </button>
            <div className='info-texto'>Selecione a tabela que será relacionada com a principal</div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="Campos">Campos</label>
        <div className="containerHover">
          <Select
            isMulti
            name="campos"
            inputId="campos"
            options={Object.entries(valores).map(([key, value]) => ({
              value: key,
              label: key,
            }))}
            className="basic-multi-select w-96"
            classNamePrefix="Select"
            placeholder="Selecione os Campos..."
            onChange={handleChange}
            value={selectedCampos.map(campo => ({
              value: campo.value,
              label: campo.value,
            }))}
            menuIsOpen={menuIsOpen}
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            styles={customStyles}
          />

            
          <div id='info-click' className={mostrarInfo3 ? 'up show' : 'up'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => setMostrarInfo3(prev => !prev)} ref={buttonRef}>
              <svg className="icon-info-click" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fill="currentColor" fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clipRule="evenodd" />
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
