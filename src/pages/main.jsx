import React, { useState, useEffect } from 'react';
import TabelaCampos from '../components/modais/TabelasCampos';
import CamposSelecionados from '../components/modais/CamposSelecionados';
import GerarRelatorio from '../components/modais/GerarRelatorio';
import logoSystextil from '../assets/imagens/logo-systextil-branca.png';
import { resetTotalizers, removeSelectedTotalizers } from '../components/modais/CamposSelecionados';
import ModalNotificacao from '../components/modais/ModalNotificacao';
import Footer from '../components/Campos/Footer';

function Main() {
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [availableCampos, setAvailableCampos] = useState([]);
  const [selectedTabela, setSelectedTabela] = useState('');
  const [selectedRelacionada, setSelectedRelacionada] = useState('');
  const [checkedCampos, setCheckedCampos] = useState([]);
  const [pdfOK, setPdfOK] = useState(false);
  const [mainRequestLoaded, setMainRequestLoaded] = useState(false);

  useEffect(() => {
    if (mainRequestLoaded) {
      const camposToAdd = mainRequestLoaded.columns.map(campo => ({
        value: campo.name,
        type: campo.type,
        apelido: campo.nickName || ''
      }));


      setSelectedCampos(prevSelectedCampos => {
        const newCampos = camposToAdd.filter(campo => {
          return !prevSelectedCampos.some(selected => selected.value === campo.value);
        });

        return [...prevSelectedCampos, ...newCampos];
      });

      setAvailableCampos([]);  
    }
  }, [mainRequestLoaded]);

  const handleSelectedCamposChange = (updatedCampos) => {
    setSelectedCampos(updatedCampos);
  };

  // Atualiza o estado quando os dados são alterados no componente TabelaCampos
  const handleDataChange = (data) => {
    setAvailableCampos(data.campos.filter(campo => !selectedCampos.includes(campo)));
    setSelectedTabela(data.tabela);
    setSelectedRelacionada(data.relacionada || []);
    console.log("Data: " + JSON.stringify(data)) // Agora espera um array de relacionadas
  };

  // Remove campos selecionados com checkbox marcado e adiciona de volta aos disponíveis
  const handleIndividualLeftClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('clearSelectedCampos'));
    }

    const camposParaRemover = selectedCampos.filter(campo =>
      typeof campo.value === 'string' && checkedCampos.includes(campo.value)
    );
    const camposRestantes = selectedCampos.filter(campo =>
      !(typeof campo.value === 'string' && checkedCampos.includes(campo.value))
    );
    const orderByString = sessionStorage.getItem('orderByString') || '';

    removeSelectedTotalizers(camposParaRemover.map(campo => campo.value));

    if (camposParaRemover.some(campo => orderByString.includes(campo.value))) {
      sessionStorage.setItem('orderByString', '');
    }

    setAvailableCampos([...availableCampos, ...camposParaRemover]);
    setSelectedCampos(camposRestantes);
    setCheckedCampos([]);
  };

  // Move todos os campos disponíveis para a lista de campos selecionados e limpa a lista de disponíveis
  const handleAllRightClick = () => {
    setSelectedCampos(prevSelectedCampos => {
      const newCampos = availableCampos.filter(campo => {
        return !prevSelectedCampos.some(selected => selected.value === campo.value);
      });

      // Retorna a nova lista de campos selecionados
      return [...prevSelectedCampos, ...newCampos];
    });

    setAvailableCampos([]);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('clearSelectedCampos'));
    }
  };

  // Move todos os campos selecionados para a lista de disponíveis e limpa a lista de selecionados
  const handleAllLeftClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('clearSelectedCampos'));
    }

    sessionStorage.setItem('orderByString', '');
    resetTotalizers();
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
  const handleCheckboxChange = (campoValue) => {
    setCheckedCampos(prevChecked =>
      prevChecked.includes(campoValue)
        ? prevChecked.filter(item => item !== campoValue)
        : [...prevChecked, campoValue]
    );
  };

  return (
    <div className="main-container">
      {pdfOK && (
        <span className="fixed top-2 right-2 bg-custom-vermelho text-white rounded-full text-[8px] w-3 h-3 flex justify-center items-center z-10">
          !
        </span>
      )}
      <ModalNotificacao
        setPdfOK={setPdfOK}
        pdfOK={pdfOK}
      />
      <div className='content flex flex-col justify-center'>
        <div className="flex justify-around items-start">
          <div>
            <h1 className="font-bold text-3xl mt-4 ml-20">Tabelas e Campos</h1>
            <TabelaCampos onDataChange={handleDataChange} handleAllLeftClick={handleAllLeftClick} mainRequestLoaded={mainRequestLoaded} />
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
                onClick={handleAllRightClick}
                className='left rounded-full bg-custom-vermelho hover:bg-custom-vermelho-escuro active:bg-custom-vermelho w-10 h-10 my-3 justify-center items-center flex'
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                <div className="info-texto">Adicionar todos os campos selecionados</div>
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
          </div>
          <div className="mr-16">
            <h1 className="font-bold text-3xl mt-4 mb-6 mr-10">Campos Selecionados</h1>
            <CamposSelecionados
              selectedCampos={selectedCampos}
              onDragEnd={onDragEnd}
              checkedCampos={checkedCampos}
              handleCheckboxChange={handleCheckboxChange}
              onSelectedCamposChange={handleSelectedCamposChange}
              mainRequestLoaded={mainRequestLoaded}
            />
          </div>
        </div>
        <GerarRelatorio
          selectedColumns={selectedCampos}
          selectTable={selectedTabela}
          selectedRelatedTables={selectedRelacionada}
          setPdfOK={setPdfOK}
          setMainRequestLoaded={setMainRequestLoaded}
        />
        <Footer logoSystextil={logoSystextil} />
      </div>
    </div>
  );
}

export default Main;