import React, { useState } from 'react';
import TabelaCampos from './components/tabelas_campos';
import CamposSelecionados from './components/CamposSelecionados';
import GerarRelatorio from './components/GerarRelatorio';

function Main() {
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [availableCampos, setAvailableCampos] = useState([]);
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState('');
  const [checkedCampos, setCheckedCampos] = useState([]);

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
    <div className='flex flex-col justify-center'>
      <div className="flex justify-around items-start">
        <div>
          <h1 className="font-bold text-3xl mt-4 ml-20">Tabelas e Campos</h1>
          <TabelaCampos onDataChange={handleDataChange} />
        </div>
        <div>
          <div className='mt-36'>
            <button 
              onClick={handleIndividualLeftClick}
              className='rounded-full bg-neutral-300 w-10 h-10 my-3 justify-center items-center flex'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>
          <div>
            <button
              onClick={handleIndividualRightClick}
              className='rounded-full bg-neutral-300 w-10 h-10 my-3 justify-center items-center flex'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
          <div>
            <button
              onClick={handleAllLeftClick}
              className='rounded-full bg-red-700 w-10 h-10 my-3 justify-center items-center flex'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          </div>
          <div>
            <button
              onClick={handleAllRightClick}
              className='rounded-full bg-red-700 w-10 h-10 my-3 justify-center items-center flex'
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
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
      />
    </div>
  );
}

export default Main;
