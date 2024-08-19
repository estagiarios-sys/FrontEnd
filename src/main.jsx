import React, { useState } from 'react';
import TabelaCampos from './components/tabelas_campos';
import CamposSelecionados from './components/CamposSelecionados';

function Main() {
  const [selectedData, setSelectedData] = useState({
    tabela: '',
    relacionada: '',
    campos: []
  });

  const handleDataChange = (data) => {
    setSelectedData(data);
  };

  return (
    <div className="flex justify-around items-start">
      <div>
        <h1 className="font-bold text-3xl mt-4 ml-20">Tabelas e Campos</h1>
        <TabelaCampos onDataChange={handleDataChange} />
      </div>
      <div>
        <div className='mt-36'>
          <div className='rounded-full bg-neutral-300 w-10 h-10 my-3 justify-center items-center flex'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </div>
        </div>
        <div>
          <div className='rounded-full bg-neutral-300 h-10 my-3 justify-center items-center flex'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
        <div>
          <div className='rounded-full bg-red-700 w-10 h-10 my-3 justify-center items-center flex'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </div>
        </div>
        <div>
          <div className='rounded-full bg-red-700 w-10 h-10 my-3 justify-center items-center flex'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-3xl mt-4 mb-6">Campos Selecionados</h1>
        <CamposSelecionados selectedData={selectedData} />
      </div>
    </div>
  );
}

export default Main;
