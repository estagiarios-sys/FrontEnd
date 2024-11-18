import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Select from 'react-select';
import { getSelectedCampos } from './CamposSelecionados';
import { linkFinal } from '../config.js';


function TabelaCampos({ onDataChange, handleAllLeftClick, mainRequestLoaded }) {
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
        const response = await fetch(`${linkFinal}/tables`, {
          credentials: 'include',
          headers: {
            'Authorization': sessionStorage.getItem('token'),
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
            'Authorization': sessionStorage.getItem('token'),
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
    if (mainRequestLoaded) {
      setSelectedTabela(mainRequestLoaded.table);
      setSelectedRelacionada(mainRequestLoaded.tablesPairs);
    }
  }, [mainRequestLoaded]);

  const tabelas = Array.from(jsonData).map(tabela => ({ value: tabela, label: tabela }));

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        tabela: selectedTabela,
        relacionada: [...new Set(selectedRelacionada)],
        campos: [...new Set(selectedCampos)]
      });
    }
  }, [selectedTabela, selectedRelacionada, selectedCampos]);

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
          .filter(rel => rel.includes(relacionadaTabela))
          .forEach(rel => {
            const tabelas = rel.split(' e ');

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
      .filter(rel => rel.includes(selectedTabela))
      .flatMap(rel => rel.split(' e '))
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
        .filter(rel => rel.includes(relacionadaTabelaNome))
        .flatMap(rel => rel.split(' e '))
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
    setSelectedCampos(selectedOptions ? selectedOptions.map(option => ({
      value: option.value,
      type: option.type,
      apelido: ''
    })) : []);
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