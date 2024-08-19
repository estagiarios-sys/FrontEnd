import React, { useState, useEffect } from 'react';

function TabelaCampos({ onDataChange }) {
  const [tabelas, setTabelas] = useState([]);
  const [relacionadas, setRelacionadas] = useState([]);
  const [campos, setCampos] = useState([]);

  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState('');
  const [selectedCampos, setSelectedCampos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Exemplo de chamada à API para buscar as tabelas
        const responseTabelas = await fetch('/api/tabelas');
        const tabelasData = await responseTabelas.json();
        setTabelas(tabelasData);

        // Exemplo de chamada à API para buscar as relacionadas
        const responseRelacionadas = await fetch('/api/relacionadas');
        const relacionadasData = await responseRelacionadas.json();
        setRelacionadas(relacionadasData);

        // Exemplo de chamada à API para buscar os campos
        const responseCampos = await fetch('/api/campos');
        const camposData = await responseCampos.json();
        setCampos(camposData);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    onDataChange({ tabela: selectedTabela, relacionada: selectedRelacionada, campos: selectedCampos });
  }, [selectedTabela, selectedRelacionada, selectedCampos, onDataChange]);

  return (
    <div className="flex flex-col justify-start items-start ml-20">
      <div className="mt-5">
        <label htmlFor="tabelas">Tabela</label>
        <div>
          <select
            name="tabelas"
            id="tabela"
            className="w-56 border-2 border-neutral-300 mt-2"
            onChange={(e) => setSelectedTabela(e.target.value)}
            value={selectedTabela}
          >
            <option value="">Selecione uma tabela</option>
            {tabelas.length > 0 ? (
              tabelas.map((tabela) => (
                <option key={tabela.id} value={tabela.nome}>
                  {tabela.nome}
                </option>
              ))
            ) : (
              <option value="" disabled>Nenhuma tabela disponível</option>
            )}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="relacionadas">Relacionadas</label>
        <div>
          <select
            name="relacionadas"
            id="relacionada"
            className="w-56 border-2 border-neutral-300 mt-2"
            onChange={(e) => setSelectedRelacionada(e.target.value)}
            value={selectedRelacionada}
          >
            <option value="">Selecione uma relacionada</option>
            {relacionadas.length > 0 ? (
              relacionadas.map((relacionada) => (
                <option key={relacionada.id} value={relacionada.nome}>
                  {relacionada.nome}
                </option>
              ))
            ) : (
              <option value="" disabled>Nenhuma relacionada disponível</option>
            )}
          </select>
        </div>
      </div>
      <div className="mt-5">
        <label htmlFor="campos">Campos</label>
        <div>
          <select
            name="campos"
            id="campo"
            className="w-56 border-2 border-neutral-300 mt-2"
            multiple
            onChange={(e) => setSelectedCampos([...e.target.selectedOptions].map(o => o.value))}
            value={selectedCampos}
          >
            {campos.length > 0 ? (
              campos.map((campo) => (
                <option key={campo.id} value={campo.nome}>
                  {campo.nome}
                </option>
              ))
            ) : (
              <option value="" disabled>Nenhum campo disponível</option>
            )}
          </select>
        </div>
      </div>
    </div>
  );
}

export default TabelaCampos;
