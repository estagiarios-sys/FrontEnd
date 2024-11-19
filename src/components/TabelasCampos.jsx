import React, { useState, useEffect, useMemo, useRef } from 'react';
import Select from 'react-select';
import { getSelectedCampos } from './CamposSelecionados';
import { linkFinal } from '../config.js';
import Loading from './genericos/Loading';

function TabelaCampos({ onDataChange, handleAllLeftClick, mainRequestLoaded }) {
  const [jsonData, setJsonData] = useState({});
  const [relationships, setRelationships] = useState([]);
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState([]);
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [columnsData, setColumnsData] = useState({});
  const [mostrarInfo, setMostrarInfo] = useState(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [valores, setValores] = useState([]);
  const [isloading, setIsLoading] = useState(true);

  const dicaRef = useRef(null);
  const buttonRef = useRef(null);
  const campos = getSelectedCampos();

  const toggleInfo = (infoId) => {
    setMostrarInfo((prev) => (prev === infoId ? null : infoId));
  };

  // realizando duas requisicoes paralelas ao carregar a pagina
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [tablesResponse, relationshipsResponse] = await Promise.all([
          fetch(`${linkFinal}/tables`, {
            credentials: 'include',
            headers: {
              'Authorization': sessionStorage.getItem('token'),
            },
          }),
          fetch(`${linkFinal}/relationships`, {
            credentials: 'include',
            headers: {
              'Authorization': sessionStorage.getItem('token'),
            },
          }),
        ]);

        if (!tablesResponse.ok || !relationshipsResponse.ok) {
          throw new Error(
            `Erro nas requisições: ${!tablesResponse.ok ? `Tables (${tablesResponse.status})` : ''
            } ${!relationshipsResponse.ok ? `Relationships (${relationshipsResponse.status})` : ''
            }`
          );
        }

        const tablesData = await tablesResponse.json();
        const relationshipsData = await relationshipsResponse.json();


        setJsonData(tablesData);
        setRelationships(relationshipsData);


        if (mainRequestLoaded) {
          setSelectedTabela(mainRequestLoaded.table);
          setSelectedRelacionada(mainRequestLoaded.tablesPairs);
        }
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialData();
  }, [mainRequestLoaded]);



  useEffect(() => {
    async function fetchColumns() {
      if (!selectedTabela) return;

      try {
        // Faz a requisição para buscar colunas da tabela principal e tabelas relacionadas
        const response = await fetch(`${linkFinal}/tables/columns`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('token'),
          },
          body: JSON.stringify({
            mainTable: selectedTabela,
            tablesPairs: selectedRelacionada,
          }),
        });

        const data = await response.json();
        

        //  Obtém as colunas associadas à tabela principal.
        const mainTableValues = data[selectedTabela] || {};

        // Mescla os campos das tabelas relacionadas
        let combinedValues = { ...mainTableValues };

        // Itera pelas tabelas relacionadas para mesclar suas colunas
        for (const relatedPair of selectedRelacionada) {
          // Extrai o nome da tabela relacionada
          const tablesInPair = relatedPair.split(' e ');
          const relatedTableName = tablesInPair.find(name => name !== selectedTabela);

          const relatedTableValues = data[relatedTableName] || {};

          combinedValues = { ...combinedValues, ...relatedTableValues };
        }

        // Atualiza o estado com os campos combinados
        setValores(combinedValues);
        setColumnsData(data);
   

      } catch (error) {
        console.error('Erro ao buscar as colunas:', error);
        setColumnsData({});
      }
    }

    fetchColumns();
  }, [selectedTabela, selectedRelacionada]);


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



  // Criar uma lista de opções formatadas para exibir os campos da tabela principal no formato "Tabela - Campo"
  const campoOptions = useMemo(() => {
    const selectedValues = new Set(campos.map(campo => campo.value));
    const options = new Map();

    if (selectedTabela && columnsData[selectedTabela]) {
      Object.entries(columnsData[selectedTabela]).forEach(([campo, tipo]) => {
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
    if (selectedRelacionada.length > 0 && columnsData) {
      selectedRelacionada.forEach(relacionadaTabela => {
        const tablesInPair = relacionadaTabela.split(' e ');
        const relacionadaTabelaNome = tablesInPair.find(name => name !== selectedTabela);

        if (columnsData[relacionadaTabelaNome]) {
          Object.entries(columnsData[relacionadaTabelaNome]).forEach(([campo, tipo]) => {
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
  }, [selectedTabela, columnsData, selectedRelacionada, relationships, campos]);

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
      const tablesInPair = relacionadaTabela.split(' e ');
      const relacionadaTabelaNome = tablesInPair.find(name => name !== selectedTabela);

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



  // Limpar a lista de campos selecionados
  useEffect(() => {
    const handleClearSelectedCampos = () => {
      setSelectedCampos([]);
    };
    window.addEventListener('clearSelectedCampos', handleClearSelectedCampos);
    return () => {
      window.removeEventListener('clearSelectedCampos', handleClearSelectedCampos);
    };
  }, []);


  // Função para lidar com o clique fora do componente
  const handleClickOutside = (event) => {
    if (
      dicaRef.current &&
      !dicaRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setMostrarInfo(null);
    }
  };


  // Função para lidar com o clique fora do componente 
  const handleChange = (selectedOptions) => {
    const updatedCampos = selectedOptions
      ? selectedOptions.map((option) => {
          // Busca o campo correspondente para manter os valores
          const existingCampo = campoOptions.find(
            (campo) => campo.value === option.value
          );
  
          return existingCampo
            ? {
                value: existingCampo.value,
                type: existingCampo.type, // Preserva o type
                apelido: '',
              }
            : null;
        }).filter(Boolean) // Remove valores nulos caso não encontre o campo
      : [];
  
    console.log('Updated selectedCampos:', updatedCampos);
    setSelectedCampos(updatedCampos);
    setMenuIsOpen(true);
  };
  
  

  // Função para lidar com o clique fora do componente
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  // Função para remover um campo
  const removeField = (fieldToRemove) => {
    setSelectedCampos((prev) => prev.filter((field) => field.value !== fieldToRemove));
  };


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
      {isloading && <Loading />}
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
          <div id='info-click' className={mostrarInfo === 'info1' ? 'up show' : 'up'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => toggleInfo('info1')} ref={buttonRef}>
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

          <div id='info-click' className={mostrarInfo === 'info2' ? 'up show' : 'up'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => toggleInfo('info2')} ref={buttonRef}>
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
            options={campoOptions}
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

          <div id='info-click' className={mostrarInfo === 'info3' ? 'up show' : 'up'} ref={dicaRef}>
            <button id="info-click-button" onClick={() => toggleInfo('info3')} ref={buttonRef}>
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