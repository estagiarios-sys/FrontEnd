import React, { useState } from 'react';
import TabelaCampos from './components/tabelas_campos';
import CamposSelecionados from './components/CamposSelecionados';
import GerarRelatorio from './components/GerarRelatorio';


function Main() {
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [availableCampos, setAvailableCampos] = useState([]);

  const handleDataChange = (data) => {
    setAvailableCampos(data.campos.filter(campo => !selectedCampos.includes(campo)));

  };

  const handleIndividualRightClick = () => {
    if (availableCampos.length > 0) {
      const [firstCampo, ...rest] = availableCampos;
      setSelectedCampos([...selectedCampos, firstCampo]);
      setAvailableCampos(rest);
    }
  };

  const handleIndividualLeftClick = () => {
    if (selectedCampos.length > 0) {
      const [firstCampo, ...rest] = selectedCampos;
      setAvailableCampos([...availableCampos, firstCampo]);
      setSelectedCampos(rest);
    }
  };

  const handleAllRightClick = () => {
    setSelectedCampos([...selectedCampos, ...availableCampos]);
    setAvailableCampos([]);
  };

  const handleAllLeftClick = () => {
    setAvailableCampos([...availableCampos, ...selectedCampos]);
    setSelectedCampos([]);
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
          <CamposSelecionados selectedCampos={selectedCampos} />
        </div>
      </div>
      <GerarRelatorio selectedColumns={selectedCampos} />
    </div>

  );
}

export default Main;
