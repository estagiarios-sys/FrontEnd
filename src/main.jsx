import React, { useState } from 'react';
import TabelaCampos from './components/tabelas_campos';
import CamposSelecionados from './components/CamposSelecionados';
import GerarRelatorio from './components/GerarRelatorio';
import logoSystextil from './imagens/logo-systextil.svg';

function Main() {
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [availableCampos, setAvailableCampos] = useState([]);
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState('');
  const [checkedCampos, setCheckedCampos] = useState([]);
  const [handleLoadFromLocalStorage, setHandleLoadFromLocalStorage] = useState(null);

  const passHandleLoadFromLocalStorage = (fn) => {
    setHandleLoadFromLocalStorage(() => fn); // Armazena a função no estado
  };
  const handleSelectedCamposChange = (updatedCampos) => {
    setSelectedCampos(updatedCampos);
  };

  // Atualiza o estado quando os dados são alterados no componente TabelaCampos
  const handleDataChange = (data) => {
    setAvailableCampos(data.campos.filter(campo => !selectedCampos.includes(campo)));
    setSelectedTabela(data.tabela);
    setSelectedRelacionada(data.relacionada || []); // Agora espera um array de relacionadas
  };

  // Adiciona o primeiro campo disponível à lista de campos selecionados
  const handleIndividualRightClick = () => {
    if (availableCampos.length > 0) {
      const [firstCampo, ...rest] = availableCampos;
      setSelectedCampos([...selectedCampos, firstCampo]);
      setAvailableCampos(rest);
    }
  };

  // Remove campos selecionados com checkbox marcado e adiciona de volta aos disponíveis
  const handleIndividualLeftClick = () => {
    const camposParaRemover = selectedCampos.filter(campo => checkedCampos.includes(campo));
    const camposRestantes = selectedCampos.filter(campo => !checkedCampos.includes(campo));
    const orderByString = localStorage.getItem('orderByString') || '';

    if (camposParaRemover.some(campo => orderByString.includes(campo))) {
      localStorage.setItem('orderByString', '');
      console.log('Removido o orderByString do localStorage, no left click');
    }

    setAvailableCampos([...availableCampos, ...camposParaRemover]);
    setSelectedCampos(camposRestantes);
    setCheckedCampos([]);
  };

  // Move todos os campos disponíveis para a lista de campos selecionados e limpa a lista de disponíveis
  const handleAllRightClick = () => {
    setSelectedCampos(prevSelectedCampos => [
      ...prevSelectedCampos,
      ...availableCampos
    ]);
    setAvailableCampos([]);

    // Limpa os campos selecionados no componente TabelaCampos
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('clearSelectedCampos'));
    }
  };

  // Move todos os campos selecionados para a lista de disponíveis e limpa a lista de selecionados
  const handleAllLeftClick = () => {
    localStorage.setItem('orderByString', '');
    setAvailableCampos(prevAvailableCampos => [
      ...prevAvailableCampos,
      ...selectedCampos
    ]);
    setSelectedCampos([]);
  };

  // Atualiza a ordem dos campos selecionados com base na operação de arrastar e soltar
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    const updatedCampos = Array.from(selectedCampos);
    const [movedCampo] = updatedCampos.splice(source.index, 1);
    updatedCampos.splice(destination.index, 0, movedCampo);

    setSelectedCampos(updatedCampos);
  };

  // Alterna o estado dos checkboxes
  const handleCheckboxChange = (campo) => {
    setCheckedCampos(prevChecked =>
      prevChecked.includes(campo)
        ? prevChecked.filter(item => item !== campo)
        : [...prevChecked, campo]
    );
  };

  return (
    <div className="main-container">
      <div className='content flex flex-col justify-center'>
        <div className="flex justify-around items-start">
          <div>
            <h1 className="font-bold text-3xl mt-4 ml-20">Tabelas e Campos</h1>
            <TabelaCampos onDataChange={handleDataChange} handleAllLeftClick={handleAllLeftClick} passHandleLoadFromLocalStorage={passHandleLoadFromLocalStorage}/>
          </div>
          <div>
            <div className='mt-36'>
              <button id='info-hover'
                onClick={handleIndividualLeftClick}
                className='left rounded-full bg-custom-azul hover:bg-custom-azul-escuro active:bg-custom-azul w-10 h-10 my-3 justify-center items-center flex'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <div className="info-texto">Remover campos selecionados</div>
              </button>
            </div>
            <div>
              <button id='info-hover'
                onClick={handleIndividualRightClick}
                className='left rounded-full bg-custom-azul hover:bg-custom-azul-escuro active:bg-custom-azul w-10 h-10 my-3 justify-center items-center flex'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                <div className="info-texto">Adicionar primeiro campo selecionado</div>
              </button>
            </div>
            <div>
              <button id='info-hover'
                onClick={handleAllLeftClick}
                className='left rounded-full bg-custom-vermelho hover:bg-custom-vermelho-escuro active:bg-custom-vermelho w-10 h-10 my-3 justify-center items-center flex'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <div className="info-texto">Remover todos os campos</div>
              </button>
            </div>
            <div>
              <button id='info-hover'
                onClick={handleAllRightClick}
                className='left rounded-full bg-custom-vermelho hover:bg-custom-vermelho-escuro active:bg-custom-vermelho w-10 h-10 my-3 justify-center items-center flex'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                <div className="info-texto">Adicionar todos os campos selecionados</div>
              </button>
            </div>
          </div>
          <div>
            <h1 className="font-bold text-3xl mt-4 mb-6 mr-10">Campos Selecionados</h1>
            <CamposSelecionados
              selectedCampos={selectedCampos}
              onDragEnd={onDragEnd}
              checkedCampos={checkedCampos}
              handleCheckboxChange={handleCheckboxChange}
              onSelectedCamposChange={handleSelectedCamposChange}
            />
          </div>
        </div>
        <GerarRelatorio
          selectedColumns={selectedCampos}
          selectTable={selectedTabela}
          selectedRelacionada={selectedRelacionada}
          handleLoadFromLocalStorage={handleLoadFromLocalStorage}
        />
        <footer className="footer">
          <span className="copyright-text">©  Copyright 2024 - Systextil - Todos os direitos reservados</span>
          <div className="text-and-logo">
            <img src={logoSystextil} alt="Descrição da Imagem" />
            <span className="separator">|</span>
            <span>Simplificando a cadeia têxtil!</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Main;
