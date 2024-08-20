import React, { useState, useEffect } from 'react';

function TabelaCampos({ onDataChange }) {
  const [jsonData, setJsonData] = useState({});
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState('');
  const [selectedCampos, setSelectedCampos] = useState([]);

  useEffect(() => {
    async function fetchJsonData() {
      try {
        // Exemplo de chamada à API para buscar o JSON
        const response = await fetch('http://localhost:8080/procurar/tabela', {
          credentials: 'include' // Se precisar enviar cookies ou outros credenciais
        });

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Dados recebidos:', data);

        setJsonData(data); // Armazene o JSON no estado
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

  return (
    <div className="flex flex-col justify-start items-start ml-20">
      <div className="mt-5">
        <label htmlFor="tabelas">Tabela</label>
        <div>
          <select
            name="tabelas"
            id="tabela"
            className="w-56 border-2 border-neutral-300 mt-2"
            onChange={(e) => {
              setSelectedTabela(e.target.value);
              setSelectedRelacionada('');  // Resetando relacionadas e campos ao selecionar nova tabela
              setSelectedCampos([]);
            }}
            value={selectedTabela}
          >
            <option value="">Selecione uma tabela</option>
            {tabelas.length > 0 ? (
              tabelas.map((tabela) => (
                <option key={tabela} value={tabela}>
                  {tabela}
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
            {/* Coloque aqui as opções para as relacionadas */}
            {/* Você pode adicionar as opções das tabelas relacionadas conforme sua necessidade */}
            <option value="relacionada1">Relacionada 1</option>
            <option value="relacionada2">Relacionada 2</option>
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
            {selectedTabela && jsonData[selectedTabela] ? (
              jsonData[selectedTabela].map((campo) => (
                <option key={campo} value={campo}>
                  {campo}
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
