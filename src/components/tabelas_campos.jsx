import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Select from 'react-select';
import { getSelectedCampos } from './CamposSelecionados';

function TabelaCampos({ onDataChange, handleAllLeftClick, passHandleLoadFromLocalStorage }) {
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

  const campos = getSelectedCampos();

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

  const extractFieldsAndTablesFromSQL = (sqlQuery, relationships) => {
    // Captura a tabela principal do FROM e as tabelas relacionadas do JOIN
    const regexTabelas = /FROM\s+(\w+)|JOIN\s+(\w+)/g;
    const regexCampos = /SELECT\s+(.*?)\s+FROM/;

    const tabelas = [];
    const campos = [];

    let matchTabelas;

    // Loop para capturar todas as tabelas do SQL
    while ((matchTabelas = regexTabelas.exec(sqlQuery)) !== null) {
      const tabela = matchTabelas[1] || matchTabelas[2];
      if (tabela && !tabelas.includes(tabela)) {
        tabelas.push(tabela);
      }
    }

    // Captura os campos da consulta
    const matchCampos = sqlQuery.match(regexCampos);
    if (matchCampos) {
      const listaCampos = matchCampos[1].split(',').map(campo => campo.trim());
      campos.push(...listaCampos);
    }

    // Filtra os relacionamentos para incluir apenas aqueles que estão realmente no SQL
    const relacionadas = [...new Set(tabelas.reduce((acc, tabelaPrincipal) => {
      relationships.forEach(rel => {
        const [tabela1, tabela2] = rel.tabelas.split(' e ');

        // Verifica se a tabelaPrincipal faz parte do relacionamento e se não está já invertido.
        if ((tabela1 === tabelaPrincipal || tabela2 === tabelaPrincipal) && !acc.includes(`${tabela2} e ${tabela1}`) && !acc.includes(`${tabela1} e ${tabela2}`)) {

          // Verifica se ambas as tabelas estão nas tabelas extraídas da SQL
          if (tabelas.includes(tabela1) && tabelas.includes(tabela2)) {
            const isTabelaPrincipalPrimeira = tabela1 === tabelaPrincipal;
            const relacao = isTabelaPrincipalPrimeira ? `${tabela1} e ${tabela2}` : `${tabela2} e ${tabela1}`;

            // Adiciona a relação apenas se ela ainda não estiver presente.
            if (!acc.includes(relacao)) {
              acc.push(relacao);
            }
          }
        }
      });

      return acc;
    }, []))]; // Garante que não haja duplicatas com Set

    return { tabelas, relacionadas, campos };
  };

  const handleLoadFromLocalStorage = useCallback(() => {
    const sqlQuery = localStorage.getItem('loadedQuery');
    if (sqlQuery) {
      const { tabelas, relacionadas, campos } = extractFieldsAndTablesFromSQL(sqlQuery, relationships);

      if (tabelas.length > 0) {
        setSelectedTabela(tabelas[0]);

        // Vamos garantir que o relacionamento seja filtrado de acordo com o que está no SQL
        const relacionamentosValidos = relacionadas.filter(relacionada => {
          // Pega ambas as tabelas do relacionamento, que estão no formato "tabela1 e tabela2"
          const [tabela1, tabela2] = relacionada.split(' e ');

          // Verifica se ambas as tabelas do relacionamento estão na lista de tabelas extraídas do SQL
          return tabelas.includes(tabela1) && tabelas.includes(tabela2);
        });

        // Atualiza relacionamentos no estado sem duplicatas
        setSelectedRelacionada(prevRelacionada => {
          const updatedRelacionada = [...new Set([...relacionamentosValidos])];
          return updatedRelacionada;
        });

        // Atualiza campos sem duplicação
        setSelectedCampos(prevCampos => {
          const updatedCampos = [...new Set([...prevCampos, ...campos.map(campo => {
            const [tabela, campoNome] = campo.split('.');
            return `${tabela}.${campoNome}`;
          })])];
          return updatedCampos;
        });
      }
    }
  }, [relationships]);

  useEffect(() => {
    if (passHandleLoadFromLocalStorage) {
      passHandleLoadFromLocalStorage(handleLoadFromLocalStorage);
    }
  }, [handleLoadFromLocalStorage, passHandleLoadFromLocalStorage]); // Inclua handleLoadFromLocalStorage como dependência

  const tabelas = Object.keys(jsonData);

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        tabela: selectedTabela,
        relacionada: [...new Set(selectedRelacionada)],
        campos: [...new Set(selectedCampos)]
      });
    }
  }, [selectedTabela, selectedRelacionada, selectedCampos]);


  const tabelaOptions = tabelas.map(tabela => ({
    value: tabela,
    label: tabela,
  }));

  const campoOptions = useMemo(() => {
    const selectedValues = new Set(campos.map(campo => campo.value)); // Move para dentro do useMemo

    const options = new Map();

    if (selectedTabela && jsonData[selectedTabela]) {
      Object.keys(jsonData[selectedTabela]).forEach(campo => {
        const optionValue = `${selectedTabela}.${campo}`;
        if (!selectedValues.has(optionValue)) { // Verifica se o campo já está selecionado
          options.set(optionValue, {
            value: optionValue,
            label: `${selectedTabela} - ${campo}`,
            type: jsonData[selectedTabela][campo]
          });
        }
      });
    }

    // Adiciona campos das tabelas selecionadas como relacionadas
    if (selectedRelacionada.length > 0) {
      selectedRelacionada.forEach(relacionadaTabela => {
        relacionadaTabela = relacionadaTabela.split(' e ')[1];
        relationships
          .filter(rel => rel.tabelas.includes(relacionadaTabela))
          .forEach(rel => {
            const tabelas = rel.tabelas.split(' e ');

            tabelas.forEach(table => {
              if (table !== selectedTabela && table === relacionadaTabela && jsonData[table]) {
                Object.keys(jsonData[table]).forEach(campo => {
                  const optionValue = `${table}.${campo}`;
                  if (!selectedValues.has(optionValue)) { // Verifica se o campo já está selecionado
                    options.set(optionValue, {
                      value: optionValue,
                      label: `${table} - ${campo}`,
                      type: jsonData[table][campo]
                    });
                  }
                });
              }
            });
          });
      });
    }

    return Array.from(options.values());
  }, [selectedTabela, jsonData, selectedRelacionada, relationships, campos]); // 'selectedValues' não precisa estar aqui

  const relacionadaOptions = useMemo(() => {
    if (!selectedTabela) return [];

    const todasRelacionadas = new Set();

    // Adiciona as tabelas relacionadas automaticamente com o formato "tabela_principal e tabela_relacionada"
    relationships
      .filter(rel => rel.tabelas.includes(selectedTabela))
      .flatMap(rel => rel.tabelas.split(' e '))
      .forEach(tabela => {
        if (tabela !== selectedTabela) {
          const relacionamento = `${selectedTabela} e ${tabela}`;
          const relacionamentoInverso = `${tabela} e ${selectedTabela}`;

          if (!todasRelacionadas.has(relacionamentoInverso) && !todasRelacionadas.has(relacionamento)) {
            todasRelacionadas.add(relacionamento); // Adiciona o relacionamento corretamente formatado
          }
        }
      });

    // Adiciona as tabelas que já foram selecionadas ou extraídas do LocalStorage
    selectedRelacionada.forEach(relacionadaTabela => {
      const relacionadaTabelaNome = relacionadaTabela.includes(' e ') ? relacionadaTabela.split(' e ')[1] : relacionadaTabela;

      // Verifica se essa relação já foi adicionada antes de processar
      relationships
        .filter(rel => rel.tabelas.includes(relacionadaTabelaNome))
        .flatMap(rel => rel.tabelas.split(' e '))
        .forEach(tabela => {
          if (tabela !== relacionadaTabelaNome && tabela !== selectedTabela) {
            const relacionamento = `${relacionadaTabelaNome} e ${tabela}`;
            const relacionamentoInverso = `${tabela} e ${relacionadaTabelaNome}`;

            if (!todasRelacionadas.has(relacionamentoInverso) && !todasRelacionadas.has(relacionamento)) {
              todasRelacionadas.add(relacionamento); // Adiciona o relacionamento corretamente formatado
            }
          }
        });

      // Adiciona a própria tabela relacionada do LocalStorage (sem duplicação)
      if (!todasRelacionadas.has(relacionadaTabela)) {
        todasRelacionadas.add(relacionadaTabela); // Adiciona do localStorage se não estiver já presente
      }
    });

    // Garante que o select de "Relacionadas" fique vazio se não houver relacionamentos
    if (todasRelacionadas.size === 0) return [];

    // Mapeia as tabelas relacionadas para o formato do select
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

  const handleChange = (selectedOptions) => {
    setSelectedCampos(selectedOptions ? selectedOptions.map(option => ({ value: option.value, type: option.type })) : []);
    // Mantém o menu aberto após a seleção
    setMenuIsOpen(true);
  };

  const customStyles = {
    valueContainer: (provided) => ({
      ...provided,
      maxHeight: '120px', // Altura máxima do container de opções selecionadas
      overflowY: 'auto', // Habilita o scroll quando a altura for excedida
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
            options={tabelaOptions}
            className="basic-single w-96"
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
            options={relacionadaOptions} // Opções geradas pelo useMemo
            className="basic-single w-96"
            classNamePrefix="Select"
            placeholder="Selecione uma relação..."
            onChange={(selectedOptions) => {
              const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
              setSelectedRelacionada(selectedValues); // Atualiza o estado de tabelas relacionadas
              handleAllLeftClick(); // Alguma ação que você já está utilizando
            }}
            value={relacionadaOptions.filter(option => selectedRelacionada.includes(option.value))} // Mantém os valores selecionados
            closeMenuOnSelect={false}
            styles={customStyles} // Aplica os estilos customizados
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
        <label htmlFor="campos">Campos</label>
        <div className="containerHover">
          <Select
            isMulti
            name="campos"
            inputId="campos"
            options={campoOptions} // Campos gerados a partir das tabelas selecionadas
            className="basic-multi-select w-96"
            classNamePrefix="Select"
            placeholder="Selecione os Campos..."
            onChange={handleChange}
            value={campoOptions.filter(option =>
              selectedCampos.some(selected => selected.value === option.value) // Filtra pelos objetos em selectedCampos
            )}
            menuIsOpen={menuIsOpen} // Controla a visibilidade do menu
            onMenuOpen={() => setMenuIsOpen(true)} // Abre o menu
            onMenuClose={() => setMenuIsOpen(false)} // Fecha o menu
            styles={customStyles} // Aplica os estilos customizados
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
